package com.hotel.suongmai.dto;

import com.hotel.suongmai.entity.CleaningStatus;
import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.entity.UsageStatus;

public record RoomOverviewResponse(
        String id,
        String roomCode,
        String roomNumber,
        Integer floor,
        String roomType,
        CleaningStatus cleaningStatus,
        UsageStatus usageStatus
) {
    public static RoomOverviewResponse from(Room room) {
        String roomType = room.getRoomCategory() == null
                ? null
                : room.getRoomCategory().getName();

        return new RoomOverviewResponse(
                room.getId(),
                room.getRoomCode(),
                room.getRoomNumber(),
                room.getFloor(),
                roomType,
                room.getCleaningStatus(),
                room.getUsageStatus()
        );
    }
}
