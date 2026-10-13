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
    List<Room> findAllByOrderByFloorAscRoomNumberAsc();

    @Query(value = "SELECT r.* FROM phong r " +
            "WHERE NOT EXISTS ( " +
            "    SELECT 1 FROM chi_tiet_dat_phong bd " +
            "    JOIN phieu_dat_phong pdp ON pdp.id = bd.phieu_dat_phong_id " +
            "    WHERE bd.phong_id = r.id " +
            "    AND :toDate > bd.ngay_nhan_du_kien " +
            "    AND :fromDate < bd.ngay_tra_du_kien " +
            "    AND CAST(pdp.trang_thai AS VARCHAR) IN ('CHO_XAC_NHAN', 'DA_DAT', 'DA_NHAN') " +
            ")", nativeQuery = true)
    List<Room> findAvailableRooms(
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );
}
