package com.hotel.suongmai.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hotel.suongmai.entity.VaiTro;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProfileResponse(
        String accountId,
        String username,
        VaiTro role,
        String profileType,
        String profileId,
        String fullName,
        String email,
        String phoneNumber,
        String identityDocument,
        String roomPreferences,
        LocalDateTime createdAt) {
}
