package com.hotel.suongmai.controller;

import com.hotel.suongmai.config.SecurityConfig;
import com.hotel.suongmai.entity.CleaningStatus;
import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.entity.TaiKhoan;
import com.hotel.suongmai.entity.VaiTro;
import com.hotel.suongmai.exception.RoomAlreadyCleanedException;
import com.hotel.suongmai.exception.RoomExceptionHandler;
import com.hotel.suongmai.exception.RoomNotFoundException;
import com.hotel.suongmai.security.JwtAuthenticationFilter;
import com.hotel.suongmai.security.JwtTokenProvider;
import com.hotel.suongmai.security.TaiKhoanDetails;
import com.hotel.suongmai.security.TaiKhoanDetailsService;
import com.hotel.suongmai.service.RoomService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RoomController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, RoomExceptionHandler.class})
class RoomControllerSecurityTest {

    private static final String ENDPOINT = "/api/rooms/P101/cleaning-status";

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RoomService roomService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private TaiKhoanDetailsService taiKhoanDetailsService;

    @Test
    void rejectsRequestWithoutToken() throws Exception {
        mockMvc.perform(patch(ENDPOINT))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message")
                        .value("Bạn không có quyền thực hiện thao tác này"));

        verifyNoInteractions(roomService);
    }

    @Test
    void rejectsInvalidToken() throws Exception {
        when(jwtTokenProvider.validateToken("invalid-token")).thenReturn(false);

        mockMvc.perform(patch(ENDPOINT)
                        .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message")
                        .value("Bạn không có quyền thực hiện thao tác này"));

        verifyNoInteractions(roomService);
    }

    @Test
    void rejectsAuthenticatedUserWithoutHousekeepingRole() throws Exception {
        authenticate("reception-token", "letan1", VaiTro.LE_TAN);

        mockMvc.perform(patch(ENDPOINT)
                        .header("Authorization", "Bearer reception-token"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message")
                        .value("Bạn không có quyền thực hiện thao tác này"));

        verifyNoInteractions(roomService);
    }

    @Test
    void housekeepingEmployeeCanMarkRoomAsCleaned() throws Exception {
        authenticateHousekeepingEmployee();
        Room room = room("P101", CleaningStatus.DA_DON_XONG);
        when(roomService.markRoomAsCleaned("P101")).thenReturn(room);

        mockMvc.perform(patch(ENDPOINT)
                        .header("Authorization", "Bearer housekeeping-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roomCode").value("P101"))
                .andExpect(jsonPath("$.roomNumber").value("101"))
                .andExpect(jsonPath("$.cleaningStatus").value("DA_DON_XONG"))
                .andExpect(jsonPath("$.message")
                        .value("Cập nhật trạng thái phòng thành công"));
    }

    @Test
    void roomNotFoundReturnsRequiredMessage() throws Exception {
        authenticateHousekeepingEmployee();
        when(roomService.markRoomAsCleaned("P101"))
                .thenThrow(new RoomNotFoundException("Chi tiết nội bộ"));

        mockMvc.perform(patch(ENDPOINT)
                        .header("Authorization", "Bearer housekeeping-token"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Phòng không tồn tại"));
    }

    @Test
    void alreadyCleanedReturnsRequiredMessage() throws Exception {
        authenticateHousekeepingEmployee();
        when(roomService.markRoomAsCleaned("P101"))
                .thenThrow(new RoomAlreadyCleanedException("Chi tiết nội bộ"));

        mockMvc.perform(patch(ENDPOINT)
                        .header("Authorization", "Bearer housekeeping-token"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message")
                        .value("Phòng này đã được đánh dấu dọn xong"));
    }

    @Test
    void databaseErrorReturnsRequiredMessage() throws Exception {
        authenticateHousekeepingEmployee();
        when(roomService.markRoomAsCleaned("P101"))
                .thenThrow(new DataAccessResourceFailureException("Database unavailable"));

        mockMvc.perform(patch(ENDPOINT)
                        .header("Authorization", "Bearer housekeeping-token"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value(
                        "Không thể cập nhật trạng thái phòng. Vui lòng thử lại sau."));
    }

    @Test
    void unexpectedServerErrorReturnsRequiredMessage() throws Exception {
        authenticateHousekeepingEmployee();
        when(roomService.markRoomAsCleaned("P101"))
                .thenThrow(new IllegalStateException("Unexpected error"));

        mockMvc.perform(patch(ENDPOINT)
                        .header("Authorization", "Bearer housekeeping-token"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value(
                        "Không thể cập nhật trạng thái phòng. Vui lòng thử lại sau."));
    }

    private void authenticateHousekeepingEmployee() {
        authenticate("housekeeping-token", "buong1", VaiTro.NHAN_VIEN_BUONG);
    }

    private void authenticate(String token, String username, VaiTro role) {
        TaiKhoan account = new TaiKhoan();
        account.setId("account-1");
        account.setTenDangNhap(username);
        account.setMatKhauHash("encoded-password");
        account.setVaiTro(role);
        account.setTrangThai("HOAT_DONG");

        when(jwtTokenProvider.validateToken(token)).thenReturn(true);
        when(jwtTokenProvider.getUsernameFromJwt(token)).thenReturn(username);
        when(taiKhoanDetailsService.loadUserByUsername(username))
                .thenReturn(new TaiKhoanDetails(account));
    }

    private Room room(String roomCode, CleaningStatus status) {
        Room room = new Room();
        room.setId("room-id");
        room.setRoomCode(roomCode);
        room.setRoomNumber("101");
        room.setCleaningStatus(status);
        return room;
    }
}
