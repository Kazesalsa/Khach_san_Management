package com.hotel.suongmai.projection;

import java.math.BigDecimal;

public interface RevenueKpiProjection {
    BigDecimal getTotalRevenue();
    BigDecimal getRoomRevenue();
    BigDecimal getServiceRevenue();
    long getBookingCount();
}
