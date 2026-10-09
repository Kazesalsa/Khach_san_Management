package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "quyen_loi_ap_dung")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuyenLoiApDung {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    private String id;

    @ManyToOne
    @JoinColumn(name = "phieu_dat_phong_id", nullable = false)
    private Booking booking;

    @Column(name = "ten_quyen_loi", length = 150, nullable = false)
    private String benefitName;

    @Column(name = "gia_tri")
    private String value;

    @Column(name = "trang_thai", length = 50)
    private String status = "DA_CHON";
}
