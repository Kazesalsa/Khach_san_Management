package com.hotel.suongmai.controller;

import com.hotel.suongmai.dto.RoomOverviewResponse;
import com.hotel.suongmai.dto.RoomStatusResponse;
import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    @PreAuthorize("hasAnyRole('NHAN_VIEN_BUONG', 'LE_TAN', 'CHU_KHACH_SAN')")
    public ResponseEntity<List<RoomOverviewResponse>> findAllRooms() {
        List<RoomOverviewResponse> rooms = roomService.findAllRooms()
                .stream()
                .map(RoomOverviewResponse::from)
                .toList();
        return ResponseEntity.ok(rooms);
    }

    @PatchMapping("/{roomCode}/cleaning-status")
    @PreAuthorize("hasRole('NHAN_VIEN_BUONG')")
    public ResponseEntity<RoomStatusResponse> markAsCleaned(@PathVariable String roomCode) {
        Room updatedRoom = roomService.markRoomAsCleaned(roomCode);
        return ResponseEntity.ok(RoomStatusResponse.from(updatedRoom));
    }

    /**
     * Lấy danh sách toàn bộ phòng và hình ảnh thực tế từ CSDL cho khách hàng
     */
    @GetMapping("/public")
    public ResponseEntity<List<com.hotel.suongmai.dto.PublicRoomResponse>> getPublicRooms() {
        return ResponseEntity.ok(roomService.getPublicRooms());
    }

    /**
     * Lấy chi tiết phòng và bộ sưu tập ảnh từ CSDL theo ID hoặc mã phòng
     */
    @GetMapping("/public/{id}")
    public ResponseEntity<com.hotel.suongmai.dto.PublicRoomResponse> getPublicRoomDetail(@PathVariable String id) {
        return ResponseEntity.ok(roomService.getPublicRoomById(id));
    }
}
