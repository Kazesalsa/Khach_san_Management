package com.hotel.suongmai.dto;

import com.hotel.suongmai.entity.PriceList;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PriceListResult {
    private PriceList priceList;
    private boolean hasExistingBookings;
    private String noticeMessage;
}