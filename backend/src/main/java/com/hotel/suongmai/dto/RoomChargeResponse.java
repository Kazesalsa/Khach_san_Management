package com.hotel.suongmai.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RoomChargeResponse(
        String roomNumber,
        LocalDate stayDate,
        BigDecimal unitPrice,
        BigDecimal amount
) {
}
