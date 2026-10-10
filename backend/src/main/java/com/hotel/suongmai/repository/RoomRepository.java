package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.entity.CleaningStatus;
import com.hotel.suongmai.entity.UsageStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    Optional<Room> findByRoomCode(String roomCode);
    List<Room> findByUsageStatusAndCleaningStatus(UsageStatus usageStatus, CleaningStatus cleaningStatus);
}
