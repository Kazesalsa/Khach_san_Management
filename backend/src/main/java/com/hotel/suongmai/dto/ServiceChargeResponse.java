package com.hotel.suongmai.dto;

import java.math.BigDecimal;

public record ServiceChargeResponse(
        String serviceName,
        BigDecimal quantity,
        BigDecimal unitPrice,
        BigDecimal amount
) {
}
