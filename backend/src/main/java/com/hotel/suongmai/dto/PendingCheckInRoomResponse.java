package com.hotel.suongmai.dto;

import com.hotel.suongmai.entity.CleaningStatus;
import com.hotel.suongmai.entity.UsageStatus;

import java.time.LocalDate;

public record PendingCheckInRoomResponse(
        String roomId,
        String roomNumber,
        String roomType,
        Integer floor,
        Integer guestCount,
        LocalDate checkIn,
        LocalDate checkOut,
        long nights,
        UsageStatus usageStatus,
        CleaningStatus cleaningStatus
) {
}
