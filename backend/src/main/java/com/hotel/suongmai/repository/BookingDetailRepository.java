package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, String> {
    List<BookingDetail> findByBookingId(String bookingId);

    @Query("SELECT bd.room.id FROM BookingDetail bd " +
            "WHERE bd.expectedCheckInDate < :checkOut " +
            "AND bd.expectedCheckOutDate > :checkIn " +
            "AND bd.booking.status IN ('CHO_XAC_NHAN', 'DA_DAT', 'DA_NHAN')")
    List<String> findBookedRoomIdsOverlapping(@Param("checkIn") LocalDate checkIn,
                                               @Param("checkOut") LocalDate checkOut);
}
