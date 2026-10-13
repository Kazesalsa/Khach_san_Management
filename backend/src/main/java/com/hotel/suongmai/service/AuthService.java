package com.hotel.suongmai.service;

import java.security.SecureRandom;
import java.util.Locale;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.suongmai.dto.ForgotPasswordRequest;
import com.hotel.suongmai.dto.ForgotPasswordResponse;
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
import com.hotel.suongmai.exception.AccountNotFoundException;
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

    @Transactional
    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);

        // 1. Tìm tài khoản:
        // TH1: Tìm tài khoản qua tenDangNhap (khách hàng đăng ký dùng email làm username)
        TaiKhoan account = taiKhoanRepository.findByTenDangNhapIgnoreCase(email)
                .orElse(null);

        String recipientName = DEFAULT_CUSTOMER_NAME;

        if (account == null) {
            // TH2: Tìm qua bảng KhachHang
            KhachHang customer = khachHangRepository.findByEmailIgnoreCase(email).orElse(null);
            if (customer != null && customer.getTaiKhoan() != null) {
                account = customer.getTaiKhoan();
                if (customer.getHoTen() != null && !customer.getHoTen().isBlank()) {
                    recipientName = customer.getHoTen();
                }
            }
        } else {
            KhachHang customer = khachHangRepository.findByTaiKhoanId(account.getId()).orElse(null);
            if (customer != null && customer.getHoTen() != null && !customer.getHoTen().isBlank()) {
                recipientName = customer.getHoTen();
            }
        }

        if (account == null) {
            // TH3: Tìm qua bảng NhanVien
            NhanVien employee = nhanVienRepository.findByEmailIgnoreCase(email).orElse(null);
            if (employee != null && employee.getTaiKhoan() != null) {
                account = employee.getTaiKhoan();
                recipientName = employee.getHoNv() + " " + employee.getTenNv();
            }
        }

        if (account == null) {
            throw new AccountNotFoundException("Không tìm thấy tài khoản liên kết với email này.");
        }

        if (account.getTrangThai() == TrangThaiTaiKhoan.BI_KHOA) {
            throw new LockedException("Tài khoản này hiện đang bị khóa. Vui lòng liên hệ quản trị viên.");
        }

        // 2. Tạo mật khẩu mới ngẫu nhiên (10 ký tự: SM@ + 7 ký tự ngẫu nhiên)
        String tempPassword = generateRandomPassword();

        // 3. Mã hóa và cập nhật mật khẩu mới
        account.setMatKhauHash(passwordEncoder.encode(tempPassword));
        taiKhoanRepository.save(account);

        // 4. Gửi email mật khẩu tạm thời
        emailService.sendTemporaryPasswordEmail(email, recipientName, tempPassword);

        return new ForgotPasswordResponse("Mật khẩu mới đã được gửi về email của bạn. Vui lòng kiểm tra hộp thư.");
    }

    private String generateRandomPassword() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(10);
        sb.append("SM@");
        for (int i = 0; i < 7; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
