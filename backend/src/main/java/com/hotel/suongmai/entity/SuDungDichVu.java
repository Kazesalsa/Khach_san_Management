package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "su_dung_dich_vu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuDungDichVu {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chi_tiet_dat_phong_id", nullable = false)
    private BookingDetail bookingDetail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dich_vu_id", nullable = false)
    private DichVu dichVu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_ghi_nhan_id", nullable = false)
    private NhanVien nhanVienGhiNhan;

    @Column(name = "so_luong", precision = 10, scale = 2, nullable = false)
    private BigDecimal soLuong;

    @Column(name = "don_gia_ap_dung", precision = 12, scale = 2, nullable = false)
    private BigDecimal donGiaApDung;

    @Column(name = "thoi_gian_su_dung")
    private LocalDateTime thoiGianSuDung;
}
