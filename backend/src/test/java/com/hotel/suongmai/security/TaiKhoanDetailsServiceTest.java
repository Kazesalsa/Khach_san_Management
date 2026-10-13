package com.hotel.suongmai.security;

import com.hotel.suongmai.entity.TaiKhoan;
import com.hotel.suongmai.entity.TrangThaiTaiKhoan;
import com.hotel.suongmai.entity.VaiTro;
import com.hotel.suongmai.repository.TaiKhoanRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaiKhoanDetailsServiceTest {

    @Mock
    private TaiKhoanRepository taiKhoanRepository;

    @InjectMocks
    private TaiKhoanDetailsService taiKhoanDetailsService;

    @Test
    @DisplayName("Thành công: Tìm thấy tài khoản và chuyển đổi sang UserDetails với đúng Role")
    void loadUserByUsername_Success() {
        // 1. Chuẩn bị dữ liệu mẫu
        TaiKhoan mockTaiKhoan = new TaiKhoan();
        mockTaiKhoan.setId("tk-001");
        mockTaiKhoan.setTenDangNhap("admin");
        mockTaiKhoan.setMatKhauHash("$2a$10$hashedPassword...");
        mockTaiKhoan.setVaiTro(VaiTro.CHU_KHACH_SAN);
        mockTaiKhoan.setTrangThai(TrangThaiTaiKhoan.HOAT_DONG);

        when(taiKhoanRepository.findByTenDangNhap("admin")).thenReturn(Optional.of(mockTaiKhoan));

        // 2. Gọi hàm
        UserDetails userDetails = taiKhoanDetailsService.loadUserByUsername("admin");

        // 3. Kiểm tra kết quả
        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo("admin");
        assertThat(userDetails.getPassword()).isEqualTo("$2a$10$hashedPassword...");
        assertThat(userDetails.getAuthorities()).hasSize(1);
        assertThat(userDetails.getAuthorities().iterator().next().getAuthority())
                .isEqualTo("ROLE_CHU_KHACH_SAN");

        verify(taiKhoanRepository, times(1)).findByTenDangNhap("admin");
    }

    @Test
    @DisplayName("Thất bại: Ném UsernameNotFoundException khi tài khoản không tồn tại")
    void loadUserByUsername_NotFound_ThrowsException() {
        when(taiKhoanRepository.findByTenDangNhap("nguoidung_la")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taiKhoanDetailsService
                .loadUserByUsername("nguoidung_la"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("Không tìm thấy tài khoản");

        verify(taiKhoanRepository, times(1)).findByTenDangNhap("nguoidung_la");
    }
}