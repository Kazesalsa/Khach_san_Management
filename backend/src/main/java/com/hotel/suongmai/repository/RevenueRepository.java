package com.hotel.suongmai.repository;

import com.hotel.suongmai.entity.HoaDon;
import com.hotel.suongmai.projection.RevenueByPeriodProjection;
import com.hotel.suongmai.projection.RevenueByRoomCategoryProjection;
import com.hotel.suongmai.projection.RevenueKpiProjection;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Repository
public interface RevenueRepository extends org.springframework.data.repository.Repository<HoaDon, String> {

    @Query(value = """
            SELECT
                COALESCE(SUM(total_revenue), 0) AS totalRevenue,
                COALESCE(SUM(room_revenue), 0) AS roomRevenue,
                COALESCE(SUM(service_revenue), 0) AS serviceRevenue,
                COUNT(DISTINCT booking_detail_id) AS bookingCount
            FROM v_revenue_detail
            WHERE revenue_at >= :fromDate
              AND revenue_at < :toDate
              AND (:roomCategoryId IS NULL OR room_category_id = :roomCategoryId)
            """, nativeQuery = true)
    RevenueKpiProjection calculateKpi(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("roomCategoryId") String roomCategoryId
    );

    @Query(value = """
            SELECT
                room_category_id AS roomCategoryId,
                room_category_name AS roomCategoryName,
                COALESCE(SUM(room_revenue), 0) AS roomRevenue
            FROM v_revenue_detail
            WHERE revenue_at >= :fromDate
              AND revenue_at < :toDate
              AND (:roomCategoryId IS NULL OR room_category_id = :roomCategoryId)
            GROUP BY room_category_id, room_category_name
            ORDER BY room_category_name
            """, nativeQuery = true)
    List<RevenueByRoomCategoryProjection> calculateByRoomCategory(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("roomCategoryId") String roomCategoryId
    );

    @Query(value = """
            SELECT
                CAST(revenue_at AS date) AS period,
                COALESCE(SUM(room_revenue), 0) AS roomRevenue,
                COALESCE(SUM(service_revenue), 0) AS serviceRevenue,
                COALESCE(SUM(total_revenue), 0) AS totalRevenue
            FROM v_revenue_detail
            WHERE revenue_at >= :fromDate
              AND revenue_at < :toDate
              AND (:roomCategoryId IS NULL OR room_category_id = :roomCategoryId)
            GROUP BY CAST(revenue_at AS date)
            ORDER BY period
            """, nativeQuery = true)
    List<RevenueByPeriodProjection> calculateByDay(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("roomCategoryId") String roomCategoryId
    );

    @Query(value = """
            SELECT
                CAST(DATE_TRUNC('month', revenue_at) AS date) AS period,
                COALESCE(SUM(room_revenue), 0) AS roomRevenue,
                COALESCE(SUM(service_revenue), 0) AS serviceRevenue,
                COALESCE(SUM(total_revenue), 0) AS totalRevenue
            FROM v_revenue_detail
            WHERE revenue_at >= :fromDate
              AND revenue_at < :toDate
              AND (:roomCategoryId IS NULL OR room_category_id = :roomCategoryId)
            GROUP BY CAST(DATE_TRUNC('month', revenue_at) AS date)
            ORDER BY period
            """, nativeQuery = true)
    List<RevenueByPeriodProjection> calculateByMonth(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("roomCategoryId") String roomCategoryId
    );
}
