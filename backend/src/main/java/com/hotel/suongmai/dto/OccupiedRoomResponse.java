package com.hotel.suongmai.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Thông tin một phòng đang có khách (UC-07).
 * paymentStatus: "paid" | "unpaid" (khớp với frontend CheckoutListPage).
 */
public record OccupiedRoomResponse(
        String bookingDetailId,
        String roomNumber,
        Integer floor,
        String roomType,
        String guestName,
        String phone,
        String bookingCode,
        LocalDateTime checkInTime,
        LocalDate expectedCheckOutDate,
        Integer guestCount,
        BigDecimal totalAmount,
        BigDecimal paidAmount,
        BigDecimal remainingAmount,
        String paymentStatus) {
}
