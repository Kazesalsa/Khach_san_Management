package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "phong")
@Data
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "ma_phong", nullable = false)
    private String roomCode;

    @Column(name = "so_phong", nullable = false, unique = true)
    private String roomNumber;

    @Column(name = "tang", nullable = false)
    private Integer floor;

    @ManyToOne
    @JoinColumn(name = "ma_loai_phong", nullable = false)
    private RoomCategory roomCategory;

    @Enumerated(EnumType.STRING)
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.NAMED_ENUM)
    @Column(name = "trang_thai_su_dung", nullable = false)
    private UsageStatus usageStatus;

    @Enumerated(EnumType.STRING)
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.NAMED_ENUM)
    @Column(name = "trang_thai_don_dep", nullable = false)
    private CleaningStatus cleaningStatus;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<RoomImage> images;
}
