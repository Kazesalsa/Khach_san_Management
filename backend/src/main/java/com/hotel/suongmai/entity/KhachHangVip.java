package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "khach_hang_vip")
@Data
@EqualsAndHashCode(callSuper = true)
public class KhachHangVip extends KhachHang {

    @Enumerated(EnumType.STRING)
    @Column(name = "hang_vip", nullable = false)
    private HangVip hangVip;
}
