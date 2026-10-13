package com.hotel.suongmai.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdatePriceListRequest(
        @NotNull(message = "Ngày bắt đầu không được để trống")
        LocalDate startDate,

        @NotNull(message = "Ngày kết thúc không được để trống")
        LocalDate endDate,

        @NotNull(message = "Giá tiền không được để trống")
        @DecimalMin(value = "0", inclusive = false, message = "Giá tiền phải lớn hơn 0")
        BigDecimal price,

        String status
) {
    @JsonIgnore
    @AssertTrue(message = "Ngày kết thúc không được nhỏ hơn ngày bắt đầu")
    public boolean isDateRangeValid() {
        return startDate == null || endDate == null || !endDate.isBefore(startDate);
    }
}
