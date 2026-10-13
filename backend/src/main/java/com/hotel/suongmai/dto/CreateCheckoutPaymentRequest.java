package com.hotel.suongmai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCheckoutPaymentRequest {
    private String bookingCode;
    private BigDecimal amount;
    private String returnUrl;
    private String cancelUrl;
}
