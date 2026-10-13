package com.hotel.suongmai.service;

import com.hotel.suongmai.dto.CheckInResponse;
import com.hotel.suongmai.dto.PendingCheckInBookingResponse;
import com.hotel.suongmai.dto.PendingCheckInRoomResponse;
import com.hotel.suongmai.entity.Booking;
import com.hotel.suongmai.entity.BookingDetail;
import com.hotel.suongmai.entity.BookingStatus;
import com.hotel.suongmai.entity.CleaningStatus;
import com.hotel.suongmai.entity.NhanVien;
import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.entity.UsageStatus;
import com.hotel.suongmai.exception.BookingNotFoundException;
import com.hotel.suongmai.exception.InvalidBookingStateException;
import com.hotel.suongmai.exception.ReceptionistNotFoundException;
import com.hotel.suongmai.exception.RoomNotReadyException;
import com.hotel.suongmai.repository.BookingDetailRepository;
import com.hotel.suongmai.repository.BookingRepository;
import com.hotel.suongmai.repository.NhanVienRepository;
import com.hotel.suongmai.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CheckInService {

    private static final Pattern PHONE_SEARCH_PATTERN = Pattern.compile("^[0-9+() .-]+$");

    private final BookingRepository bookingRepository;
    private final BookingDetailRepository bookingDetailRepository;
    private final RoomRepository roomRepository;
    private final NhanVienRepository nhanVienRepository;

    @Transactional(readOnly = true)
    public List<PendingCheckInBookingResponse> getPendingBookings(String keyword) {
        String normalizedKeyword = normalizeKeyword(keyword);
        String phoneKeyword = normalizePhoneKeyword(normalizedKeyword);

        List<BookingDetail> details = bookingDetailRepository.findPendingCheckIns(
                BookingStatus.DA_DAT,
                normalizedKeyword,
                phoneKeyword);

        Map<String, List<BookingDetail>> detailsByBooking = new LinkedHashMap<>();
        for (BookingDetail detail : details) {
            detailsByBooking.computeIfAbsent(
                    detail.getBooking().getId(),
                    ignored -> new ArrayList<>()).add(detail);
        }

        return detailsByBooking.values().stream()
                .map(this::toPendingBookingResponse)
                .toList();
    }

    @Transactional
    public CheckInResponse checkIn(String bookingCode, String username) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new BookingNotFoundException(
                        "Không tìm thấy đặt phòng với mã: " + bookingCode));

        if (booking.getStatus() != BookingStatus.DA_DAT) {
            throw new InvalidBookingStateException(
                    "Chỉ có thể check-in đặt phòng ở trạng thái DA_DAT");
        }

        List<BookingDetail> details = bookingDetailRepository.findByBookingId(booking.getId());
        if (details.isEmpty()) {
            throw new InvalidBookingStateException(
                    "Đặt phòng không có phòng để thực hiện check-in");
        }

        for (BookingDetail detail : details) {
            Room room = detail.getRoom();
            if (room == null || room.getCleaningStatus() != CleaningStatus.DA_DON_XONG) {
                throw new RoomNotReadyException(
                        "Phòng chưa sẵn sàng để nhận khách");
            }
        }

        NhanVien receptionist = nhanVienRepository.findByTaiKhoan_TenDangNhap(username)
                .orElseThrow(() -> new ReceptionistNotFoundException(
                        "Không tìm thấy hồ sơ nhân viên lễ tân đang đăng nhập"));

        LocalDateTime checkInTime = LocalDateTime.now();
        List<String> roomNumbers = details.stream()
                .map(BookingDetail::getRoom)
                .map(Room::getRoomNumber)
                .toList();

        booking.setStatus(BookingStatus.DA_NHAN);
        bookingRepository.save(booking);

        for (BookingDetail detail : details) {
            detail.setActualCheckInTime(checkInTime);
            detail.setCheckInStaff(receptionist);
            detail.setStatus(BookingStatus.DA_NHAN.name());
            bookingDetailRepository.save(detail);

            Room room = detail.getRoom();
            room.setUsageStatus(UsageStatus.DANG_O);
            roomRepository.save(room);
        }

        return new CheckInResponse(
                booking.getBookingCode(),
                roomNumbers,
                checkInTime,
                receptionist.getId(),
                receptionist.getHoNv() + " " + receptionist.getTenNv(),
                BookingStatus.DA_NHAN.name(),
                UsageStatus.DANG_O.name(),
                "Check-in thành công");
    }

    private PendingCheckInBookingResponse toPendingBookingResponse(List<BookingDetail> details) {
        Booking booking = details.get(0).getBooking();
        List<PendingCheckInRoomResponse> rooms = details.stream()
                .map(this::toPendingRoomResponse)
                .toList();

        return new PendingCheckInBookingResponse(
                booking.getBookingCode(),
                booking.getCustomer().getHoTen(),
                booking.getCustomer().getSoDienThoai(),
                booking.getCustomer().getEmail(),
                booking.getEstimatedTotal(),
                booking.getRequiredDeposit(),
                booking.getStatus(),
                rooms);
    }

    private PendingCheckInRoomResponse toPendingRoomResponse(BookingDetail detail) {
        Room room = detail.getRoom();
        return new PendingCheckInRoomResponse(
                room.getId(),
                room.getRoomNumber(),
                room.getRoomCategory().getName(),
                room.getFloor(),
                detail.getGuestCount(),
                detail.getExpectedCheckInDate(),
                detail.getExpectedCheckOutDate(),
                ChronoUnit.DAYS.between(
                        detail.getExpectedCheckInDate(),
                        detail.getExpectedCheckOutDate()),
                room.getUsageStatus(),
                room.getCleaningStatus());
    }

    private String normalizeKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return "";
        }
        return keyword.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizePhoneKeyword(String keyword) {
        if (keyword.isEmpty() || !PHONE_SEARCH_PATTERN.matcher(keyword).matches()) {
            return "";
        }
        String digits = keyword.replaceAll("\\D", "");
        return digits;
    }
}
