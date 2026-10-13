package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "chi_tiet_gia_phong")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(ChiTietGiaPhongId.class)
public class ChiTietGiaPhong {
    @Id
    @ManyToOne
    @JoinColumn(name = "chi_tiet_dat_phong_id", nullable = false)
    private BookingDetail bookingDetail;

    @Id
    @Column(name = "ngay_luu_tru", nullable = false)
    private LocalDate stayDate;

    @Column(name = "don_gia", nullable = false)
    private BigDecimal price;

    @Column(name = "bang_gia_phong_id")
    private String priceTableId;
}
