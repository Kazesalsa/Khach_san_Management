package com.hotel.suongmai.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hotel.suongmai.entity.KhachHang;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, String> {

    Optional<KhachHang> findByTaiKhoanId(String taiKhoanId);
}
