package com.hotel.suongmai.repository;
import com.hotel.suongmai.entity.ThanhToan;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ThanhToanRepository extends JpaRepository<ThanhToan, String> {

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM ThanhToan t " +
            "WHERE t.booking.id = :bookingId AND t.status = 'THANH_CONG' " +
            "AND t.transactionType IN ('TIEN_COC', 'THANH_TOAN_HOA_DON')")
    BigDecimal sumPaidByBooking(@Param("bookingId") String bookingId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM ThanhToan t " +
            "WHERE t.booking.id = :bookingId " +
            "AND t.transactionType = 'TIEN_COC' " +
            "AND t.status = 'THANH_CONG'")
    BigDecimal sumSuccessfulDepositByBookingId(@Param("bookingId") String bookingId);
}
