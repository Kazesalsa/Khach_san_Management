package com.hotel.suongmai.repository;
import com.hotel.suongmai.entity.HoaDon;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, String> {
}
