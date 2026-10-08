package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "hoa_don")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HoaDon {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "so_hoa_don", length = 20, unique = true, nullable = false)
    private String invoiceNumber;

    @Column(name = "ngay_lap", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "tien_phong", nullable = false)
    private BigDecimal roomFee;

    @Column(name = "tien_dich_vu", nullable = false)
    private BigDecimal serviceFee;

    @Column(name = "tien_coc_da_khau_tru")
    private BigDecimal deductedDeposit;

    @Column(name = "tong_tien", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "so_tien_con_lai", nullable = false)
    private BigDecimal remainingAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false)
    private TrangThaiHoaDon status;

    @Column(name = "thoi_gian_chot")
    private LocalDateTime finalizedAt;

    @Column(name = "nhan_vien_chot_id")
    private String finalizedByStaffId;
}
