package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import java.math.BigDecimal;

@Entity
@Table(name = "dich_vu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DichVu {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "danh_muc_id", nullable = false)
    private DanhMucDichVu danhMucDichVu;

    @Column(name = "ten", length = 150, nullable = false, unique = true)
    private String ten;

    @Column(name = "don_vi_tinh", length = 30, nullable = false)
    private String donViTinh;

    @Column(name = "don_gia_hien_tai", precision = 12, scale = 2, nullable = false)
    private BigDecimal donGiaHienTai;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiDichVu trangThai;
}
