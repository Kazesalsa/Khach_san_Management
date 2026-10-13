package com.hotel.suongmai.repository;
import com.hotel.suongmai.entity.HoaDon;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, String> {
    Optional<HoaDon> findByBookingId(String bookingId);
    boolean existsByInvoiceNumber(String invoiceNumber);
}
