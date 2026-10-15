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

        String bookingCode = request.getBookingCode() != null ? request.getBookingCode().trim() : "";
        Booking booking = bookingRepository.findByBookingCode(bookingCode.trim())
                .orElseThrow(() -> new BookingNotFoundException(
                    "Không tìm thấy đặt phòng với mã: " + request.getBookingCode() + ". Vui lòng tạo đặt phòng trước khi thanh toán cọc."));

        if (booking.getCustomer() != null && request.getEmail() != null && !request.getEmail().isBlank()) {
            KhachHang c = booking.getCustomer();
            if (c.getEmail() == null || !c.getEmail().equalsIgnoreCase(request.getEmail().trim())) {
                c.setEmail(request.getEmail().trim());
                khachHangRepository.save(c);
            }
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

        final String bookingId = booking.getId();
        HoaDon invoice = hoaDonRepository.findByBookingId(bookingId)
                .orElseGet(() -> bookingDetailRepository.findByBookingId(bookingId).stream()
                        .map(BookingDetail::getInvoice)
                        .filter(Objects::nonNull)
                        .findFirst()
                        .orElse(null));

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
            if (thanhToan.getTransactionType() == LoaiGiaoDich.TIEN_COC) {
                if (booking.getStatus() == BookingStatus.CHO_XAC_NHAN) {
                    booking.setStatus(BookingStatus.DA_DAT);

                    //Cập nhật các chi_tiet_dat_phong liên quan sang trangj thái đã nhận
                    List<BookingDetail> details = bookingDetailRepository.findByBookingId(booking.getId());
                    for (BookingDetail detail : details) {
                        detail.setStatus("DA_DAT");
                    }
                    bookingDetailRepository.saveAll(details);

                    bookingRepository.save(booking);
                    log.info("Cập nhật booking {} sang trạng thái DA_DAT sau khi thanh toán cọc thành công", booking.getBookingCode());
                }

                if (booking.getCustomer() != null && booking.getCustomer().getEmail() != null && !booking.getCustomer().getEmail().isBlank()) {
                    emailService.sendBookingConfirmationEmail(booking.getCustomer().getEmail(), booking);
                } else {
                    log.warn("Booking {} không có email khách hàng để gửi thư xác nhận", booking.getBookingCode());
                }
            } else if (thanhToan.getTransactionType() == LoaiGiaoDich.THANH_TOAN_HOA_DON) {
                HoaDon invoice = thanhToan.getInvoice();
                if (invoice == null && booking != null) {
                    invoice = hoaDonRepository.findByBookingId(booking.getId()).orElse(null);
                }
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

    private NhanVien resolveStaff(String username) {
        if (username != null && !username.isBlank()) {
            Optional<NhanVien> opt = nhanVienRepository.findByTaiKhoan_TenDangNhap(username);
            if (opt.isPresent()) return opt.get();
        }
        return nhanVienRepository.findAll().stream().findFirst().orElse(null);
    }
}
