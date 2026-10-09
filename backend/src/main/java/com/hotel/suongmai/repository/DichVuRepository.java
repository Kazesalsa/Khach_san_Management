package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.DichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DichVuRepository extends JpaRepository<DichVu, String> {
}
