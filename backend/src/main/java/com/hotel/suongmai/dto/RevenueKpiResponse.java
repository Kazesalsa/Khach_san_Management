package com.hotel.suongmai.dto;

import java.math.BigDecimal;

public record RevenueKpiResponse(
        BigDecimal totalRevenue,
        BigDecimal roomRevenue,
        BigDecimal serviceRevenue,
        long bookingCount
) {
}
