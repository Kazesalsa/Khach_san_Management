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
        HoaDon invoice = hoaDonRepository
                .findByBookingId(booking.getId())
                .orElseThrow(() -> new UnpaidBookingException("Booking chưa có hóa đơn"));

        if (invoice.getStatus() != TrangThaiHoaDon.DA_THANH_TOAN && invoice.getStatus() != TrangThaiHoaDon.DA_CHOT) {
            throw new UnpaidBookingException("Hóa đơn chưa được thanh toán đầy đủ");
        }

        // 2. Tìm nhân viên lễ tân thực hiện checkout
        NhanVien staff = nhanVienRepository.findByTaiKhoan_TenDangNhap(username)
                .orElse(null);

        LocalDateTime now = LocalDateTime.now();

        // 3. Đổi trạng thái đặt phòng thành đã trả phòng
        booking.setStatus(BookingStatus.DA_TRA_PHONG);
        bookingRepository.save(booking);

        // 4. Cập nhật chi tiết đặt phòng, đổi trạng thái phòng và chốt hóa đơn
        List<BookingDetail> details = bookingDetailRepository.findByBookingId(booking.getId());
        List<String> roomNumbers = new ArrayList<>();

        for (BookingDetail detail : details) {
            detail.setActualCheckOutTime(now);
            detail.setStatus("DA_TRA_PHONG");

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

        invoice.setStatus(TrangThaiHoaDon.DA_CHOT);
        invoice.setFinalizedAt(now);
        invoice.setRemainingAmount(BigDecimal.ZERO);

        if (staff != null) {
            invoice.setFinalizedByStaff(staff);
        }

        hoaDonRepository.save(invoice);

        String staffName = staff != null ? (staff.getHoNv() + " " + staff.getTenNv()) : username;
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

        // [0] = tổng cần thu, [1] = đã thu
        BigDecimal[] money = moneyCache.computeIfAbsent(booking.getId(), id -> {
            BigDecimal roomFee = booking.getEstimatedTotal() == null
                    ? BigDecimal.ZERO : booking.getEstimatedTotal();
            BigDecimal serviceFee = suDungDichVuRepository.sumServiceFeeByBooking(id);
            BigDecimal paid = thanhToanRepository.sumPaidByBooking(id);
            return new BigDecimal[] { roomFee.add(serviceFee), paid };
        });

        BigDecimal totalDue = money[0];
        BigDecimal paid = money[1];
        BigDecimal remaining = totalDue.subtract(paid).max(BigDecimal.ZERO);
        String paymentStatus = paid.compareTo(totalDue) >= 0 ? PAID : UNPAID;

        return new OccupiedRoomResponse(
                detail.getId(),
                detail.getRoom().getRoomNumber(),
                detail.getRoom().getFloor(),
                detail.getRoom().getRoomCategory().getName(),
                booking.getCustomer().getHoTen(),
                booking.getCustomer().getSoDienThoai(),
                booking.getBookingCode(),
                detail.getActualCheckInTime(),
                detail.getExpectedCheckOutDate(),
                detail.getGuestCount(),
                totalDue,
                paid,
                remaining,
                paymentStatus);
    }
}
