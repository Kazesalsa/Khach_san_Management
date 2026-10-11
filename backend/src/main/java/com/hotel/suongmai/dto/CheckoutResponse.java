package com.hotel.suongmai.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CheckoutResponse(
        String bookingCode,
        List<String> roomNumbers,
        LocalDateTime checkOutTime,
        String cashierStaffName,
        String message) {
}
