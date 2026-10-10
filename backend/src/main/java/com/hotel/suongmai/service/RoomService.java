package com.hotel.suongmai.service;

import com.hotel.suongmai.entity.CleaningStatus;
import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.exception.RoomAlreadyCleanedException;
import com.hotel.suongmai.exception.RoomNotFoundException;
import com.hotel.suongmai.repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;

    @Transactional
    public Room markRoomAsCleaned(String roomCode) {
        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RoomNotFoundException("Phòng không tồn tại với mã phòng: " + roomCode));

        if (room.getCleaningStatus() == CleaningStatus.DA_DON_XONG) {
            throw new RoomAlreadyCleanedException("Phòng đã được dọn với mã phòng: " + roomCode);
        }

        room.setCleaningStatus(CleaningStatus.DA_DON_XONG);

        return roomRepository.save(room);
    }
}
