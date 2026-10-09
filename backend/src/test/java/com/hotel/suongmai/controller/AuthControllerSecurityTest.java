package com.hotel.suongmai.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.hotel.suongmai.config.SecurityConfig;
import com.hotel.suongmai.dto.LoginResponse;
import com.hotel.suongmai.dto.ProfileResponse;
import com.hotel.suongmai.entity.TaiKhoan;
import com.hotel.suongmai.entity.TrangThaiTaiKhoan;
import com.hotel.suongmai.entity.VaiTro;
import com.hotel.suongmai.exception.AuthExceptionHandler;
import com.hotel.suongmai.security.JwtAuthenticationFilter;
import com.hotel.suongmai.security.JwtTokenProvider;
import com.hotel.suongmai.security.TaiKhoanDetails;
import com.hotel.suongmai.security.TaiKhoanDetailsService;
import com.hotel.suongmai.service.AuthService;

@WebMvcTest(AuthController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, AuthExceptionHandler.class})
class AuthControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private TaiKhoanDetailsService taiKhoanDetailsService;

    @Test
    void loginIsPublicAndReturnsTokenJson() throws Exception {
        when(authService.login(any())).thenReturn(new LoginResponse(
                "signed.jwt.token", "Bearer", "account-1", "owner", VaiTro.CHU_KHACH_SAN));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username":"owner","password":"correct-password"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("signed.jwt.token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.role").value("CHU_KHACH_SAN"));
    }

    @Test
    void loginRejectsBlankCredentials() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username":"","password":""}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Dữ liệu đăng nhập không hợp lệ"))
                .andExpect(jsonPath("$.errors.username").exists())
                .andExpect(jsonPath("$.errors.password").exists());
    }

    @Test
    void loginReturnsUnauthorizedForWrongPassword() throws Exception {
        when(authService.login(any()))
                .thenThrow(new BadCredentialsException("bad credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username":"owner","password":"wrong-password"}
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message")
                        .value("Tên đăng nhập hoặc mật khẩu không chính xác"));
    }

    @Test
    void loginReturnsForbiddenForLockedAccount() throws Exception {
        when(authService.login(any())).thenThrow(new LockedException("locked"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username":"locked-user","password":"password"}
                                """))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Tài khoản đã bị khóa"));
    }

    @Test
    void meRejectsRequestWithoutToken() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message")
                        .value("Token không hợp lệ hoặc đã hết hạn"));
    }

    @Test
    void meRejectsInvalidToken() throws Exception {
        when(jwtTokenProvider.validateToken("invalid-token")).thenReturn(false);

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void meReturnsProfileForValidToken() throws Exception {
        TaiKhoan account = new TaiKhoan();
        account.setId("account-1");
        account.setTenDangNhap("owner");
        account.setMatKhauHash("encoded-password");
        account.setVaiTro(VaiTro.CHU_KHACH_SAN);
        account.setTrangThai(TrangThaiTaiKhoan.HOAT_DONG);
        TaiKhoanDetails details = new TaiKhoanDetails(account);

        when(jwtTokenProvider.validateToken("valid-token")).thenReturn(true);
        when(jwtTokenProvider.getUsernameFromJwt("valid-token")).thenReturn("owner");
        when(taiKhoanDetailsService.loadUserByUsername("owner")).thenReturn(details);
        when(authService.getProfile(details)).thenReturn(new ProfileResponse(
                "account-1", "owner", VaiTro.CHU_KHACH_SAN,
                "EMPLOYEE", "employee-1", "Nguyễn Chủ", "owner@example.com",
                null, null, null, null));

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer valid-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountId").value("account-1"))
                .andExpect(jsonPath("$.profileType").value("EMPLOYEE"))
                .andExpect(jsonPath("$.fullName").value("Nguyễn Chủ"));

        verify(jwtTokenProvider).validateToken("valid-token");
        verify(jwtTokenProvider).getUsernameFromJwt("valid-token");
        verify(taiKhoanDetailsService).loadUserByUsername("owner");
    }
}
