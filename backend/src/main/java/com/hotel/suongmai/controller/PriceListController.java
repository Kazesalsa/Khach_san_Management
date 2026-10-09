package com.hotel.suongmai.controller;

import com.hotel.suongmai.dto.CreatePriceListRequest;
import com.hotel.suongmai.dto.PriceListResponse;
import com.hotel.suongmai.dto.PriceListResult;
import com.hotel.suongmai.dto.UpdatePriceListRequest;
import com.hotel.suongmai.service.PriceListService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalTime;

@RestController
@RequestMapping("/api/price-lists")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CHU_KHACH_SAN')")
public class PriceListController {

    private final PriceListService priceListService;

    @PostMapping
    public ResponseEntity<PriceListResponse> create(
            @Valid @RequestBody CreatePriceListRequest request) {
        PriceListResult result = priceListService.createPriceList(
                request.roomCategoryId(),
                request.startDate().atStartOfDay(),
                request.endDate().atTime(LocalTime.MAX),
                request.price(),
                request.status()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(PriceListResponse.forCreate(result));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PriceListResponse> update(
            @PathVariable String id,
            @Valid @RequestBody UpdatePriceListRequest request) {
        PriceListResult result = priceListService.updatePriceList(
                id,
                request.startDate().atStartOfDay(),
                request.endDate().atTime(LocalTime.MAX),
                request.price(),
                request.status()
        );

        return ResponseEntity.ok(PriceListResponse.forUpdate(result));
    }
}
