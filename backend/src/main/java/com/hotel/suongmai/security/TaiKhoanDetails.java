package com.hotel.suongmai.security;

import com.hotel.suongmai.entity.TaiKhoan;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class TaiKhoanDetails implements UserDetails {

    private final TaiKhoan taiKhoan;

    public TaiKhoanDetails(TaiKhoan taiKhoan) {
        this.taiKhoan = taiKhoan;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + taiKhoan.getVaiTro().name())
        );
    }

    @Override
    public String getPassword() {
        return taiKhoan.getMatKhauHash();
    }

    @Override
    public String getUsername() {
        return taiKhoan.getTenDangNhap();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !"BI_KHOA".equalsIgnoreCase(taiKhoan.getTrangThai());
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return "HOAT_DONG".equalsIgnoreCase(taiKhoan.getTrangThai());
    }
}
