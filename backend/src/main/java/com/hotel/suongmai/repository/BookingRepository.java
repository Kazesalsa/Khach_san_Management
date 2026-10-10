package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    
    @Query("SELECT COUNT(bd) > 0 FROM BookingDetail bd " +
           "WHERE bd.room.roomCategory.id = :categoryId " +
           "AND bd.expectedCheckInDate <= :endDate " +
           "AND bd.expectedCheckOutDate >= :startDate " +
           "AND bd.booking.status IN ('CHO_XAC_NHAN', 'DA_DAT', 'DA_NHAN')")
    boolean existsActiveBookingsInDateRange(@Param("categoryId") String categoryId,
                                            @Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate);
}
