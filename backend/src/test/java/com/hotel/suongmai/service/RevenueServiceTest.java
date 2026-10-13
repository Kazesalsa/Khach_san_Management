package com.hotel.suongmai.service;

import com.hotel.suongmai.dto.RevenueResponse;
import com.hotel.suongmai.projection.RevenueByPeriodProjection;
import com.hotel.suongmai.projection.RevenueByRoomCategoryProjection;
import com.hotel.suongmai.projection.RevenueKpiProjection;
import com.hotel.suongmai.repository.RevenueRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RevenueServiceTest {

    @Mock
    private RevenueRepository revenueRepository;

    @Mock
    private RevenueKpiProjection kpiProjection;

    @Mock
    private RevenueByRoomCategoryProjection categoryProjection;

    @Mock
    private RevenueByPeriodProjection periodProjection;

    @InjectMocks
    private RevenueService revenueService;

    @Test
    @DisplayName("Tính đúng KPI, tỷ lệ theo loại phòng và truyền đúng khoảng thời gian")
    void getRevenueReport_ReturnsCalculatedReport() {
        LocalDate fromDate = LocalDate.of(2026, 1, 1);
        LocalDate toDate = LocalDate.of(2026, 1, 31);
        LocalDateTime from = fromDate.atStartOfDay();
        LocalDateTime to = LocalDate.of(2026, 2, 1).atStartOfDay();

        when(kpiProjection.getTotalRevenue()).thenReturn(new BigDecimal("12000000"));
        when(kpiProjection.getRoomRevenue()).thenReturn(new BigDecimal("10000000"));
        when(kpiProjection.getServiceRevenue()).thenReturn(new BigDecimal("2000000"));
        when(kpiProjection.getBookingCount()).thenReturn(4L);

        when(categoryProjection.getRoomCategoryId()).thenReturn("cat-1");
        when(categoryProjection.getRoomCategoryName()).thenReturn("Standard");
        when(categoryProjection.getRoomRevenue()).thenReturn(new BigDecimal("2500000"));

        when(periodProjection.getPeriod()).thenReturn(LocalDate.of(2026, 1, 2));
        when(periodProjection.getRoomRevenue()).thenReturn(new BigDecimal("2500000"));
        when(periodProjection.getServiceRevenue()).thenReturn(new BigDecimal("500000"));
        when(periodProjection.getTotalRevenue()).thenReturn(new BigDecimal("3000000"));

        when(revenueRepository.calculateKpi(from, to, "cat-1"))
                .thenReturn(kpiProjection);
        when(revenueRepository.calculateByRoomCategory(from, to, "cat-1"))
                .thenReturn(List.of(categoryProjection));
        when(revenueRepository.calculateByDay(from, to, "cat-1"))
                .thenReturn(List.of(periodProjection));
        when(revenueRepository.calculateByMonth(from, to, "cat-1"))
                .thenReturn(List.of(periodProjection));

        RevenueResponse result = revenueService.getRevenueReport(
                fromDate, toDate, "cat-1");

        assertThat(result.kpi().totalRevenue())
                .isEqualByComparingTo("12000000");
        assertThat(result.kpi().roomRevenue())
                .isEqualByComparingTo("10000000");
        assertThat(result.kpi().serviceRevenue())
                .isEqualByComparingTo("2000000");
        assertThat(result.kpi().bookingCount()).isEqualTo(4L);

        assertThat(result.byRoomCategory()).hasSize(1);
        assertThat(result.byRoomCategory().get(0).contributionPercentage())
                .isEqualByComparingTo("25.00");
        assertThat(result.byDay()).hasSize(1);
        assertThat(result.byMonth()).hasSize(1);

        verify(revenueRepository).calculateKpi(from, to, "cat-1");
        verify(revenueRepository).calculateByRoomCategory(from, to, "cat-1");
        verify(revenueRepository).calculateByDay(from, to, "cat-1");
        verify(revenueRepository).calculateByMonth(from, to, "cat-1");
    }

    @Test
    @DisplayName("Chuẩn hóa các giá trị doanh thu null về 0 và không chia cho 0")
    void getRevenueReport_NormalizesNullAndZeroRevenue() {
        LocalDate fromDate = LocalDate.of(2026, 2, 1);
        LocalDate toDate = LocalDate.of(2026, 2, 1);
        LocalDateTime from = fromDate.atStartOfDay();
        LocalDateTime to = toDate.plusDays(1).atStartOfDay();

        when(kpiProjection.getTotalRevenue()).thenReturn(null);
        when(kpiProjection.getRoomRevenue()).thenReturn(BigDecimal.ZERO);
        when(kpiProjection.getServiceRevenue()).thenReturn(null);
        when(kpiProjection.getBookingCount()).thenReturn(0L);

        when(categoryProjection.getRoomCategoryId()).thenReturn("cat-2");
        when(categoryProjection.getRoomCategoryName()).thenReturn("Suite");
        when(categoryProjection.getRoomRevenue()).thenReturn(null);

        when(revenueRepository.calculateKpi(from, to, null))
                .thenReturn(kpiProjection);
        when(revenueRepository.calculateByRoomCategory(from, to, null))
                .thenReturn(List.of(categoryProjection));
        when(revenueRepository.calculateByDay(from, to, null))
                .thenReturn(List.of());
        when(revenueRepository.calculateByMonth(from, to, null))
                .thenReturn(List.of());

        RevenueResponse result = revenueService.getRevenueReport(
                fromDate, toDate, null);

        assertThat(result.kpi().totalRevenue()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.kpi().roomRevenue()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.kpi().serviceRevenue()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.byRoomCategory().get(0).roomRevenue())
                .isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.byRoomCategory().get(0).contributionPercentage())
                .isEqualByComparingTo("0.00");
    }

    @Test
    @DisplayName("Từ chối khi ngày bắt đầu lớn hơn ngày kết thúc")
    void getRevenueReport_ThrowsWhenDateRangeIsInvalid() {
        LocalDate fromDate = LocalDate.of(2026, 3, 2);
        LocalDate toDate = LocalDate.of(2026, 3, 1);

        assertThatThrownBy(() -> revenueService.getRevenueReport(
                fromDate, toDate, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Ngày bắt đầu không được lớn hơn ngày kết thúc");

        verifyNoInteractions(revenueRepository);
    }

    @Test
    @DisplayName("Từ chối khi thiếu ngày bắt đầu hoặc ngày kết thúc")
    void getRevenueReport_ThrowsWhenDateIsMissing() {
        LocalDate validDate = LocalDate.of(2026, 3, 1);

        assertThatThrownBy(() -> revenueService.getRevenueReport(
                null, validDate, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Ngày bắt đầu và ngày kết thúc không được để trống");

        assertThatThrownBy(() -> revenueService.getRevenueReport(
                validDate, null, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Ngày bắt đầu và ngày kết thúc không được để trống");

        verifyNoInteractions(revenueRepository);
    }
}
