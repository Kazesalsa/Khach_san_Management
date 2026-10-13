package com.hotel.suongmai.service;

import java.util.Locale;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.suongmai.dto.LoginRequest;
import com.hotel.suongmai.dto.LoginResponse;
import com.hotel.suongmai.dto.ProfileResponse;
import com.hotel.suongmai.dto.RegisterRequest;
import com.hotel.suongmai.dto.RegisterResponse;
import com.hotel.suongmai.entity.KhachHang;
import com.hotel.suongmai.entity.NhanVien;
import com.hotel.suongmai.entity.TaiKhoan;
import com.hotel.suongmai.entity.TrangThaiTaiKhoan;
import com.hotel.suongmai.entity.VaiTro;
import com.hotel.suongmai.exception.EmailAlreadyExistsException;
import com.hotel.suongmai.exception.PasswordConfirmationException;
import com.hotel.suongmai.exception.ProfileNotFoundException;
import com.hotel.suongmai.repository.KhachHangRepository;
import com.hotel.suongmai.repository.NhanVienRepository;
import com.hotel.suongmai.repository.TaiKhoanRepository;
import com.hotel.suongmai.security.JwtTokenProvider;
import com.hotel.suongmai.security.TaiKhoanDetails;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String DEFAULT_CUSTOMER_NAME = "Khách hàng";

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final KhachHangRepository khachHangRepository;
    private final NhanVienRepository nhanVienRepository;
    private final TaiKhoanRepository taiKhoanRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

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

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);

        if (!request.password().equals(request.confirmPassword())) {
            throw new PasswordConfirmationException("Mật khẩu xác nhận không khớp");
        }

        if (taiKhoanRepository.existsByTenDangNhapIgnoreCase(email)) {
            throw new EmailAlreadyExistsException("Email đã tồn tại trong hệ thống");
        }

        TaiKhoan account = new TaiKhoan();
        account.setTenDangNhap(email);
        account.setMatKhauHash(passwordEncoder.encode(request.password()));
        account.setVaiTro(VaiTro.KHACH_HANG);
        account.setTrangThai(TrangThaiTaiKhoan.HOAT_DONG);

        TaiKhoan savedAccount = taiKhoanRepository.save(account);

        KhachHang customer = new KhachHang();
        customer.setTaiKhoan(savedAccount);
        customer.setHoTen(DEFAULT_CUSTOMER_NAME);
        customer.setEmail(email);
        khachHangRepository.save(customer);

        emailService.sendWelcomeRegistrationEmail(email, DEFAULT_CUSTOMER_NAME);

        return new RegisterResponse(
                savedAccount.getId(),
                savedAccount.getTenDangNhap(),
                savedAccount.getVaiTro(),
                "Đăng ký tài khoản thành công");
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(TaiKhoanDetails accountDetails) {
        TaiKhoan account = accountDetails.getTaiKhoan();
        return account.getVaiTro() == VaiTro.KHACH_HANG
                ? customerProfile(account)
                : employeeProfile(account);
    }

    private ProfileResponse customerProfile(TaiKhoan account) {
        return khachHangRepository.findByTaiKhoanId(account.getId())
                .map(customer -> new ProfileResponse(
                        account.getId(), account.getTenDangNhap(), account.getVaiTro(),
                        "CUSTOMER", customer.getId(), customer.getHoTen(), customer.getEmail(),
                        customer.getSoDienThoai(), customer.getCccdHoChieu(),
                        customer.getSoThichPhong(), customer.getNgayTao()))
                .orElseGet(() -> new ProfileResponse(
                        account.getId(), account.getTenDangNhap(), account.getVaiTro(),
                        "CUSTOMER", null, DEFAULT_CUSTOMER_NAME, account.getTenDangNhap(),
                        null, null, null, null));
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
