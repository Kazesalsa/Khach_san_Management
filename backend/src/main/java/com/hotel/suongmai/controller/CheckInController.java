package com.hotel.suongmai.controller;

import com.hotel.suongmai.dto.CheckInResponse;
import com.hotel.suongmai.security.TaiKhoanDetails;
import com.hotel.suongmai.service.CheckInService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkInService;

    @PostMapping("/{bookingCode}/check-in")
    @PreAuthorize("hasRole('LE_TAN')")
    public ResponseEntity<CheckInResponse> checkIn(
            @PathVariable String bookingCode,
            @AuthenticationPrincipal TaiKhoanDetails accountDetails) {
        return ResponseEntity.ok(
                checkInService.checkIn(bookingCode, accountDetails.getUsername()));
    }
}
