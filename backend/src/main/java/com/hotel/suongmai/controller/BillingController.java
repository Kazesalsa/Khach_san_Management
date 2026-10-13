package com.hotel.suongmai.controller;

import com.hotel.suongmai.dto.*;
import com.hotel.suongmai.security.TaiKhoanDetails;
import com.hotel.suongmai.service.BillingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @PreAuthorize("hasAnyRole('LE_TAN', 'CHU_KHACH_SAN')")
    @GetMapping("/bookings/{bookingCode}/invoice/preview")
    public ResponseEntity<InvoicePreviewResponse> previewInvoice(@PathVariable String bookingCode) {
        return ResponseEntity.ok(billingService.previewInvoice(bookingCode));
    }

    @PreAuthorize("hasAnyRole('LE_TAN', 'CHU_KHACH_SAN')")
    @PostMapping("/bookings/{bookingCode}/invoice/pay")
    public ResponseEntity<InvoicePaymentResponse> payInvoice(
            @PathVariable String bookingCode,
            @Valid @RequestBody PayInvoiceRequest request,
            @AuthenticationPrincipal TaiKhoanDetails accountDetails
    ) {
        String username = accountDetails.getUsername();

        return ResponseEntity.ok(
                billingService.payInvoice(
                        bookingCode,
                        request,
                        username
                )
        );
    }
}