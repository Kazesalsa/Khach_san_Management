package com.hotel.suongmai.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "khach_hang")
@Data
public class KhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tai_khoan_id", unique = true)
    private TaiKhoan taiKhoan;

    @Column(name = "ho_ten", nullable = false, length = 100)
    private String hoTen;

    @Column(name = "so_dien_thoai", unique = true, nullable = false, length = 15)
    private String soDienThoai;

    @Column(name = "cccd_ho_chieu", unique = true, length = 20)
    private String cccdHoChieu;

    @Column(length = 150)
    private String email;

    @Column(name = "so_thich_phong")
    private String soThichPhong;

    @Column(name = "ngay_tao", insertable = false, updatable = false)
    private LocalDateTime ngayTao;
}
