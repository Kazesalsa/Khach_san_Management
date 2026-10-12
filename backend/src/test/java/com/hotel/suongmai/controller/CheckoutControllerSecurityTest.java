package com.hotel.suongmai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.suongmai.config.SecurityConfig;
import com.hotel.suongmai.dto.BatchCheckoutRequest;
import com.hotel.suongmai.dto.CheckoutResponse;
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
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CheckoutController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class CheckoutControllerSecurityTest {

    private static final String ROOMS_ENDPOINT = "/api/checkout/rooms";
    private static final String CHECKOUT_ENDPOINT = "/api/bookings/BOOK001/checkout";
    private static final String BATCH_CHECKOUT_ENDPOINT = "/api/bookings/batch-checkout";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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

    // =========================================================================
    // GET /api/checkout/rooms
    // =========================================================================

    @Test
    @DisplayName("GET rooms - Chưa đăng nhập -> 401 Unauthorized")
    void rejectsRequestWithoutToken() throws Exception {
        mockMvc.perform(get(ROOMS_ENDPOINT))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Token không hợp lệ hoặc đã hết hạn"));

        verifyNoInteractions(checkoutService);
    }

    @Test
    @DisplayName("GET rooms - Khách hàng hoặc Buồng phòng gọi API -> 403 Forbidden")
    void rejectsUnauthorizedRoles() throws Exception {
        authenticate("customer-token", "khach1", VaiTro.KHACH_HANG);

        mockMvc.perform(get(ROOMS_ENDPOINT).header("Authorization", "Bearer customer-token"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(checkoutService);
    }

    @Test
    @DisplayName("GET rooms - Lễ tân gọi API -> 200 OK")
    void allowsReceptionist() throws Exception {
        authenticate("receptionist-token", "letan1", VaiTro.LE_TAN);
        when(checkoutService.getOccupiedRooms()).thenReturn(List.of());

        mockMvc.perform(get(ROOMS_ENDPOINT).header("Authorization", "Bearer receptionist-token"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET rooms - Chủ khách sạn gọi API -> 200 OK")
    void allowsHotelOwner() throws Exception {
        authenticate("owner-token", "admin", VaiTro.CHU_KHACH_SAN);
        when(checkoutService.getOccupiedRooms()).thenReturn(List.of());

        mockMvc.perform(get(ROOMS_ENDPOINT).header("Authorization", "Bearer owner-token"))
                .andExpect(status().isOk());
    }

    // =========================================================================
    // POST /api/bookings/{bookingCode}/checkout
    // =========================================================================

    @Test
    @DisplayName("POST checkout - Chưa đăng nhập -> 401 Unauthorized")
    void checkout_rejectsWithoutToken() throws Exception {
        mockMvc.perform(post(CHECKOUT_ENDPOINT))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(checkoutService);
    }

    @Test
    @DisplayName("POST checkout - Khách hàng gọi -> 403 Forbidden")
    void checkout_rejectsCustomer() throws Exception {
        authenticate("customer-token", "khach1", VaiTro.KHACH_HANG);

        mockMvc.perform(post(CHECKOUT_ENDPOINT).header("Authorization", "Bearer customer-token"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(checkoutService);
    }

    @Test
    @DisplayName("POST checkout - Lễ tân gọi -> 200 OK")
    void checkout_allowsReceptionist() throws Exception {
        authenticate("receptionist-token", "letan1", VaiTro.LE_TAN);
        CheckoutResponse response = new CheckoutResponse("BOOK001", List.of("101"), LocalDateTime.now(), "Lễ tân", "Trả phòng thành công");
        when(checkoutService.checkout("BOOK001", "letan1")).thenReturn(response);

        mockMvc.perform(post(CHECKOUT_ENDPOINT).header("Authorization", "Bearer receptionist-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingCode").value("BOOK001"))
                .andExpect(jsonPath("$.message").value("Trả phòng thành công"));
    }

    // =========================================================================
    // POST /api/bookings/batch-checkout
    // =========================================================================

    @Test
    @DisplayName("POST batch-checkout - Lễ tân gọi với payload hợp lệ -> 200 OK")
    void batchCheckout_allowsReceptionist() throws Exception {
        authenticate("receptionist-token", "letan1", VaiTro.LE_TAN);
        BatchCheckoutRequest request = new BatchCheckoutRequest(List.of("BOOK001"));
        CheckoutResponse response = new CheckoutResponse("BOOK001", List.of("101"), LocalDateTime.now(), "Lễ tân", "Trả phòng thành công");
        when(checkoutService.batchCheckout(eq(List.of("BOOK001")), eq("letan1"))).thenReturn(List.of(response));

        mockMvc.perform(post(BATCH_CHECKOUT_ENDPOINT)
                        .header("Authorization", "Bearer receptionist-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].bookingCode").value("BOOK001"));
    }
}
