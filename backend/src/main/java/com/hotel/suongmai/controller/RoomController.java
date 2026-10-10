package com.hotel.suongmai.controller;

import com.hotel.suongmai.dto.RoomStatusResponse;
import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PatchMapping("/{roomCode}/cleaning-status")
    @PreAuthorize("hasRole('NHAN_VIEN_BUONG')")
    public ResponseEntity<RoomStatusResponse> markAsCleaned(@PathVariable String roomCode) {
        Room updatedRoom = roomService.markRoomAsCleaned(roomCode);
        return ResponseEntity.ok(RoomStatusResponse.from(updatedRoom));
    }
}
