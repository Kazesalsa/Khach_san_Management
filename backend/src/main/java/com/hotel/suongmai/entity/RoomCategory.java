package com.hotel.suongmai.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "loai_phong")
@Data
public class RoomCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "ten", nullable = false, unique = true)
    private String name;

    @Column(name = "mo_ta")
    private String description;

    @Column(name = "suc_chua_toi_da", nullable = false)
    private Integer maxCapacity;
    


    @ManyToMany
    @JoinTable(
        name = "loai_phong_tien_nghi",
        joinColumns = @JoinColumn(name = "loai_phong_id"),
        inverseJoinColumns = @JoinColumn(name = "tien_nghi_id")
    )
    private java.util.Set<Amenity> amenities;
}
