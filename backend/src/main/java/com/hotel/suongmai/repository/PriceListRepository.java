package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.PriceList;
    import com.hotel.suongmai.entity.Booking;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;
    import org.springframework.stereotype.Repository;
    import java.time.LocalDateTime;

@Repository
    public interface PriceListRepository extends JpaRepository<PriceList, String> {
        @Query("""
            SELECT COUNT(p) > 0 FROM PriceList p
            WHERE p.roomCategory.id = :categoryId
              AND (:excludeId IS NULL OR p.id != :excludeId)
              AND p.startDate <= :toDate
              AND p.endDate >= :fromDate
        """)
        boolean existsOverlappingPrice(
            @Param("categoryId") String categoryId,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("excludeId") String excludeId
        );
    }
