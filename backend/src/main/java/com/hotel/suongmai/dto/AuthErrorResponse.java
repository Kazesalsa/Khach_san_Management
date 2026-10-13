package com.hotel.suongmai.dto;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record AuthErrorResponse(String message, Map<String, String> errors) {

    public AuthErrorResponse(String message) {
        this(message, Map.of());
    }
}
