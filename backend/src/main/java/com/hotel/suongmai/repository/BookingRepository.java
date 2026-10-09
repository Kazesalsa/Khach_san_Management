package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
    public interface BookingRepository extends JpaRepository<Booking, String> {
        @Query("""
            SELECT COUNT(b) > 0 FROM Booking b
            WHERE b.room.roomCategory.id = :categoryId
              AND b.status NOT IN ('CANCELLED', 'DA_HUY')
              AND b.checkInDate <= :toDate
              AND b.checkOutDate >= :fromDate
        """)
        boolean existsActiveBookingsInDateRange(
            @Param("categoryId") String categoryId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
        );
    }
