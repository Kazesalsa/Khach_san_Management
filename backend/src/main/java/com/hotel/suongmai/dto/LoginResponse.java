package com.hotel.suongmai.dto;

import com.hotel.suongmai.entity.VaiTro;

public record LoginResponse(
        String token,
        String tokenType,
        String accountId,
        String username,
        VaiTro role) {
}
