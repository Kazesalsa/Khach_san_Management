package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "thanh_toan")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThanhToan {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_giao_dich", nullable = false)
    private LoaiGiaoDich transactionType;

    @Column(name = "so_tien", nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "phuong_thuc", nullable = false)
    private PhuongThucThanhToan paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiThanhToan status;

    @Column(name = "thoi_gian", insertable = false, updatable = false)
    private LocalDateTime transactionTime;

    @Column(name = "ma_tham_chieu", length = 100, unique = true)
    private String referenceCode;

    @ManyToOne
    @JoinColumn(name = "phieu_dat_phong_id")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "hoa_don_id")
    private HoaDon invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_thu_id", nullable = false)
    private NhanVien cashierStaff;
}
