package com.hotel.suongmai.repository;
import com.hotel.suongmai.entity.LoaiGiaoDich;
import com.hotel.suongmai.entity.ThanhToan;

import java.math.BigDecimal;
import java.util.List;
import com.hotel.suongmai.entity.TrangThaiThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

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
    Optional<ThanhToan> findFirstByInvoiceIdAndTransactionTypeAndStatusOrderByTransactionTimeDesc(
            String invoiceId,
            LoaiGiaoDich transactionType,
            TrangThaiThanhToan status
    );

    Optional<ThanhToan> findByReferenceCode(String referenceCode);

    List<ThanhToan> findByBooking_Id(String bookingId);

    List<ThanhToan> findByBooking_BookingCode(String bookingCode);
}
