package com.hotel.suongmai.controller;

import com.hotel.suongmai.dto.BatchCheckoutRequest;
import com.hotel.suongmai.dto.CheckoutResponse;
import com.hotel.suongmai.dto.OccupiedRoomResponse;
import com.hotel.suongmai.security.TaiKhoanDetails;
import com.hotel.suongmai.service.CheckoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;


    @PreAuthorize("hasAnyRole('LE_TAN', 'CHU_KHACH_SAN')")
    @GetMapping("/checkout/rooms")
    public ResponseEntity<List<OccupiedRoomResponse>> getOccupiedRooms() {
        return ResponseEntity.ok(checkoutService.getOccupiedRooms());
    }

    @PreAuthorize("hasAnyRole('LE_TAN', 'CHU_KHACH_SAN')")
    @PostMapping({"/bookings/{bookingCode}/checkout", "/checkout/{bookingCode}"})
    public ResponseEntity<CheckoutResponse> checkout(
            @PathVariable String bookingCode,
            @AuthenticationPrincipal TaiKhoanDetails accountDetails) {
        String username = accountDetails != null ? accountDetails.getUsername() : null;
        return ResponseEntity.ok(checkoutService.checkout(bookingCode, username));
    }

    @PreAuthorize("hasAnyRole('LE_TAN', 'CHU_KHACH_SAN')")
    @PostMapping({"/bookings/batch-checkout", "/checkout/batch"})
    public ResponseEntity<List<CheckoutResponse>> batchCheckout(
            @Valid @RequestBody BatchCheckoutRequest request,
            @AuthenticationPrincipal TaiKhoanDetails accountDetails) {
        String username = accountDetails != null ? accountDetails.getUsername() : null;
        return ResponseEntity.ok(checkoutService.batchCheckout(request.bookingCodes(), username));
    }
}
