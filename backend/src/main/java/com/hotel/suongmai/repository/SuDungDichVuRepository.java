package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.SuDungDichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface SuDungDichVuRepository extends JpaRepository<SuDungDichVu, String> {

    @Query("SELECT COALESCE(SUM(s.soLuong * s.donGiaApDung), 0) FROM SuDungDichVu s " +
           "WHERE s.bookingDetail.booking.id = :bookingId")
    BigDecimal sumServiceFeeByBooking(@Param("bookingId") String bookingId);
}
