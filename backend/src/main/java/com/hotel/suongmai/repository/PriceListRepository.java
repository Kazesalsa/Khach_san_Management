package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.PriceList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PriceListRepository extends JpaRepository<PriceList, String> {

    @Query("""
            SELECT priceList
            FROM PriceList priceList
            JOIN FETCH priceList.roomCategory
            ORDER BY priceList.startDate DESC, priceList.endDate DESC, priceList.id ASC
            """)
    List<PriceList> findAllWithRoomCategoryOrderByStartDateDesc();

    Optional<PriceList> findFirstByRoomCategory_IdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatus(
            String categoryId, LocalDateTime checkIn, LocalDateTime checkOut, String status);
    
    @Query("SELECT COUNT(p) > 0 FROM PriceList p " +
            "WHERE p.roomCategory.id = :categoryId " +
            "AND p.startDate <= :endDate " +
            "AND p.endDate >= :startDate")
    boolean existsOverlappingPrice(
            @Param("categoryId") String categoryId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COUNT(p) > 0 FROM PriceList p " +
            "WHERE p.roomCategory.id = :categoryId " +
            "AND p.startDate <= :endDate " +
            "AND p.endDate >= :startDate " +
            "AND p.id <> :excludeId")
    boolean existsOverlappingPriceExcludingId(
            @Param("categoryId") String categoryId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("excludeId") String excludeId
    );
}
