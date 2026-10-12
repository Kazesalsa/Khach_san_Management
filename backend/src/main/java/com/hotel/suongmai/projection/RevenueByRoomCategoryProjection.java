package com.hotel.suongmai.projection;

import java.math.BigDecimal;

public interface RevenueByRoomCategoryProjection {
    String getRoomCategoryId();
    String getRoomCategoryName();
    BigDecimal getRoomRevenue();
}
