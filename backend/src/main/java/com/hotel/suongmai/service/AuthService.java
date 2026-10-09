package com.hotel.suongmai.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.suongmai.dto.LoginRequest;
import com.hotel.suongmai.dto.LoginResponse;
import com.hotel.suongmai.dto.ProfileResponse;
import com.hotel.suongmai.entity.KhachHang;
import com.hotel.suongmai.entity.NhanVien;
import com.hotel.suongmai.entity.TaiKhoan;
import com.hotel.suongmai.entity.VaiTro;
import com.hotel.suongmai.exception.ProfileNotFoundException;
import com.hotel.suongmai.repository.KhachHangRepository;
import com.hotel.suongmai.repository.NhanVienRepository;
import com.hotel.suongmai.security.JwtTokenProvider;
import com.hotel.suongmai.security.TaiKhoanDetails;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final KhachHangRepository khachHangRepository;
    private final NhanVienRepository nhanVienRepository;

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        TaiKhoanDetails accountDetails = (TaiKhoanDetails) authentication.getPrincipal();
        TaiKhoan account = accountDetails.getTaiKhoan();

        return new LoginResponse(
                jwtTokenProvider.generateToken(authentication),
                "Bearer",
                account.getId(),
                account.getTenDangNhap(),
                account.getVaiTro());
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(TaiKhoanDetails accountDetails) {
        TaiKhoan account = accountDetails.getTaiKhoan();
        return account.getVaiTro() == VaiTro.KHACH_HANG
                ? customerProfile(account)
                : employeeProfile(account);
    }

    private ProfileResponse customerProfile(TaiKhoan account) {
        KhachHang customer = khachHangRepository.findByTaiKhoanId(account.getId())
                .orElseThrow(() -> new ProfileNotFoundException(
                        "Không tìm thấy hồ sơ khách hàng của tài khoản"));

        return new ProfileResponse(
                account.getId(), account.getTenDangNhap(), account.getVaiTro(),
                "CUSTOMER", customer.getId(), customer.getHoTen(), customer.getEmail(),
                customer.getSoDienThoai(), customer.getCccdHoChieu(),
                customer.getSoThichPhong(), customer.getNgayTao());
    }

    private ProfileResponse employeeProfile(TaiKhoan account) {
        NhanVien employee = nhanVienRepository.findByTaiKhoanId(account.getId())
                .orElseThrow(() -> new ProfileNotFoundException(
                        "Không tìm thấy hồ sơ nhân viên của tài khoản"));

        return new ProfileResponse(
                account.getId(), account.getTenDangNhap(), account.getVaiTro(),
                "EMPLOYEE", employee.getId(), employee.getHoNv() + " " + employee.getTenNv(),
                employee.getEmail(), null, null, null, null);
    }
}
