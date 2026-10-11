package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.Booking;
import com.hotel.suongmai.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {

    /**
     * Kiểm tra xem mã đặt phòng đã tồn tại chưa (dùng cho logic tự sinh mã duy nhất)
     */
    boolean existsByBookingCode(String bookingCode);

    /**
     * Tìm phiếu đặt theo mã đặt phòng
     */
    Optional<Booking> findByBookingCode(String bookingCode);

    /**
     * Tìm phiếu đặt theo mã đặt phòng kèm thông tin chi tiết phòng, loại phòng và khách hàng (Fetch Join để tối ưu query)
     */
    @Query("""
            SELECT b FROM Booking b
            LEFT JOIN FETCH b.customer c
            LEFT JOIN FETCH b.bookingDetails bd
            LEFT JOIN FETCH bd.room r
            LEFT JOIN FETCH r.roomCategory
            WHERE b.bookingCode = :bookingCode
    """)
    Optional<Booking> findByBookingCodeWithDetails(@Param("bookingCode") String bookingCode);

    /**
     * Tìm danh sách phiếu đặt theo số điện thoại khách hàng
     */
    List<Booking> findByCustomerSoDienThoai(String soDienThoai);

    /**
     * Tìm danh sách phiếu đặt theo số điện thoại khách hàng kèm chi tiết phòng và loại phòng
     */
    @Query("""
            SELECT DISTINCT b FROM Booking b
            LEFT JOIN FETCH b.customer c
            LEFT JOIN FETCH b.bookingDetails bd
            LEFT JOIN FETCH bd.room r
            LEFT JOIN FETCH r.roomCategory
            WHERE c.soDienThoai = :soDienThoai
            ORDER BY b.createdAt DESC
    """)
    List<Booking> findByCustomerPhoneNumberWithDetails(@Param("soDienThoai") String soDienThoai);

    /**
     * Tìm danh sách phiếu đặt theo trạng thái
     */
    List<Booking> findByStatus(BookingStatus status);

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

