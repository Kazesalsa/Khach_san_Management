package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tien_nghi")
@Data
public class Amenity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "ten", nullable = false, unique = true)
    private String name;

    @Column(name = "mo_ta")
    private String description;

    @Enumerated(EnumType.STRING)
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.NAMED_ENUM)
    @Column(name = "trang_thai", nullable = false)
    private AmenityStatus status;
}
