package com.hotel.suongmai.controller;

import com.hotel.suongmai.dto.CheckInResponse;
import com.hotel.suongmai.dto.PendingCheckInBookingResponse;
import com.hotel.suongmai.security.TaiKhoanDetails;
import com.hotel.suongmai.service.CheckInService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkInService;

    @GetMapping("/pending-check-in")
    @PreAuthorize("hasAnyRole('LE_TAN', 'CHU_KHACH_SAN')")
    public ResponseEntity<List<PendingCheckInBookingResponse>> getPendingBookings(
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(checkInService.getPendingBookings(keyword));
    }

    @PostMapping("/{bookingCode}/check-in")
    @PreAuthorize("hasRole('LE_TAN')")
    public ResponseEntity<CheckInResponse> checkIn(
            @PathVariable String bookingCode,
            @AuthenticationPrincipal TaiKhoanDetails accountDetails) {
        return ResponseEntity.ok(
                checkInService.checkIn(bookingCode, accountDetails.getUsername()));
    }
}
