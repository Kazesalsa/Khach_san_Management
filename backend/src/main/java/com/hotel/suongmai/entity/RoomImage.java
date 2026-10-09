package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "phong_hinh_anh")
@Data
public class RoomImage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "url", unique = true)
    private String url;

    @Column(name = "thu_tu_hien_thi")
    private String displayOrder;

    @Column(name = "la_anh_dai_dien")
    private String isPrimary;

    @ManyToOne
    @JoinColumn(name = "phong_id", nullable = false)
    private Room room;
}
