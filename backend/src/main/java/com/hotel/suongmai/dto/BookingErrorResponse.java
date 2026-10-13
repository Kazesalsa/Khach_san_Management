package com.hotel.suongmai.dto;

import java.util.Map;

public record BookingErrorResponse(String message, Map<String, String> errors) {
    public BookingErrorResponse(String message) {
        this(message, Map.of());
    }
}
