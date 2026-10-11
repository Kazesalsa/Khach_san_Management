package com.hotel.suongmai.service;

import com.hotel.suongmai.dto.OccupiedRoomResponse;
import com.hotel.suongmai.entity.Booking;
import com.hotel.suongmai.entity.BookingDetail;
import com.hotel.suongmai.repository.BookingDetailRepository;
import com.hotel.suongmai.repository.SuDungDichVuRepository;
import com.hotel.suongmai.repository.ThanhToanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private static final String PAID = "paid";
    private static final String UNPAID = "unpaid";

    private final BookingDetailRepository bookingDetailRepository;
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
