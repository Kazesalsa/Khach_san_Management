package com.hotel.suongmai.controller;

import com.hotel.suongmai.dto.OccupiedRoomResponse;
import com.hotel.suongmai.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PreAuthorize("hasAnyRole('LE_TAN', 'CHU_KHACH_SAN')")
    @GetMapping("/rooms")
    public ResponseEntity<List<OccupiedRoomResponse>> getOccupiedRooms() {
        return ResponseEntity.ok(checkoutService.getOccupiedRooms());
    }
}
