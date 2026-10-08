package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "chi_tiet_dat_phong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    private String id;

    @ManyToOne
    @JoinColumn(name = "phieu_dat_phong_id", nullable = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "phong_id", nullable = false)
    private Room room;

    @Column(name = "ngay_nhan_du_kien", nullable = false)
    private java.time.LocalDate expectedCheckInDate;

    @Column(name = "ngay_tra_du_kien", nullable = false)
    private java.time.LocalDate expectedCheckOutDate;

    @Column(name = "so_khach", nullable = false)
    private Integer guestCount;

    @Column(name = "thoi_gian_nhan_thuc_te")
    private java.time.LocalDateTime actualCheckInTime;

    @Column(name = "thoi_gian_tra_thuc_te")
    private java.time.LocalDateTime actualCheckOutTime;

    @Column(name = "trang_thai", length = 50, nullable = false)
    private String status;

    @Column(name = "nhan_vien_nhan_id")
    private String checkInStaffId;

    @Column(name = "nhan_vien_tra_id")
    private String checkOutStaffId;

    @Column(name = "hoa_don_id")
    private String invoiceId;
}
