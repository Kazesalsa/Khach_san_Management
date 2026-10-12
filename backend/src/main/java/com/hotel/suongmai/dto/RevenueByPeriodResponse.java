package com.hotel.suongmai.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RevenueByPeriodResponse(
        LocalDate period,
        BigDecimal roomRevenue,
        BigDecimal serviceRevenue,
        BigDecimal totalRevenue
) {
}
