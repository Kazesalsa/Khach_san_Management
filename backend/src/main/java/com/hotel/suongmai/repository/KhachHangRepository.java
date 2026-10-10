package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, String> {
    Optional<KhachHang> findByTaiKhoanId(String taiKhoanId);
}
