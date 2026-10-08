import com.hotel.suongmai.entity.ChiTietGiaPhongId;
import com.hotel.suongmai.entity.ChiTietGiaPhong;
package com.hotel.suongmai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChiTietGiaPhongRepository extends JpaRepository<ChiTietGiaPhong, ChiTietGiaPhongId> {
}
