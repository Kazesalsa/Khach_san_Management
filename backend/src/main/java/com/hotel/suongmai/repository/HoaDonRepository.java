import com.hotel.suongmai.entity.HoaDon;
package com.hotel.suongmai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, String> {
}
