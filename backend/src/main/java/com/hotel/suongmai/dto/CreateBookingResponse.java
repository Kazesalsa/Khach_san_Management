package com.hotel.suongmai.dto;

import com.hotel.suongmai.entity.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateBookingResponse(
        String bookingCode,
        BookingStatus status,
        String customerId,
        String guestName,
        String phone,
        String email,
        String roomId,
        String roomNumber,
        String roomType,
        LocalDate checkIn,
        LocalDate checkOut,
        long nights,
        Integer guestCount,
        BigDecimal estimatedTotal,
        BigDecimal requiredDeposit
) {
}
