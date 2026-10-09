import com.hotel.suongmai.entity.ThanhToan;
package com.hotel.suongmai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ThanhToanRepository extends JpaRepository<ThanhToan, String> {
}
