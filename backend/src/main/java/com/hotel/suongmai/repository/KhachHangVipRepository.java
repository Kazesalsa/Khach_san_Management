package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.KhachHangVip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KhachHangVipRepository extends JpaRepository<KhachHangVip, String> {
}
