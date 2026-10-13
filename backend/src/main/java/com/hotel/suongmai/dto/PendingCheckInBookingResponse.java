package com.hotel.suongmai.dto;

import com.hotel.suongmai.entity.BookingStatus;

import java.math.BigDecimal;
import java.util.List;

public record PendingCheckInBookingResponse(
        String bookingCode,
        String guestName,
        String phone,
        String email,
        BigDecimal estimatedTotal,
        BigDecimal requiredDeposit,
        BookingStatus bookingStatus,
        List<PendingCheckInRoomResponse> rooms
) {
}
