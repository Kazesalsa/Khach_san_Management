package com.hotel.suongmai.controller;

import com.hotel.suongmai.dto.AvailableRoomResponse;
import com.hotel.suongmai.service.RoomAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RoomAvailabilityController {

    private final RoomAvailabilityService roomAvailabilityService;

    @GetMapping("/available")
    public List<AvailableRoomResponse> findAvailableRooms(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return roomAvailabilityService.findAvailableRooms(checkIn, checkOut);
    }
}
