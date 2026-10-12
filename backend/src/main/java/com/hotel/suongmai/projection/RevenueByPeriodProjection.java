package com.hotel.suongmai.projection;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface RevenueByPeriodProjection {
    LocalDate getPeriod();
    BigDecimal getRoomRevenue();
    BigDecimal getServiceRevenue();
    BigDecimal getTotalRevenue();
}
