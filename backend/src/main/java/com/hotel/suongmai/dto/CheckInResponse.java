package com.hotel.suongmai.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CheckInResponse(
        String bookingCode,
        List<String> roomNumbers,
        LocalDateTime checkInTime,
        String receptionistId,
        String receptionistName,
        String bookingStatus,
        String roomStatus,
        String message) {
}
