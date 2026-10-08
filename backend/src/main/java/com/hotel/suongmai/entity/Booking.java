package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "phieu_dat_phong")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "ma_dat_phong", length = 20, unique = true, nullable = false)
    private String bookingCode;

    @Column(name = "khach_hang_id", nullable = false)
    private String customerId;

    @Column(name = "nhan_vien_tao_id")
    private String creatorId;

    @Column(name = "ngay_tao", insertable = false, updatable = false)
    private java.time.LocalDateTime createdAt;

    @Column(name = "kenh_dat", length = 50, nullable = false)
    private String bookingChannel;

    @Column(name = "tong_tien_du_kien")
    private java.math.BigDecimal estimatedTotal;

    @Column(name = "tien_coc_yeu_cau")
    private java.math.BigDecimal requiredDeposit;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private BookingStatus status;
}
