package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, String> {
    List<BookingDetail> findByBookingId(String bookingId);
}
