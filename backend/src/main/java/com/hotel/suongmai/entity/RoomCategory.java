package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "room_category")
@Data
public class RoomCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;
}
