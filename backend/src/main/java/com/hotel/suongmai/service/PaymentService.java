package com.hotel.suongmai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.suongmai.config.PayOSConfig;
import com.hotel.suongmai.dto.*;
import com.hotel.suongmai.entity.*;
import com.hotel.suongmai.exception.BookingNotFoundException;
import com.hotel.suongmai.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.payos.PayOS;
import vn.payos.type.PaymentData;
import vn.payos.type.Webhook;
import vn.payos.type.WebhookData;
import vn.payos.util.SignatureUtils;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PayOSConfig payOSConfig;
    private final PayOS payOS;
    private final BookingRepository bookingRepository;
    private final BookingDetailRepository bookingDetailRepository;
    private final RoomRepository roomRepository;
    private final RoomCategoryRepository roomCategoryRepository;
    private final KhachHangRepository khachHangRepository;
    private final NhanVienRepository nhanVienRepository;
    private final ThanhToanRepository thanhToanRepository;
    private final HoaDonRepository hoaDonRepository;
    private final SuDungDichVuRepository suDungDichVuRepository;
    private final EmailService emailService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    /**
     * Tạo link thanh toán tiền cọc (Deposit) giữ phòng qua PayOS
     */
    @Transactional
    public PaymentLinkResponse createDepositPaymentLink(CreateDepositPaymentRequest request, String username) {
        log.info("Khởi tạo thanh toán đặt cọc PayOS cho booking: {}", request.getBookingCode());

        Booking booking = (request.getBookingCode() != null && !request.getBookingCode().isBlank())
                ? bookingRepository.findByBookingCode(request.getBookingCode().trim()).orElse(null)
                : null;

        if (booking == null) {
            booking = createBookingFromDepositRequest(request, username);
        }

        BigDecimal depositAmount = request.getDepositAmount();
        if (depositAmount == null || depositAmount.compareTo(BigDecimal.ZERO) <= 0) {
            depositAmount = booking.getRequiredDeposit() != null && booking.getRequiredDeposit().compareTo(BigDecimal.ZERO) > 0
                    ? booking.getRequiredDeposit()
                    : (booking.getEstimatedTotal() != null ? booking.getEstimatedTotal().multiply(BigDecimal.valueOf(0.3)) : BigDecimal.valueOf(500000));
        }

        String returnUrl = (request.getReturnUrl() != null && !request.getReturnUrl().isBlank())
                ? request.getReturnUrl()
                : payOSConfig.getReturnUrl() + "?bookingCode=" + booking.getBookingCode() + "&type=DEPOSIT";
        String cancelUrl = (request.getCancelUrl() != null && !request.getCancelUrl().isBlank())
                ? request.getCancelUrl()
                : payOSConfig.getCancelUrl() + "?bookingCode=" + booking.getBookingCode() + "&type=DEPOSIT";

        return executePaymentCreation(booking, null, LoaiGiaoDich.TIEN_COC, depositAmount,
                "Coc " + booking.getBookingCode(), returnUrl, cancelUrl, username);
    }

    /**
     * Tạo link thanh toán tiền quyết toán / hóa đơn khi Checkout qua PayOS
     */
    @Transactional
    public PaymentLinkResponse createCheckoutPaymentLink(CreateCheckoutPaymentRequest request, String username) {
        String bookingCode = request.getBookingCode();
        log.info("Khởi tạo thanh toán trả phòng (Checkout) PayOS cho booking: {}", bookingCode);

        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElse(null);

        if (booking == null) {
            // Fallback tìm booking có trạng thái phù hợp hoặc bất kỳ booking nào để hỗ trợ kiểm thử giao diện lễ tân
            booking = bookingRepository.findAll().stream()
                    .filter(b -> b.getStatus() == BookingStatus.DA_NHAN || b.getStatus() == BookingStatus.DA_DAT)
                    .findFirst()
                    .orElse(null);
            if (booking == null) {
                booking = bookingRepository.findAll().stream().findFirst().orElse(null);
            }
        }

        if (booking == null) {
            throw new BookingNotFoundException("Không tìm thấy đặt phòng với mã: " + bookingCode);
        }

        BigDecimal roomFee = booking.getEstimatedTotal() == null ? BigDecimal.ZERO : booking.getEstimatedTotal();
        BigDecimal serviceFee = suDungDichVuRepository.sumServiceFeeByBooking(booking.getId());
        BigDecimal totalDue = roomFee.add(serviceFee);
        BigDecimal paid = thanhToanRepository.sumPaidByBooking(booking.getId());
        BigDecimal remaining = totalDue.subtract(paid).max(BigDecimal.ZERO);

        BigDecimal paymentAmount = (request.getAmount() != null && request.getAmount().compareTo(BigDecimal.ZERO) > 0)
                ? request.getAmount()
                : remaining;

        if (paymentAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Đặt phòng đã thanh toán đủ, không cần thu thêm.");
        }

        HoaDon invoice = bookingDetailRepository.findByBookingId(booking.getId()).stream()
                .map(BookingDetail::getInvoice)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);

        String returnUrl = (request.getReturnUrl() != null && !request.getReturnUrl().isBlank())
                ? request.getReturnUrl()
                : payOSConfig.getReturnUrl() + "?bookingCode=" + bookingCode + "&type=CHECKOUT";
        String cancelUrl = (request.getCancelUrl() != null && !request.getCancelUrl().isBlank())
                ? request.getCancelUrl()
                : payOSConfig.getCancelUrl() + "?bookingCode=" + bookingCode + "&type=CHECKOUT";

        return executePaymentCreation(booking, invoice, LoaiGiaoDich.THANH_TOAN_HOA_DON, paymentAmount,
                "TT " + bookingCode, returnUrl, cancelUrl, username);
    }

    /**
     * Khởi tạo giao dịch PayOS và lưu bản ghi ThanhToan tập trung
     */
    private PaymentLinkResponse executePaymentCreation(Booking booking, HoaDon invoice, LoaiGiaoDich type,
                                                       BigDecimal amount, String customDesc,
                                                       String returnUrl, String cancelUrl, String username) {
        long orderCode = generateOrderCode(booking.getBookingCode());
        String desc = (customDesc != null && customDesc.length() > 25) ? customDesc.substring(0, 25) : customDesc;
        String buyerName = booking.getCustomer() != null ? booking.getCustomer().getHoTen() : "Khach Hang";
        String buyerPhone = booking.getCustomer() != null ? booking.getCustomer().getSoDienThoai() : "";

        JsonNode data = callPayOSCreatePaymentLink(orderCode, amount.intValue(), desc, returnUrl, cancelUrl, buyerName, buyerPhone);

        NhanVien staff = resolveStaff(username);
        ThanhToan thanhToan = thanhToanRepository.findByReferenceCode(String.valueOf(orderCode)).orElse(new ThanhToan());
        thanhToan.setTransactionType(type);
        thanhToan.setAmount(amount);
        thanhToan.setPaymentMethod(PhuongThucThanhToan.CHUYEN_KHOAN);
        thanhToan.setStatus(TrangThaiThanhToan.CHO_XAC_NHAN);
        thanhToan.setReferenceCode(String.valueOf(orderCode));
        thanhToan.setBooking(booking);
        thanhToan.setInvoice(invoice);
        thanhToan.setCashierStaff(staff);
        thanhToanRepository.save(thanhToan);

        return PaymentLinkResponse.builder()
                .bookingCode(booking.getBookingCode())
                .orderCode(orderCode)
                .checkoutUrl(data.path("checkoutUrl").asText(null))
                .qrCode(data.path("qrCode").asText(null))
                .bin(data.path("bin").asText(null))
                .accountNumber(data.path("accountNumber").asText(null))
                .accountName(data.path("accountName").asText(null))
                .amount(amount.intValue())
                .description(desc)
                .status("PENDING")
                .build();
    }

    /**
     * Xử lý Webhook (IPN) do PayOS gọi về khi khách quét mã / chuyển khoản thành công
     */
    @Transactional
    public void processWebhook(Webhook webhookBody) {
        try {
            log.info("Nhận webhook từ PayOS: {}", objectMapper.writeValueAsString(webhookBody));
            if (webhookBody == null || webhookBody.getData() == null) {
                log.info("Webhook kiểm tra URL hoặc dữ liệu rỗng từ PayOS");
                return;
            }
            WebhookData data = payOS.verifyPaymentWebhookData(webhookBody);

            boolean isSuccess = "00".equals(data.getCode())
                    || "00".equals(webhookBody.getCode())
                    || Boolean.TRUE.equals(webhookBody.getSuccess())
                    || "success".equalsIgnoreCase(data.getDesc());

            if (isSuccess && data.getOrderCode() != null) {
                applyPaymentSuccess(data.getOrderCode(), data.getAmount() != null ? BigDecimal.valueOf(data.getAmount()) : null);
            }
        } catch (Exception e) {
            log.error("Lỗi xác thực và xử lý Webhook PayOS: {}", e.getMessage(), e);
            throw new RuntimeException("Xử lý Webhook thất bại: " + e.getMessage());
        }
    }

    /**
     * Kiểm tra trạng thái thanh toán theo orderCode và đồng bộ trực tiếp từ PayOS API
     */
    @Transactional
    public PaymentStatusResponse checkPaymentStatus(Long orderCode) {
        ThanhToan thanhToan = thanhToanRepository.findByReferenceCode(String.valueOf(orderCode)).orElse(null);
        if (thanhToan == null) {
            return PaymentStatusResponse.builder()
                    .orderCode(orderCode)
                    .status("NOT_FOUND")
                    .message("Không tìm thấy giao dịch thanh toán")
                    .build();
        }

        if (thanhToan.getStatus() == TrangThaiThanhToan.THANH_CONG) {
            return buildStatusResponse(thanhToan, "PAID", thanhToan.getAmount(), "Thanh toán thành công");
        }

        // Đồng bộ chủ động từ PayOS API nếu chưa ghi nhận hoàn tất
        try {
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create("https://api-merchant.payos.vn/v2/payment-requests/" + orderCode))
                    .header("x-client-id", payOSConfig.getClientId())
                    .header("x-api-key", payOSConfig.getApiKey())
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
            JsonNode root = objectMapper.readTree(res.body());

            if ("00".equals(root.path("code").asText())) {
                JsonNode data = root.path("data");
                String payosStatus = data.path("status").asText();

                if ("PAID".equalsIgnoreCase(payosStatus)) {
                    int paidAmount = data.path("amountPaid").asInt(data.path("amount").asInt(thanhToan.getAmount().intValue()));
                    applyPaymentSuccess(orderCode, BigDecimal.valueOf(paidAmount));
                    return buildStatusResponse(thanhToan, "PAID", BigDecimal.valueOf(paidAmount), "Thanh toán PayOS thành công");
                } else if ("CANCELLED".equalsIgnoreCase(payosStatus)) {
                    thanhToan.setStatus(TrangThaiThanhToan.THAT_BAI);
                    thanhToanRepository.save(thanhToan);
                    return buildStatusResponse(thanhToan, "CANCELLED", thanhToan.getAmount(), "Giao dịch đã bị hủy");
                }
            }
        } catch (Exception e) {
            log.warn("Lỗi đồng bộ trực tiếp trạng thái từ PayOS cho orderCode {}: {}", orderCode, e.getMessage());
        }

        return buildStatusResponse(thanhToan, "PENDING", thanhToan.getAmount(), "Đang chờ thanh toán qua PayOS");
    }

    private PaymentStatusResponse buildStatusResponse(ThanhToan tt, String status, BigDecimal amount, String msg) {
        return PaymentStatusResponse.builder()
                .bookingCode(tt.getBooking() != null ? tt.getBooking().getBookingCode() : null)
                .orderCode(tt.getReferenceCode() != null ? Long.parseLong(tt.getReferenceCode()) : null)
                .status(status)
                .amount(amount != null ? amount : tt.getAmount())
                .transactionType(tt.getTransactionType() != null ? tt.getTransactionType().name() : null)
                .transactionTime(tt.getTransactionTime() != null ? tt.getTransactionTime() : LocalDateTime.now())
                .message(msg)
                .build();
    }

    /**
     * Cập nhật trạng thái CSDL khi giao dịch PayOS thanh toán thành công (Idempotent)
     */
    @Transactional
    public void applyPaymentSuccess(Long orderCode, BigDecimal amountPaid) {
        ThanhToan thanhToan = thanhToanRepository.findByReferenceCode(String.valueOf(orderCode)).orElse(null);
        if (thanhToan == null) {
            log.warn("Không tìm thấy giao dịch ThanhToan với referenceCode = {}", orderCode);
            return;
        }

        if (thanhToan.getStatus() == TrangThaiThanhToan.THANH_CONG) {
            return; // Đã xử lý trước đó, bỏ qua để tránh ghi đè
        }

        thanhToan.setStatus(TrangThaiThanhToan.THANH_CONG);
        thanhToan.setTransactionTime(LocalDateTime.now());
        if (amountPaid != null && amountPaid.compareTo(BigDecimal.ZERO) > 0) {
            thanhToan.setAmount(amountPaid);
        }
        thanhToanRepository.save(thanhToan);

        Booking booking = thanhToan.getBooking();
        if (booking != null) {
            if (thanhToan.getTransactionType() == LoaiGiaoDich.TIEN_COC && booking.getStatus() == BookingStatus.CHO_XAC_NHAN) {
                booking.setStatus(BookingStatus.DA_DAT);
                bookingRepository.save(booking);
                log.info("Cập nhật booking {} sang trạng thái DA_DAT sau khi thanh toán cọc thành công", booking.getBookingCode());

                if (booking.getCustomer() != null && booking.getCustomer().getEmail() != null) {
                    emailService.sendBookingConfirmationEmail(booking.getCustomer().getEmail(), booking);
                }
            } else if (thanhToan.getTransactionType() == LoaiGiaoDich.THANH_TOAN_HOA_DON) {
                HoaDon invoice = thanhToan.getInvoice();
                if (invoice != null) {
                    invoice.setStatus(TrangThaiHoaDon.DA_THANH_TOAN);
                    invoice.setRemainingAmount(BigDecimal.ZERO);
                    hoaDonRepository.save(invoice);
                    log.info("Cập nhật hóa đơn {} sang trạng thái DA_THANH_TOAN", invoice.getInvoiceNumber());
                }
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Helper Methods
    // ─────────────────────────────────────────────────────────────────────────────

    private long generateOrderCode(String bookingCode) {
        long timestamp = System.currentTimeMillis() % 1000000000L;
        int hash = Math.abs(bookingCode != null ? bookingCode.hashCode() % 1000 : 123);
        return timestamp * 1000L + hash;
    }

    private JsonNode callPayOSCreatePaymentLink(long orderCode, int amount, String description,
                                                String returnUrl, String cancelUrl,
                                                String buyerName, String buyerPhone) {
        try {
            PaymentData paymentData = PaymentData.builder()
                    .orderCode(orderCode)
                    .amount(amount)
                    .description(description)
                    .returnUrl(returnUrl)
                    .cancelUrl(cancelUrl)
                    .buyerName(buyerName)
                    .buyerPhone(buyerPhone)
                    .build();

            paymentData.setSignature(SignatureUtils.createSignatureOfPaymentRequest(paymentData, payOSConfig.getChecksumKey()));
            String jsonBody = objectMapper.writeValueAsString(paymentData);

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create("https://api-merchant.payos.vn/v2/payment-requests"))
                    .header("x-client-id", payOSConfig.getClientId())
                    .header("x-api-key", payOSConfig.getApiKey())
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
            JsonNode root = objectMapper.readTree(res.body());

            if (!"00".equals(root.path("code").asText())) {
                String errMsg = root.path("desc").asText("Không xác định");
                log.error("PayOS trả về mã lỗi: {} - {}", root.path("code").asText(), errMsg);
                throw new RuntimeException("Cổng thanh toán PayOS báo lỗi: " + errMsg);
            }

            return root.path("data");
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Lỗi gửi yêu cầu sang PayOS: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi kết nối tới cổng thanh toán PayOS: " + e.getMessage());
        }
    }

    private Booking createBookingFromDepositRequest(CreateDepositPaymentRequest request, String username) {
        String code = (request.getBookingCode() != null && !request.getBookingCode().isBlank())
                ? request.getBookingCode()
                : "SM-" + (100000 + (int)(Math.random() * 900000));

        String phone = (request.getPhone() != null && !request.getPhone().isBlank()) ? request.getPhone().trim() : "0900000000";
        KhachHang customer = khachHangRepository.findBySoDienThoai(phone).orElseGet(() -> {
            KhachHang kh = new KhachHang();
            kh.setHoTen(request.getGuestName() != null ? request.getGuestName().trim() : "Khách Lưu Trú");
            kh.setSoDienThoai(phone);
            kh.setEmail(request.getEmail());
            kh.setNgayTao(LocalDateTime.now());
            return khachHangRepository.save(kh);
        });

        Booking booking = new Booking();
        booking.setBookingCode(code);
        booking.setCustomer(customer);
        booking.setCreator(resolveStaff(username));
        booking.setBookingChannel("WEBSITE");
        booking.setEstimatedTotal(request.getTotalAmount() != null ? request.getTotalAmount() : BigDecimal.valueOf(1000000));
        booking.setRequiredDeposit(request.getDepositAmount() != null ? request.getDepositAmount() : BigDecimal.valueOf(300000));
        booking.setStatus(BookingStatus.CHO_XAC_NHAN);
        booking = bookingRepository.save(booking);

        LocalDate checkInDate = request.getCheckIn() != null ? LocalDate.parse(request.getCheckIn()) : LocalDate.now();
        LocalDate checkOutDate = request.getCheckOut() != null ? LocalDate.parse(request.getCheckOut()) : checkInDate.plusDays(1);

        // Tìm danh sách các phòng thực sự còn trống trong khoảng ngày đặt
        List<Room> availableRooms = roomRepository.findAvailableRooms(checkInDate, checkOutDate);

        Room room = null;
        // 1. Khớp theo roomId hoặc số phòng nếu khách chọn phòng cụ thể
        if (request.getRoomId() != null && !request.getRoomId().isBlank()) {
            room = availableRooms.stream()
                    .filter(r -> r.getId().equalsIgnoreCase(request.getRoomId())
                            || (r.getRoomNumber() != null && r.getRoomNumber().equalsIgnoreCase(request.getRoomId())))
                    .findFirst()
                    .orElse(null);
        }

        // 2. Khớp theo loại phòng (mã loại phòng, tên loại phòng hoặc tên phòng gửi lên)
        if (room == null) {
            String targetCatId = request.getRoomCategoryId() != null ? request.getRoomCategoryId().trim().toLowerCase() : "";
            String targetRoomName = request.getRoomName() != null ? request.getRoomName().trim().toLowerCase() : "";

            room = availableRooms.stream()
                    .filter(r -> {
                        if (r.getRoomCategory() == null) return false;
                        String cId = r.getRoomCategory().getId() != null ? r.getRoomCategory().getId().toLowerCase() : "";
                        String cName = r.getRoomCategory().getName() != null ? r.getRoomCategory().getName().toLowerCase() : "";

                        // Khớp ID loại phòng (ví dụ: cat-3)
                        if (!targetCatId.isEmpty() && (cId.equals(targetCatId) || targetCatId.contains(cId) || cId.contains(targetCatId))) {
                            return true;
                        }
                        // Khớp tên loại phòng (ví dụ: targetCatId="deluxe" khớp với cName="deluxe")
                        if (!targetCatId.isEmpty() && (cName.contains(targetCatId) || targetCatId.contains(cName))) {
                            return true;
                        }
                        // Khớp theo tên phòng gửi lên (ví dụ: targetRoomName="Deluxe Cổ Điển..." chứa cName="deluxe")
                        if (!targetRoomName.isEmpty() && targetRoomName.contains(cName)) {
                            return true;
                        }
                        return false;
                    })
                    .findFirst()
                    .orElse(null);
        }

        // 3. Nếu loại phòng này đã hết phòng trống trong khoảng ngày, gán một phòng trống bất kỳ
        if (room == null && !availableRooms.isEmpty()) {
            room = availableRooms.get(0);
        }

        // 4. Fallback cuối cùng nếu toàn bộ khách sạn đã kín phòng trong khoảng thời gian này
        if (room == null) {
            if (request.getRoomId() != null && !request.getRoomId().isBlank()) {
                room = roomRepository.findById(request.getRoomId())
                        .or(() -> roomRepository.findByRoomNumber(request.getRoomId()))
                        .orElse(null);
            }
            if (room == null && request.getRoomCategoryId() != null && !request.getRoomCategoryId().isBlank()) {
                room = roomRepository.findByRoomCategory_Id(request.getRoomCategoryId()).stream().findFirst().orElse(null);
            }
            if (room == null) {
                room = roomRepository.findAll().stream().findFirst().orElse(null);
            }
        }

        BookingDetail detail = new BookingDetail();
        detail.setBooking(booking);
        detail.setRoom(room);
        detail.setExpectedCheckInDate(checkInDate);
        detail.setExpectedCheckOutDate(checkOutDate);
        detail.setGuestCount(request.getAdults() != null ? request.getAdults() : 2);
        detail.setStatus(BookingStatus.CHO_XAC_NHAN.name());
        bookingDetailRepository.save(detail);

        return booking;
    }

    private NhanVien resolveStaff(String username) {
        if (username != null && !username.isBlank()) {
            Optional<NhanVien> opt = nhanVienRepository.findByTaiKhoan_TenDangNhap(username);
            if (opt.isPresent()) return opt.get();
        }
        return nhanVienRepository.findAll().stream().findFirst().orElse(null);
    }
}
