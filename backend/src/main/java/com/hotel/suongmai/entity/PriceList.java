package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "gia_phong")
@Data
public class PriceList {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "ma_loai_phong", nullable = false)
    private RoomCategory roomCategory;

    @Column(name = "ngay_bat_dau", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "ngay_ket_thuc", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "don_gia", nullable = false)
    private BigDecimal price;
    
    @Column(name = "trang_thai", nullable = false)
    private String status;
}
