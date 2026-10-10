package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.PriceList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;

@Repository
public interface PriceListRepository extends JpaRepository<PriceList, String> {
    
    @Query("SELECT COUNT(p) > 0 FROM PriceList p WHERE p.roomCategory.id = :categoryId " +
           "AND p.startDate <= :endDate AND p.endDate >= :startDate " +
           "AND (:excludeId IS NULL OR p.id != :excludeId)")
    boolean existsOverlappingPrice(@Param("categoryId") String categoryId, 
                                   @Param("startDate") LocalDateTime startDate, 
                                   @Param("endDate") LocalDateTime endDate, 
                                   @Param("excludeId") String excludeId);
}
