package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "room")
@Data
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_number", nullable = false, unique = true)
    private String roomNumber;

    @Column(nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "room_category_id", nullable = false)
    private RoomCategory roomCategory;
}
