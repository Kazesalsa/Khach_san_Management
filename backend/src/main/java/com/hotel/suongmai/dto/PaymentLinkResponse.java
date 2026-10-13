package com.hotel.suongmai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentLinkResponse {
    private String bookingCode;
    private Long orderCode;
    private String checkoutUrl;
    private String qrCode;
    private String bin;
    private String accountNumber;
    private String accountName;
    private Integer amount;
    private String description;
    private String status;
}
