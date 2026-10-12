package com.hotel.suongmai.dto;

import java.util.List;

public record RevenueResponse(
        RevenueKpiResponse kpi,
        List<RevenueByRoomCategoryResponse> byRoomCategory,
        List<RevenueByPeriodResponse> byDay,
        List<RevenueByPeriodResponse> byMonth
) {
}
