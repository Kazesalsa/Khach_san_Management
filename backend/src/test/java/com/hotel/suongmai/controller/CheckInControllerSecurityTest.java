package com.hotel.suongmai.controller;

import com.hotel.suongmai.config.SecurityConfig;
import com.hotel.suongmai.dto.CheckInResponse;
import com.hotel.suongmai.entity.TaiKhoan;
import com.hotel.suongmai.entity.TrangThaiTaiKhoan;
import com.hotel.suongmai.entity.VaiTro;
import com.hotel.suongmai.exception.BookingNotFoundException;
import com.hotel.suongmai.exception.CheckInExceptionHandler;
import com.hotel.suongmai.exception.InvalidBookingStateException;
import com.hotel.suongmai.exception.RoomNotReadyException;
import com.hotel.suongmai.security.JwtAuthenticationFilter;
import com.hotel.suongmai.security.JwtTokenProvider;
import com.hotel.suongmai.security.TaiKhoanDetails;
import com.hotel.suongmai.security.TaiKhoanDetailsService;
import com.hotel.suongmai.service.CheckInService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CheckInController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, CheckInExceptionHandler.class})
class CheckInControllerSecurityTest {

    private static final String ENDPOINT = "/api/bookings/DP001/check-in";

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CheckInService checkInService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private TaiKhoanDetailsService taiKhoanDetailsService;

    @Test
    void rejectsRequestWithoutToken() throws Exception {
        mockMvc.perform(post(ENDPOINT))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(checkInService);
    }

    @Test
    void rejectsCustomerRole() throws Exception {
        authenticate("customer-token", "khach1", VaiTro.KHACH_HANG);

        mockMvc.perform(post(ENDPOINT)
                        .header("Authorization", "Bearer customer-token"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(checkInService);
    }

    @Test
    void rejectsHotelOwnerRole() throws Exception {
        authenticate("owner-token", "owner", VaiTro.CHU_KHACH_SAN);

        mockMvc.perform(post(ENDPOINT)
                        .header("Authorization", "Bearer owner-token"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(checkInService);
    }

    @Test
    void receptionistCanCheckIn() throws Exception {
        authenticate("reception-token", "letan1", VaiTro.LE_TAN);
        LocalDateTime time = LocalDateTime.of(2026, 10, 12, 9, 30);
        CheckInResponse response = new CheckInResponse(
                "DP001",
                List.of("101"),
                time,
                "staff-id",
                "Nguyễn Lan",
                "DA_NHAN",
                "DANG_O",
                "Check-in thành công");
        when(checkInService.checkIn("DP001", "letan1")).thenReturn(response);

        mockMvc.perform(post(ENDPOINT)
                        .header("Authorization", "Bearer reception-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingCode").value("DP001"))
                .andExpect(jsonPath("$.roomNumbers[0]").value("101"))
                .andExpect(jsonPath("$.receptionistId").value("staff-id"))
                .andExpect(jsonPath("$.bookingStatus").value("DA_NHAN"))
                .andExpect(jsonPath("$.roomStatus").value("DANG_O"))
                .andExpect(jsonPath("$.message").value("Check-in thành công"));

        verify(checkInService).checkIn("DP001", "letan1");
    }

    @Test
    void unknownBookingReturnsNotFound() throws Exception {
        authenticate("reception-token", "letan1", VaiTro.LE_TAN);
        when(checkInService.checkIn("DP001", "letan1"))
                .thenThrow(new BookingNotFoundException("Không tìm thấy đặt phòng với mã: DP001"));

        mockMvc.perform(post(ENDPOINT)
                        .header("Authorization", "Bearer reception-token"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message")
                        .value("Không tìm thấy đặt phòng với mã: DP001"));
    }

    @Test
    void uncleanRoomReturnsConflict() throws Exception {
        authenticate("reception-token", "letan1", VaiTro.LE_TAN);
        when(checkInService.checkIn("DP001", "letan1"))
                .thenThrow(new RoomNotReadyException(
                        "Phòng chưa sẵn sàng để nhận khách"));

        mockMvc.perform(post(ENDPOINT)
                        .header("Authorization", "Bearer reception-token"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message")
                        .value("Phòng chưa sẵn sàng để nhận khách"));
    }

    @Test
    void invalidBookingStateReturnsConflict() throws Exception {
        authenticate("reception-token", "letan1", VaiTro.LE_TAN);
        when(checkInService.checkIn("DP001", "letan1"))
                .thenThrow(new InvalidBookingStateException(
                        "Chỉ có thể check-in đặt phòng ở trạng thái DA_DAT"));

        mockMvc.perform(post(ENDPOINT)
                        .header("Authorization", "Bearer reception-token"))
                .andExpect(status().isConflict());
    }

    @Test
    void databaseFailureReturnsInternalServerError() throws Exception {
        authenticate("reception-token", "letan1", VaiTro.LE_TAN);
        when(checkInService.checkIn("DP001", "letan1"))
                .thenThrow(new DataAccessResourceFailureException("database unavailable"));

        mockMvc.perform(post(ENDPOINT)
                        .header("Authorization", "Bearer reception-token"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message")
                        .value("Không thể thực hiện check-in. Vui lòng thử lại sau."));
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
}
