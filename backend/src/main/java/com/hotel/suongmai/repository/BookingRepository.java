package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    @Query("""
            SELECT COUNT(detail) > 0 FROM BookingDetail detail
            WHERE detail.room.roomCategory.id = :categoryId
              AND detail.booking.status <> com.hotel.suongmai.entity.BookingStatus.DA_HUY
              AND detail.expectedCheckInDate <= :toDate
              AND detail.expectedCheckOutDate >= :fromDate
        """)
    boolean existsActiveBookingsInDateRange(
            @Param("categoryId") String categoryId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );
}
