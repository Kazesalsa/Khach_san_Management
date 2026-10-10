package com.hotel.suongmai.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hotel.suongmai.entity.PriceList;

import java.math.BigDecimal;
import java.time.LocalDate;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PriceListResponse(
        String id,
        String roomCategoryId,
        String roomCategoryName,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal price,
        String status,
        boolean hasExistingBookings,
        String message,
        String warning
) {
    public static PriceListResponse forCreate(PriceListResult result) {
        return from(result, "Thiết lập bảng giá thành công.");
    }

    public static PriceListResponse forUpdate(PriceListResult result) {
        return from(result, "Cập nhật bảng giá thành công.");
    }

    private static PriceListResponse from(PriceListResult result, String successMessage) {
        PriceList priceList = result.getPriceList();
        boolean hasExistingBookings = result.isHasExistingBookings();

        return new PriceListResponse(
                priceList.getId(),
                priceList.getRoomCategory().getId(),
                priceList.getRoomCategory().getName(),
                priceList.getStartDate().toLocalDate(),
                priceList.getEndDate().toLocalDate(),
                priceList.getPrice(),
                priceList.getStatus(),
                hasExistingBookings,
                successMessage,
                hasExistingBookings ? result.getNoticeMessage() : null
        );
    }
}
