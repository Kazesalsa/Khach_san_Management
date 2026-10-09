package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.DanhMucDichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DanhMucDichVuRepository extends JpaRepository<DanhMucDichVu, String> {
}
