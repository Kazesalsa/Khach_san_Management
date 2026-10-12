package com.hotel.suongmai.controller;

import com.hotel.suongmai.dto.AvailableRoomResponse;
import com.hotel.suongmai.dto.RoomErrorResponse;
import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SearchController {

    private static final String INVALID_DATE_RANGE_MESSAGE =
            "from_date phải nhỏ hơn to_date";
    private static final String SYSTEM_ERROR_MESSAGE = "Hệ thống gặp trục trặc";

    private final RoomService roomService;

    @Transactional(readOnly = true)
    @GetMapping("/available")
    public ResponseEntity<?> findAvailableRooms(
            @RequestParam(name = "from_date")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(name = "to_date")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        if (!fromDate.isBefore(toDate)) {
            return ResponseEntity.badRequest()
                    .body(new RoomErrorResponse(INVALID_DATE_RANGE_MESSAGE));
        }

        try {
            List<AvailableRoomResponse> rooms = roomService.findAvailableRooms(fromDate, toDate)
                    .stream()
                    .map(SearchController::toResponse)
                    .toList();
            return ResponseEntity.ok(rooms);
        } catch (RuntimeException exception) {
            log.error("Không thể tra cứu phòng trống từ {} đến {}", fromDate, toDate, exception);
            return ResponseEntity.internalServerError()
                    .body(new RoomErrorResponse(SYSTEM_ERROR_MESSAGE));
        }
    }

    private static AvailableRoomResponse toResponse(Room room) {
        String categoryName = room.getRoomCategory() != null ? room.getRoomCategory().getName() : "Tiêu chuẩn";
        Integer capacity = room.getRoomCategory() != null ? room.getRoomCategory().getMaxCapacity() : 2;
        return new AvailableRoomResponse(
                room.getId(),
                room.getRoomNumber(),
                categoryName,
                capacity,
                null);
    }
}
