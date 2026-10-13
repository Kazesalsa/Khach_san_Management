package com.hotel.suongmai.dto;

import java.math.BigDecimal;
import java.util.List;

public record InvoicePreviewResponse(
        String bookingCode,
        BigDecimal roomFee,
        BigDecimal serviceFee,
        BigDecimal subtotal,
        BigDecimal depositDeducted,
        BigDecimal remainingAmount,
        List<RoomChargeResponse> roomCharges,
        List<ServiceChargeResponse> serviceCharges
) {
}
