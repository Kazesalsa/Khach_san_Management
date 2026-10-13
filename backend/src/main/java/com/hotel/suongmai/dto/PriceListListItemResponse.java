package com.hotel.suongmai.dto;

import com.hotel.suongmai.entity.PriceList;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PriceListListItemResponse(
        String id,
        String roomCategoryId,
        String roomCategoryName,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal price,
        String status
) {
    public static PriceListListItemResponse from(PriceList priceList) {
        return new PriceListListItemResponse(
                priceList.getId(),
                priceList.getRoomCategory().getId(),
                priceList.getRoomCategory().getName(),
                priceList.getStartDate().toLocalDate(),
                priceList.getEndDate().toLocalDate(),
                priceList.getPrice(),
                priceList.getStatus()
        );
    }
}
