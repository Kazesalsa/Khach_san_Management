package com.hotel.suongmai.controller;

import com.hotel.suongmai.config.SecurityConfig;
import com.hotel.suongmai.dto.RevenueByPeriodResponse;
import com.hotel.suongmai.dto.RevenueByRoomCategoryResponse;
import com.hotel.suongmai.dto.RevenueKpiResponse;
import com.hotel.suongmai.dto.RevenueResponse;
import com.hotel.suongmai.entity.TaiKhoan;
import com.hotel.suongmai.entity.TrangThaiTaiKhoan;
import com.hotel.suongmai.entity.VaiTro;
import com.hotel.suongmai.exception.RevenueExceptionHandler;
import com.hotel.suongmai.security.JwtAuthenticationFilter;
import com.hotel.suongmai.security.JwtTokenProvider;
import com.hotel.suongmai.security.TaiKhoanDetails;
import com.hotel.suongmai.security.TaiKhoanDetailsService;
import com.hotel.suongmai.service.RevenueService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RevenueController.class)
@Import({
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        RevenueExceptionHandler.class
})
class RevenueControllerSecurityTest {

    private static final String ENDPOINT =
            "/api/revenue?fromDate=2026-10-01&toDate=2026-10-31";

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RevenueService revenueService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private TaiKhoanDetailsService taiKhoanDetailsService;

    @Test
    void rejectsRequestWithoutToken() throws Exception {
        mockMvc.perform(get(ENDPOINT))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(revenueService);
    }

    @Test
    void rejectsRoleWithoutReportPermission() throws Exception {
        authenticate("reception-token", "reception", VaiTro.LE_TAN);

        mockMvc.perform(get(ENDPOINT)
                        .header("Authorization", "Bearer reception-token"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(revenueService);
    }

    @Test
    void hotelOwnerCanGetRevenueReport() throws Exception {
        authenticate("owner-token", "owner", VaiTro.CHU_KHACH_SAN);
        RevenueResponse response = revenueResponse();
        when(revenueService.getRevenueReport(
                LocalDate.of(2026, 10, 1),
                LocalDate.of(2026, 10, 31),
                "cat-1"
        )).thenReturn(response);

        mockMvc.perform(get(ENDPOINT + "&roomCategoryId=cat-1")
                        .header("Authorization", "Bearer owner-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.kpi.totalRevenue").value(12000000))
                .andExpect(jsonPath("$.kpi.bookingCount").value(4))
                .andExpect(jsonPath("$.byRoomCategory[0].roomCategoryId")
                        .value("cat-1"))
                .andExpect(jsonPath("$.byDay[0].period")
                        .value("2026-10-02"))
                .andExpect(jsonPath("$.byMonth[0].period")
                        .value("2026-10-01"));

        verify(revenueService).getRevenueReport(
                LocalDate.of(2026, 10, 1),
                LocalDate.of(2026, 10, 31),
                "cat-1");
    }

    @Test
    void adminRoleCanGetRevenueReport() throws Exception {
        authenticateAdmin("admin-token", "admin");
        when(revenueService.getRevenueReport(
                LocalDate.of(2026, 10, 1),
                LocalDate.of(2026, 10, 31),
                null
        )).thenReturn(revenueResponse());

        mockMvc.perform(get(ENDPOINT)
                        .header("Authorization", "Bearer admin-token"))
                .andExpect(status().isOk());

        verify(revenueService).getRevenueReport(
                LocalDate.of(2026, 10, 1),
                LocalDate.of(2026, 10, 31),
                null);
    }

    @Test
    void invalidDateRangeReturnsBadRequest() throws Exception {
        authenticate("owner-token", "owner", VaiTro.CHU_KHACH_SAN);
        when(revenueService.getRevenueReport(
                LocalDate.of(2026, 10, 31),
                LocalDate.of(2026, 10, 1),
                null
        )).thenThrow(new IllegalArgumentException(
                "Ngày bắt đầu không được lớn hơn ngày kết thúc"));

        mockMvc.perform(get(
                        "/api/revenue?fromDate=2026-10-31&toDate=2026-10-01")
                        .header("Authorization", "Bearer owner-token"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message")
                        .value("Ngày bắt đầu không được lớn hơn ngày kết thúc"));
    }

    @Test
    void missingRequiredDateReturnsBadRequest() throws Exception {
        authenticate("owner-token", "owner", VaiTro.CHU_KHACH_SAN);

        mockMvc.perform(get("/api/revenue?fromDate=2026-10-01")
                        .header("Authorization", "Bearer owner-token"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message")
                        .value("Thiếu tham số bắt buộc: toDate"));

        verifyNoInteractions(revenueService);
    }

    @Test
    void malformedDateReturnsBadRequest() throws Exception {
        authenticate("owner-token", "owner", VaiTro.CHU_KHACH_SAN);

        mockMvc.perform(get(
                        "/api/revenue?fromDate=01-10-2026&toDate=2026-10-31")
                        .header("Authorization", "Bearer owner-token"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message")
                        .value("Tham số fromDate không đúng định dạng"));

        verifyNoInteractions(revenueService);
    }

    @Test
    void databaseFailureReturnsGenericServerError() throws Exception {
        authenticate("owner-token", "owner", VaiTro.CHU_KHACH_SAN);
        when(revenueService.getRevenueReport(
                LocalDate.of(2026, 10, 1),
                LocalDate.of(2026, 10, 31),
                null
        )).thenThrow(new DataAccessResourceFailureException(
                "database connection details must not be exposed"));

        mockMvc.perform(get(ENDPOINT)
                        .header("Authorization", "Bearer owner-token"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message")
                        .value("Không thể truy vấn báo cáo doanh thu. Vui lòng thử lại sau."));
    }

    private RevenueResponse revenueResponse() {
        return new RevenueResponse(
                new RevenueKpiResponse(
                        new BigDecimal("12000000"),
                        new BigDecimal("10000000"),
                        new BigDecimal("2000000"),
                        4L),
                List.of(new RevenueByRoomCategoryResponse(
                        "cat-1",
                        "Standard",
                        new BigDecimal("10000000"),
                        new BigDecimal("100.00"))),
                List.of(new RevenueByPeriodResponse(
                        LocalDate.of(2026, 10, 2),
                        new BigDecimal("10000000"),
                        new BigDecimal("2000000"),
                        new BigDecimal("12000000"))),
                List.of(new RevenueByPeriodResponse(
                        LocalDate.of(2026, 10, 1),
                        new BigDecimal("10000000"),
                        new BigDecimal("2000000"),
                        new BigDecimal("12000000")))
        );
    }

    private void authenticate(String token, String username, VaiTro role) {
        when(jwtTokenProvider.validateToken(token)).thenReturn(true);
        when(jwtTokenProvider.getUsernameFromJwt(token)).thenReturn(username);

        TaiKhoan account = new TaiKhoan();
        account.setId("account-id");
        account.setTenDangNhap(username);
        account.setMatKhauHash("encoded-password");
        account.setVaiTro(role);
        account.setTrangThai(TrangThaiTaiKhoan.HOAT_DONG);

        when(taiKhoanDetailsService.loadUserByUsername(username))
                .thenReturn(new TaiKhoanDetails(account));
    }

    private void authenticateAdmin(String token, String username) {
        when(jwtTokenProvider.validateToken(token)).thenReturn(true);
        when(jwtTokenProvider.getUsernameFromJwt(token)).thenReturn(username);
        when(taiKhoanDetailsService.loadUserByUsername(username))
                .thenReturn(User.withUsername(username)
                        .password("encoded-password")
                        .roles("ADMIN")
                        .build());
    }
}
