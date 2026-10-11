package com.hotel.suongmai.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record PriceListErrorResponse(String message, Map<String, String> errors) {
    public PriceListErrorResponse(String message) {
        this(message, Map.of());
    }
}
