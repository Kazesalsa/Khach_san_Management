package com.hotel.suongmai.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotel.suongmai.entity.SystemStatus;

public interface SystemStatusRepository extends JpaRepository<SystemStatus, Integer> {

	Optional<SystemStatus> findFirstByOrderByIdAsc();
}
