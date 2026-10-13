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
                COALESCE(SUM(tong_doanh_thu), 0) AS totalRevenue,
                COALESCE(SUM(doanh_thu_phong), 0) AS roomRevenue,
                COALESCE(SUM(doanh_thu_dich_vu), 0) AS serviceRevenue,
                COUNT(DISTINCT ma_chi_tiet_dat_phong) AS bookingCount
            FROM v_chi_tiet_doanh_thu
            WHERE thoi_gian_doanh_thu >= :fromDate
              AND thoi_gian_doanh_thu < :toDate
              AND (:roomCategoryId IS NULL OR ma_loai_phong = :roomCategoryId)
            """, nativeQuery = true)
    RevenueKpiProjection calculateKpi(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("roomCategoryId") String roomCategoryId
    );

    @Query(value = """
            SELECT
                ma_loai_phong AS roomCategoryId,
                ten_loai_phong AS roomCategoryName,
                COALESCE(SUM(doanh_thu_phong), 0) AS roomRevenue
            FROM v_chi_tiet_doanh_thu
            WHERE thoi_gian_doanh_thu >= :fromDate
              AND thoi_gian_doanh_thu < :toDate
              AND (:roomCategoryId IS NULL OR ma_loai_phong = :roomCategoryId)
            GROUP BY ma_loai_phong, ten_loai_phong
            ORDER BY ten_loai_phong
            """, nativeQuery = true)
    List<RevenueByRoomCategoryProjection> calculateByRoomCategory(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("roomCategoryId") String roomCategoryId
    );

    @Query(value = """
            SELECT
                CAST(thoi_gian_doanh_thu AS date) AS period,
                COALESCE(SUM(doanh_thu_phong), 0) AS roomRevenue,
                COALESCE(SUM(doanh_thu_dich_vu), 0) AS serviceRevenue,
                COALESCE(SUM(tong_doanh_thu), 0) AS totalRevenue
            FROM v_chi_tiet_doanh_thu
            WHERE thoi_gian_doanh_thu >= :fromDate
              AND thoi_gian_doanh_thu < :toDate
              AND (:roomCategoryId IS NULL OR ma_loai_phong = :roomCategoryId)
            GROUP BY CAST(thoi_gian_doanh_thu AS date)
            ORDER BY period
            """, nativeQuery = true)
    List<RevenueByPeriodProjection> calculateByDay(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("roomCategoryId") String roomCategoryId
    );

    @Query(value = """
            SELECT
                CAST(DATE_TRUNC('month', thoi_gian_doanh_thu) AS date) AS period,
                COALESCE(SUM(doanh_thu_phong), 0) AS roomRevenue,
                COALESCE(SUM(doanh_thu_dich_vu), 0) AS serviceRevenue,
                COALESCE(SUM(tong_doanh_thu), 0) AS totalRevenue
            FROM v_chi_tiet_doanh_thu
            WHERE thoi_gian_doanh_thu >= :fromDate
              AND thoi_gian_doanh_thu < :toDate
              AND (:roomCategoryId IS NULL OR ma_loai_phong = :roomCategoryId)
            GROUP BY CAST(DATE_TRUNC('month', thoi_gian_doanh_thu) AS date)
            ORDER BY period
            """, nativeQuery = true)
    List<RevenueByPeriodProjection> calculateByMonth(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("roomCategoryId") String roomCategoryId
    );
}
