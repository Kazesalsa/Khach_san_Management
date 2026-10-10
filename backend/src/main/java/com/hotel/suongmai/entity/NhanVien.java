package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "nhan_vien")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NhanVien {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ma_nhan_vien", length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tai_khoan_id", unique = true)
    private TaiKhoan taiKhoan;

    @Column(name = "ho_nv", length = 50, nullable = false)
    private String hoNv;

    @Column(name = "ten_nv", length = 50, nullable = false)
    private String tenNv;

    @Column(name = "email", length = 150)
    private String email;
}
