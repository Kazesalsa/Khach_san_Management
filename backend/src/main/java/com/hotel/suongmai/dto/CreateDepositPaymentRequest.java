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
public class CreateDepositPaymentRequest {
    private String bookingCode;
    private String roomCategoryId;
    private String roomId;
    private String roomName;
    private String checkIn;
    private String checkOut;
    private String guestName;
    private String phone;
    private String email;
    private Integer adults;
    private Integer children;
    private BigDecimal totalAmount;
    private BigDecimal depositAmount;
    private String returnUrl;
    private String cancelUrl;
}
