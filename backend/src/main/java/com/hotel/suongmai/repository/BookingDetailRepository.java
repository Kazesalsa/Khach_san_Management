package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.BookingDetail;
import com.hotel.suongmai.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, String> {
    List<BookingDetail> findByBookingId(String bookingId);

    @Query(value = """
            SELECT EXISTS (
                SELECT 1
                FROM chi_tiet_dat_phong detail
                JOIN phieu_dat_phong booking ON booking.id = detail.phieu_dat_phong_id
                WHERE detail.phong_id = :roomId
                  AND detail.ngay_nhan_du_kien < :checkOut
                  AND detail.ngay_tra_du_kien > :checkIn
                  AND CAST(booking.trang_thai AS VARCHAR) IN ('CHO_XAC_NHAN', 'DA_DAT', 'DA_NHAN')
            )
            """, nativeQuery = true)
    boolean existsActiveBookingOverlap(
            @Param("roomId") String roomId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut);

    @Query("SELECT bd.room.id FROM BookingDetail bd " +
            "WHERE bd.expectedCheckInDate < :checkOut " +
            "AND bd.expectedCheckOutDate > :checkIn " +
            "AND bd.booking.status IN ('CHO_XAC_NHAN', 'DA_DAT', 'DA_NHAN')")
    List<String> findBookedRoomIdsOverlapping(@Param("checkIn") LocalDate checkIn,
                                               @Param("checkOut") LocalDate checkOut);

    @Query("""
            SELECT detail
            FROM BookingDetail detail
            JOIN FETCH detail.booking booking
            JOIN FETCH booking.customer customer
            JOIN FETCH detail.room room
            JOIN FETCH room.roomCategory category
            WHERE booking.status = :status
              AND (
                    :keyword = ''
                    OR UPPER(booking.bookingCode) LIKE CONCAT('%', :keyword, '%')
                    OR (
                        :phoneKeyword <> ''
                        AND REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                            customer.soDienThoai, ' ', ''), '-', ''), '(', ''), ')', ''), '+', '')
                            LIKE CONCAT('%', :phoneKeyword, '%')
                    )
              )
            ORDER BY detail.expectedCheckInDate ASC,
                     booking.createdAt ASC,
                     room.roomNumber ASC
            """)
    List<BookingDetail> findPendingCheckIns(
            @Param("status") BookingStatus status,
            @Param("keyword") String keyword,
            @Param("phoneKeyword") String phoneKeyword);

    @Query("SELECT bd FROM BookingDetail bd " +
            "JOIN FETCH bd.room r " +
            "JOIN FETCH r.roomCategory " +
            "JOIN FETCH bd.booking b " +
            "JOIN FETCH b.customer " +
            "WHERE b.status = 'DA_NHAN' " +
            "AND bd.actualCheckInTime IS NOT NULL " +
            "AND bd.actualCheckOutTime IS NULL " +
            "ORDER BY r.roomNumber")
    List<BookingDetail> findOccupied();
}
