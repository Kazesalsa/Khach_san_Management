package com.hotel.suongmai.dto;

import com.hotel.suongmai.entity.VaiTro;

public record RegisterResponse(
        String accountId,
        String email,
        VaiTro role,
        String message) {
}
