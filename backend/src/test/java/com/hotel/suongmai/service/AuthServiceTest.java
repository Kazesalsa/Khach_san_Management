package com.hotel.suongmai.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.hotel.suongmai.dto.LoginRequest;
import com.hotel.suongmai.dto.LoginResponse;
import com.hotel.suongmai.dto.ProfileResponse;
import com.hotel.suongmai.entity.KhachHang;
import com.hotel.suongmai.entity.NhanVien;
import com.hotel.suongmai.entity.TaiKhoan;
import com.hotel.suongmai.entity.TrangThaiTaiKhoan;
import com.hotel.suongmai.entity.VaiTro;
import com.hotel.suongmai.exception.ProfileNotFoundException;
import com.hotel.suongmai.repository.KhachHangRepository;
import com.hotel.suongmai.repository.NhanVienRepository;
import com.hotel.suongmai.security.JwtTokenProvider;
import com.hotel.suongmai.security.TaiKhoanDetails;

class AuthServiceTest {

    private AuthenticationManager authenticationManager;
    private JwtTokenProvider jwtTokenProvider;
    private KhachHangRepository khachHangRepository;
    private NhanVienRepository nhanVienRepository;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        authenticationManager = mock(AuthenticationManager.class);
        jwtTokenProvider = mock(JwtTokenProvider.class);
        khachHangRepository = mock(KhachHangRepository.class);
        nhanVienRepository = mock(NhanVienRepository.class);
        authService = new AuthService(
                authenticationManager, jwtTokenProvider,
                khachHangRepository, nhanVienRepository);
    }

    @Test
    void loginAuthenticatesAndReturnsGeneratedToken() {
        TaiKhoan account = account("account-1", "owner", VaiTro.CHU_KHACH_SAN);
        TaiKhoanDetails details = new TaiKhoanDetails(account);
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(details);
        when(authenticationManager.authenticate(org.mockito.ArgumentMatchers.any()))
                .thenReturn(authentication);
        when(jwtTokenProvider.generateToken(authentication)).thenReturn("signed.jwt.token");

        LoginResponse response = authService.login(new LoginRequest("owner", "correct-password"));

        assertThat(response.token()).isEqualTo("signed.jwt.token");
        assertThat(response.tokenType()).isEqualTo("Bearer");
        assertThat(response.accountId()).isEqualTo("account-1");
        assertThat(response.username()).isEqualTo("owner");
        assertThat(response.role()).isEqualTo(VaiTro.CHU_KHACH_SAN);
        verify(jwtTokenProvider).generateToken(authentication);
    }

    @Test
    void loginPropagatesBadCredentials() {
        when(authenticationManager.authenticate(org.mockito.ArgumentMatchers.any()))
                .thenThrow(new BadCredentialsException("bad credentials"));

        assertThatThrownBy(() -> authService.login(new LoginRequest("owner", "wrong")))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void loginPropagatesLockedAccount() {
        when(authenticationManager.authenticate(org.mockito.ArgumentMatchers.any()))
                .thenThrow(new LockedException("locked"));

        assertThatThrownBy(() -> authService.login(new LoginRequest("owner", "password")))
                .isInstanceOf(LockedException.class);
    }

    @Test
    void developmentSeedPasswordUsesAValidBcryptHash() {
        String seedHash = "$2a$10$/sF0Z6RLNOwWbtrvyhf.Ley.ACw/7U24CPn6w4FECbpu8CLvNEMMC";

        assertThat(new BCryptPasswordEncoder().matches("password", seedHash)).isTrue();
    }

    @Test
    void returnsCustomerProfileForCustomerAccount() {
        TaiKhoan account = account("account-customer", "customer", VaiTro.KHACH_HANG);
        KhachHang customer = new KhachHang();
        customer.setId("customer-1");
        customer.setTaiKhoan(account);
        customer.setHoTen("Nguyễn Văn A");
        customer.setEmail("customer@example.com");
        customer.setSoDienThoai("0900000000");
        customer.setCccdHoChieu("001234567890");
        customer.setSoThichPhong("Tầng cao");
        customer.setNgayTao(LocalDateTime.of(2026, 10, 9, 10, 0));
        when(khachHangRepository.findByTaiKhoanId("account-customer"))
                .thenReturn(Optional.of(customer));

        ProfileResponse response = authService.getProfile(new TaiKhoanDetails(account));

        assertThat(response.profileType()).isEqualTo("CUSTOMER");
        assertThat(response.profileId()).isEqualTo("customer-1");
        assertThat(response.fullName()).isEqualTo("Nguyễn Văn A");
        assertThat(response.phoneNumber()).isEqualTo("0900000000");
        assertThat(response.identityDocument()).isEqualTo("001234567890");
    }

    @Test
    void returnsEmployeeProfileForStaffAccount() {
        TaiKhoan account = account("account-staff", "receptionist", VaiTro.LE_TAN);
        NhanVien employee = new NhanVien();
        employee.setId("employee-1");
        employee.setTaiKhoan(account);
        employee.setHoNv("Trần");
        employee.setTenNv("Bình");
        employee.setEmail("staff@example.com");
        when(nhanVienRepository.findByTaiKhoanId("account-staff"))
                .thenReturn(Optional.of(employee));

        ProfileResponse response = authService.getProfile(new TaiKhoanDetails(account));

        assertThat(response.profileType()).isEqualTo("EMPLOYEE");
        assertThat(response.profileId()).isEqualTo("employee-1");
        assertThat(response.fullName()).isEqualTo("Trần Bình");
        assertThat(response.phoneNumber()).isNull();
    }

    @Test
    void throwsNotFoundWhenProfileDoesNotExist() {
        TaiKhoan account = account("account-missing", "customer", VaiTro.KHACH_HANG);
        when(khachHangRepository.findByTaiKhoanId("account-missing"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.getProfile(new TaiKhoanDetails(account)))
                .isInstanceOf(ProfileNotFoundException.class)
                .hasMessage("Không tìm thấy hồ sơ khách hàng của tài khoản");
    }

    private TaiKhoan account(String id, String username, VaiTro role) {
        TaiKhoan account = new TaiKhoan();
        account.setId(id);
        account.setTenDangNhap(username);
        account.setMatKhauHash("encoded-password");
        account.setVaiTro(role);
        account.setTrangThai(TrangThaiTaiKhoan.HOAT_DONG);
        return account;
    }
}
