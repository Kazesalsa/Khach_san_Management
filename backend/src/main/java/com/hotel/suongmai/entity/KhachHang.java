package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "khach_hang")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
public class KhachHang {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tai_khoan_id", unique = true)
    private TaiKhoan taiKhoan;

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String fullName;

    @Column(name = "so_dien_thoai", unique = true, nullable = false, length = 15)
    private String phoneNumber;

    @Column(name = "cccd_ho_chieu", unique = true, length = 20)
    private String cccdPassport;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "so_thich_phong")
    private String roomPreferences;

    @Column(name = "ngay_tao", insertable = false, updatable = false)
    private java.time.LocalDateTime createdAt;
}
