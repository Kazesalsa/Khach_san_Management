package com.hotel.suongmai.dto;

import com.hotel.suongmai.entity.CleaningStatus;
import com.hotel.suongmai.entity.Room;

public record RoomStatusResponse(
        String roomCode,
        String roomNumber,
        CleaningStatus cleaningStatus,
        String message
) {
    public static RoomStatusResponse from(Room room) {
        return new RoomStatusResponse(
                room.getRoomCode(),
                room.getRoomNumber(),
                room.getCleaningStatus(),
                "Cập nhật trạng thái phòng thành công"
        );
    }
}
