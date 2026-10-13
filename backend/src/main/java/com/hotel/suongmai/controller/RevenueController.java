package com.hotel.suongmai.controller;

import com.hotel.suongmai.dto.RevenueResponse;
import com.hotel.suongmai.service.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/revenue")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CHU_KHACH_SAN')")
public class RevenueController {

    private final RevenueService revenueService;

    @GetMapping
    public ResponseEntity<RevenueResponse> getRevenueReport(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate,
            @RequestParam(required = false)
            String roomCategoryId
    ) {
        return ResponseEntity.ok(
                revenueService.getRevenueReport(fromDate, toDate, roomCategoryId)
        );
    }
}
