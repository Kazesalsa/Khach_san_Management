package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, String> {
    Optional<NhanVien> findByTenDangNhap(String tenDangNhap);
}
