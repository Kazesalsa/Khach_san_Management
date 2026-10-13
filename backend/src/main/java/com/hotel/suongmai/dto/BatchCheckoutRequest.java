package com.hotel.suongmai.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record BatchCheckoutRequest(
        @NotEmpty(message = "Danh sách mã đặt phòng không được để trống")
        List<String> bookingCodes) {
}
