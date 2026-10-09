package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tai_khoan")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaiKhoan {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(name = "ten_dang_nhap", length = 50, unique = true, nullable = false)
    private String tenDangNhap;

    @Column(name = "mat_khau_hash", length = 255, nullable = false)
    private String matKhauHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "vai_tro", nullable = false)
    private VaiTro vaiTro;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", length = 20, nullable = false)
    private TrangThaiTaiKhoan trangThai = TrangThaiTaiKhoan.HOAT_DONG;
}