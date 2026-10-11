package com.hotel.suongmai.controller;

import com.hotel.suongmai.config.SecurityConfig;
import com.hotel.suongmai.entity.TaiKhoan;
import com.hotel.suongmai.entity.TrangThaiTaiKhoan;
import com.hotel.suongmai.entity.VaiTro;
import com.hotel.suongmai.security.JwtAuthenticationFilter;
import com.hotel.suongmai.security.JwtTokenProvider;
import com.hotel.suongmai.security.TaiKhoanDetails;
import com.hotel.suongmai.security.TaiKhoanDetailsService;
import com.hotel.suongmai.service.CheckoutService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CheckoutController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class CheckoutControllerSecurityTest {

    private static final String ENDPOINT = "/api/checkout/rooms";

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CheckoutService checkoutService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private TaiKhoanDetailsService taiKhoanDetailsService;

    private void authenticate(String token, String username, VaiTro role) {
        when(jwtTokenProvider.validateToken(token)).thenReturn(true);
        when(jwtTokenProvider.getUsernameFromJwt(token)).thenReturn(username);

        TaiKhoan account = new TaiKhoan();
        account.setTenDangNhap(username);
        account.setVaiTro(role);
        account.setTrangThai(TrangThaiTaiKhoan.HOAT_DONG);

        when(taiKhoanDetailsService.loadUserByUsername(username)).thenReturn(new TaiKhoanDetails(account));
    }

    @Test
    @DisplayName("Chưa đăng nhập -> 401 Unauthorized")
    void rejectsRequestWithoutToken() throws Exception {
        mockMvc.perform(get(ENDPOINT))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Token không hợp lệ hoặc đã hết hạn"));

        verifyNoInteractions(checkoutService);
    }

    @Test
    @DisplayName("Khách hàng hoặc Buồng phòng gọi API -> 403 Forbidden")
    void rejectsUnauthorizedRoles() throws Exception {
        authenticate("customer-token", "khach1", VaiTro.KHACH_HANG);

        mockMvc.perform(get(ENDPOINT).header("Authorization", "Bearer customer-token"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(checkoutService);
    }

    @Test
    @DisplayName("Lễ tân gọi API -> 200 OK")
    void allowsReceptionist() throws Exception {
        authenticate("receptionist-token", "letan1", VaiTro.LE_TAN);
        when(checkoutService.getOccupiedRooms()).thenReturn(List.of());

        mockMvc.perform(get(ENDPOINT).header("Authorization", "Bearer receptionist-token"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Chủ khách sạn gọi API -> 200 OK")
    void allowsHotelOwner() throws Exception {
        authenticate("owner-token", "admin", VaiTro.CHU_KHACH_SAN);
        when(checkoutService.getOccupiedRooms()).thenReturn(List.of());

        mockMvc.perform(get(ENDPOINT).header("Authorization", "Bearer owner-token"))
                .andExpect(status().isOk());
    }
}
