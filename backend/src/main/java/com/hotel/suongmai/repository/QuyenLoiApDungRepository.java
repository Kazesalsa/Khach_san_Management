package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.QuyenLoiApDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuyenLoiApDungRepository extends JpaRepository<QuyenLoiApDung, String> {
    List<QuyenLoiApDung> findByBookingId(String bookingId);
}
