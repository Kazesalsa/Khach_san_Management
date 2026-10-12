package com.hotel.suongmai.service;

import com.hotel.suongmai.dto.RevenueByPeriodResponse;
import com.hotel.suongmai.dto.RevenueByRoomCategoryResponse;
import com.hotel.suongmai.dto.RevenueKpiResponse;
import com.hotel.suongmai.dto.RevenueResponse;
import com.hotel.suongmai.projection.RevenueByPeriodProjection;
import com.hotel.suongmai.projection.RevenueKpiProjection;
import com.hotel.suongmai.repository.RevenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RevenueService {

    private final RevenueRepository revenueRepository;

    @Transactional(readOnly = true)
    public RevenueResponse getRevenueReport(
            LocalDate fromDate,
            LocalDate toDate,
            String roomCategoryId
    ) {
        validateDateRange(fromDate, toDate);

        LocalDateTime from = fromDate.atStartOfDay();
        LocalDateTime to = toDate.plusDays(1).atStartOfDay();

        RevenueKpiProjection rawKpi = revenueRepository.calculateKpi(
                from, to, roomCategoryId);

        RevenueKpiResponse kpi = new RevenueKpiResponse(
                valueOrZero(rawKpi.getTotalRevenue()),
                valueOrZero(rawKpi.getRoomRevenue()),
                valueOrZero(rawKpi.getServiceRevenue()),
                rawKpi.getBookingCount()
        );

        List<RevenueByRoomCategoryResponse> byCategory =
                revenueRepository.calculateByRoomCategory(from, to, roomCategoryId)
                        .stream()
                        .map(item -> new RevenueByRoomCategoryResponse(
                                item.getRoomCategoryId(),
                                item.getRoomCategoryName(),
                                valueOrZero(item.getRoomRevenue()),
                                calculatePercentage(item.getRoomRevenue(), kpi.roomRevenue())
                        ))
                        .toList();

        return new RevenueResponse(
                kpi,
                byCategory,
                normalizePeriods(revenueRepository.calculateByDay(
                        from, to, roomCategoryId)),
                normalizePeriods(revenueRepository.calculateByMonth(
                        from, to, roomCategoryId))
        );
    }

    private void validateDateRange(LocalDate fromDate, LocalDate toDate) {
        if (fromDate == null || toDate == null) {
            throw new IllegalArgumentException(
                    "Ngày bắt đầu và ngày kết thúc không được để trống");
        }
        if (fromDate.isAfter(toDate)) {
            throw new IllegalArgumentException(
                    "Ngày bắt đầu không được lớn hơn ngày kết thúc");
        }
    }

    private BigDecimal calculatePercentage(
            BigDecimal revenue,
            BigDecimal totalRoomRevenue
    ) {
        BigDecimal safeRevenue = valueOrZero(revenue);
        if (totalRoomRevenue == null || totalRoomRevenue.signum() == 0) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }

        return safeRevenue
                .multiply(BigDecimal.valueOf(100))
                .divide(totalRoomRevenue, 2, RoundingMode.HALF_UP);
    }

    private List<RevenueByPeriodResponse> normalizePeriods(
            List<RevenueByPeriodProjection> periods
    ) {
        return periods.stream()
                .map(item -> new RevenueByPeriodResponse(
                        item.getPeriod(),
                        valueOrZero(item.getRoomRevenue()),
                        valueOrZero(item.getServiceRevenue()),
                        valueOrZero(item.getTotalRevenue())
                ))
                .toList();
    }

    private BigDecimal valueOrZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
