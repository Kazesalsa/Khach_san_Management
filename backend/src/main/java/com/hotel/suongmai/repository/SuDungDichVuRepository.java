package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.SuDungDichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SuDungDichVuRepository extends JpaRepository<SuDungDichVu, String> {
}
