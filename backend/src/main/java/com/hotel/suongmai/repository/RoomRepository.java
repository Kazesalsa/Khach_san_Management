package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.entity.CleaningStatus;
import com.hotel.suongmai.entity.UsageStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    Optional<Room> findByRoomCode(String roomCode);
    List<Room> findByUsageStatusAndCleaningStatus(UsageStatus usageStatus, CleaningStatus cleaningStatus);

    @Query("SELECT r FROM Room r " +
            "WHERE NOT EXISTS ( " +
            "SELECT 1 FROM BookingDetail bd " +
            "WHERE bd.room = r " +
            "AND :toDate > bd.expectedCheckInDate " +
            "AND :fromDate < bd.expectedCheckOutDate " +
            "AND bd.booking.status IN (" +
            "com.hotel.suongmai.entity.BookingStatus.CHO_XAC_NHAN, " +
            "com.hotel.suongmai.entity.BookingStatus.DA_DAT, " +
            "com.hotel.suongmai.entity.BookingStatus.DA_NHAN))")
    List<Room> findAvailableRooms(
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );
}
