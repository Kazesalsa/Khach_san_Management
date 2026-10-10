package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.entity.CleaningStatus;
import com.hotel.suongmai.entity.UsageStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    List<Room> findByUsageStatusAndCleaningStatus(UsageStatus usageStatus, CleaningStatus cleaningStatus);
}
