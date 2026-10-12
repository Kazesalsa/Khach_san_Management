package com.hotel.suongmai.dto;

import java.math.BigDecimal;

public record RevenueByRoomCategoryResponse(
        String roomCategoryId,
        String roomCategoryName,
        BigDecimal roomRevenue,
        BigDecimal contributionPercentage
) {
}
