package com.hotel.suongmai.dto;

import java.math.BigDecimal;

public record AvailableRoomResponse(
        String id,
        String roomNumber,
        String roomType,
        Integer capacity,
        BigDecimal pricePerNight) {
}
