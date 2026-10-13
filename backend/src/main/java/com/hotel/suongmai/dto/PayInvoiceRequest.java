package com.hotel.suongmai.dto;

import com.hotel.suongmai.entity.PhuongThucThanhToan;
import jakarta.validation.constraints.NotNull;

public record PayInvoiceRequest (
    @NotNull(message = "Hình thức thanh toán không được để trống")
    PhuongThucThanhToan paymentMethod
) {
}
