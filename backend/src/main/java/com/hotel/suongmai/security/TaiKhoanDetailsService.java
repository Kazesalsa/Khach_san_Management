package com.hotel.suongmai.security;

import com.hotel.suongmai.entity.TaiKhoan;
import com.hotel.suongmai.repository.TaiKhoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaiKhoanDetailsService implements UserDetailsService {

    private final TaiKhoanRepository taiKhoanRepository;

    @Override
    public UserDetails loadUserByUsername(String tenDangNhap) throws UsernameNotFoundException {
        TaiKhoan taiKhoan = taiKhoanRepository.findByTenDangNhap(tenDangNhap)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản: " + tenDangNhap));
        return new TaiKhoanDetails(taiKhoan);
    }
}
