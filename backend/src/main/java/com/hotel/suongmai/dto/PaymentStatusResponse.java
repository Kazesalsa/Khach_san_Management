package com.hotel.suongmai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatusResponse {
    private String bookingCode;
    private Long orderCode;
    private String status; // "PAID", "PENDING", "CANCELLED", "FAILED"
    private BigDecimal amount;
    private String transactionType; // "TIEN_COC", "THANH_TOAN_HOA_DON"
    private LocalDateTime transactionTime;
    private String message;
}
