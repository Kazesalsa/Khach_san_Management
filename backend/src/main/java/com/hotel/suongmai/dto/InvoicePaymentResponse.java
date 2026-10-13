package com.hotel.suongmai.dto;

import com.hotel.suongmai.entity.PhuongThucThanhToan;
import com.hotel.suongmai.entity.TrangThaiHoaDon;
import com.hotel.suongmai.entity.TrangThaiThanhToan;

import java.math.BigDecimal;

public record InvoicePaymentResponse (
        String bookingCode,
        String invoiceNumber,
        BigDecimal roomFee,
        BigDecimal serviceFee,
        BigDecimal totalAmount,
        BigDecimal deductedDeposit,
        BigDecimal paidAmount,
        BigDecimal remainingAmount,
        PhuongThucThanhToan paymentMethod,
        TrangThaiHoaDon invoiceStatus,
        String message
) {
}
