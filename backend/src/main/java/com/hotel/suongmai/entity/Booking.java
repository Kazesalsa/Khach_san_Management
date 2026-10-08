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

    @ManyToOne
    @JoinColumn(name = "khach_hang_id", nullable = false)
    private KhachHang customer;

    @Column(name = "ngay_nhan_phong", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "ngay_tra_phong", nullable = false)
    private LocalDate checkOutDate;

    @ManyToOne
    @JoinColumn(name = "phong_id", nullable = false)
    private Room room;

    @Column(name = "trang_thai", nullable = false)
    private String status;
}
