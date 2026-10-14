package com.hotel.suongmai.service;

import com.hotel.suongmai.dto.CheckoutResponse;
import com.hotel.suongmai.dto.OccupiedRoomResponse;
import com.hotel.suongmai.entity.*;
import com.hotel.suongmai.exception.BookingNotFoundException;
import com.hotel.suongmai.exception.InvalidBookingStateException;
import com.hotel.suongmai.exception.UnpaidBookingException;
import com.hotel.suongmai.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CheckoutService {

    private static final String PAID = "paid";
    private static final String UNPAID = "unpaid";

    private final BookingRepository bookingRepository;
    private final BookingDetailRepository bookingDetailRepository;
    private final RoomRepository roomRepository;
    private final HoaDonRepository hoaDonRepository;
    private final NhanVienRepository nhanVienRepository;
    private final ThanhToanRepository thanhToanRepository;
    private final SuDungDichVuRepository suDungDichVuRepository;

    @Transactional(readOnly = true)
    public List<OccupiedRoomResponse> getOccupiedRooms() {
        // Mỗi booking chỉ tính tiền một lần dù có nhiều phòng
        Map<String, BigDecimal[]> moneyCache = new HashMap<>();

        return bookingDetailRepository.findOccupied().stream()
                .map(detail -> toResponse(detail, moneyCache))
                .toList();
    }

    /**
     * Xử lý check-out cho một đặt phòng:
     * 1. Kiểm tra điều kiện chỉ cho trả phòng khi đã thanh toán xong.
     * 2. Đổi trạng thái đặt phòng thành DA_TRA_PHONG và lưu giờ trả thực tế.
     * 3. Tự động đổi trạng thái phòng sang TRONG và CHUA_DON để lao công đi dọn.
     * 4. Lưu thông tin nhân viên lễ tân thực hiện check-out.
     */
    @Transactional
    public CheckoutResponse checkout(String bookingCode, String username) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new BookingNotFoundException("Không tìm thấy đặt phòng với mã: " + bookingCode));

        if (booking.getStatus() == BookingStatus.DA_TRA_PHONG) {
            throw new InvalidBookingStateException(
                    String.format("Đặt phòng %s đã hoàn tất trả phòng trước đó", bookingCode));
        }

        if (booking.getStatus() != BookingStatus.DA_NHAN) {
            throw new InvalidBookingStateException(
                    String.format("Chỉ có thể trả phòng cho đặt phòng đang ở (trạng thái hiện tại: %s)", booking.getStatus()));
        }

        // 1. Kiểm tra điều kiện chỉ cho trả phòng khi đã thanh toán xong
        BigDecimal roomFee = booking.getEstimatedTotal() == null
                ? BigDecimal.ZERO : booking.getEstimatedTotal();
        BigDecimal serviceFee = suDungDichVuRepository.sumServiceFeeByBooking(booking.getId());
        if (serviceFee == null) {
            serviceFee = BigDecimal.ZERO;
        }
        BigDecimal totalDue = roomFee.add(serviceFee);
        BigDecimal paid = thanhToanRepository.sumPaidByBooking(booking.getId());
        if (paid == null) {
            paid = BigDecimal.ZERO;
        }

        HoaDon invoice = hoaDonRepository
                .findByBookingId(booking.getId())
                .orElse(null);

        if (invoice != null) {
            if (invoice.getStatus() != TrangThaiHoaDon.DA_THANH_TOAN && invoice.getStatus() != TrangThaiHoaDon.DA_CHOT) {
                if (paid.compareTo(totalDue) >= 0) {
                    invoice.setStatus(TrangThaiHoaDon.DA_THANH_TOAN);
                } else {
                    throw new UnpaidBookingException("Hóa đơn chưa được thanh toán đầy đủ");
                }
            }
        } else {
            if (paid.compareTo(totalDue) < 0) {
                throw new UnpaidBookingException("Hóa đơn chưa được thanh toán đầy đủ");
            }

            // Tự động lập hóa đơn nếu booking đã thanh toán đủ trước đó mà chưa có bản ghi hóa đơn
            invoice = new HoaDon();
            invoice.setInvoiceNumber(generateUniqueInvoiceNumber());
            invoice.setBooking(booking);
            invoice.setRoomFee(roomFee);
            invoice.setServiceFee(serviceFee);
            invoice.setDeductedDeposit(paid.min(totalDue));
            invoice.setTotalAmount(totalDue);
            invoice.setRemainingAmount(BigDecimal.ZERO);
            invoice.setStatus(TrangThaiHoaDon.DA_THANH_TOAN);
            invoice = hoaDonRepository.save(invoice);
        }

        // 2. Tìm nhân viên lễ tân thực hiện checkout
        NhanVien staff = nhanVienRepository.findByTaiKhoan_TenDangNhap(username)
                .orElse(null);

        LocalDateTime now = LocalDateTime.now();

        // 3. Đổi trạng thái đặt phòng thành đã trả phòng
        booking.setStatus(BookingStatus.DA_TRA_PHONG);
        bookingRepository.save(booking);

        // 4. Chốt hóa đơn và cập nhật chi tiết đặt phòng, đổi trạng thái phòng
        List<BookingDetail> details = bookingDetailRepository.findByBookingId(booking.getId());
        List<String> roomNumbers = new ArrayList<>();

        invoice.setStatus(TrangThaiHoaDon.DA_CHOT);
        invoice.setFinalizedAt(now);
        invoice.setRemainingAmount(BigDecimal.ZERO);

        if (staff != null) {
            invoice.setFinalizedByStaff(staff);
        }

        hoaDonRepository.save(invoice);

        for (BookingDetail detail : details) {
            detail.setActualCheckOutTime(now);
            detail.setStatus("DA_TRA_PHONG");
            detail.setInvoice(invoice);

            if (staff != null) {
                detail.setCheckOutStaff(staff);
            }

            bookingDetailRepository.save(detail);


            Room room = detail.getRoom();

            if (room != null) {
                room.setUsageStatus(UsageStatus.TRONG);
                room.setCleaningStatus(CleaningStatus.CHUA_DON);
                roomRepository.save(room);
                roomNumbers.add(room.getRoomNumber());
            }
        }

        String staffName = staff != null ? (staff.getHoNv() + " " + staff.getTenNv()) : (username != null ? username : "Lễ tân");
        log.info("Lễ tân {} đã hoàn tất trả phòng cho booking {} (các phòng: {})",
                staffName, bookingCode, roomNumbers);

        return new CheckoutResponse(
                booking.getBookingCode(),
                roomNumbers,
                now,
                staffName,
                "Trả phòng thành công");
    }

    /**
     * Hỗ trợ xử lý trả phòng cùng lúc cho nhiều phòng / đặt phòng đi theo đoàn.
     */
    @Transactional
    public List<CheckoutResponse> batchCheckout(List<String> bookingCodes, String username) {
        if (bookingCodes == null || bookingCodes.isEmpty()) {
            throw new IllegalArgumentException("Danh sách mã đặt phòng không được để trống");
        }

        List<CheckoutResponse> results = new ArrayList<>();
        for (String code : bookingCodes) {
            results.add(checkout(code.trim(), username));
        }
        return results;
    }

    private OccupiedRoomResponse toResponse(BookingDetail detail, Map<String, BigDecimal[]> moneyCache) {
        Booking booking = detail.getBooking();

        // [0] = tổng cần thu, [1] = đã thu, [2] = tiền phòng, [3] = tiền dịch vụ
        BigDecimal[] money = moneyCache.computeIfAbsent(booking.getId(), id -> {
            BigDecimal roomFeeVal = booking.getEstimatedTotal() == null
                    ? BigDecimal.ZERO : booking.getEstimatedTotal();
            BigDecimal serviceFeeVal = suDungDichVuRepository.sumServiceFeeByBooking(id);
            if (serviceFeeVal == null) {
                serviceFeeVal = BigDecimal.ZERO;
            }
            BigDecimal paidVal = thanhToanRepository.sumPaidByBooking(id);
            if (paidVal == null) {
                paidVal = BigDecimal.ZERO;
            }
            return new BigDecimal[] { roomFeeVal.add(serviceFeeVal), paidVal, roomFeeVal, serviceFeeVal };
        });

        BigDecimal totalDue = money[0];
        BigDecimal paid = money[1];
        BigDecimal roomFee = money[2];
        BigDecimal serviceFee = money[3];
        BigDecimal remaining = totalDue.subtract(paid).max(BigDecimal.ZERO);
        String paymentStatus = paid.compareTo(totalDue) >= 0 ? PAID : UNPAID;

        String roomNumber = detail.getRoom() != null ? detail.getRoom().getRoomNumber() : "";
        Integer floor = detail.getRoom() != null ? detail.getRoom().getFloor() : 1;
        String roomType = (detail.getRoom() != null && detail.getRoom().getRoomCategory() != null)
                ? detail.getRoom().getRoomCategory().getName()
                : "Tiêu chuẩn";

        String guestName = (booking != null && booking.getCustomer() != null)
                ? booking.getCustomer().getHoTen()
                : "Khách vãng lai";
        String phone = (booking != null && booking.getCustomer() != null && booking.getCustomer().getSoDienThoai() != null)
                ? booking.getCustomer().getSoDienThoai()
                : "—";
        String bookingCode = booking != null ? booking.getBookingCode() : "";

        return new OccupiedRoomResponse(
                detail.getId(),
                roomNumber,
                floor,
                roomType,
                guestName,
                phone,
                bookingCode,
                detail.getActualCheckInTime(),
                detail.getExpectedCheckOutDate(),
                detail.getGuestCount(),
                roomFee,
                serviceFee,
                totalDue,
                paid,
                remaining,
                paymentStatus);
    }

    private String generateUniqueInvoiceNumber() {
        String invoiceNumber;
        do {
            String randomPart = java.util.UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 18);
            invoiceNumber = "HD" + randomPart;
        } while (hoaDonRepository.existsByInvoiceNumber(invoiceNumber));
        return invoiceNumber;
    }
}
