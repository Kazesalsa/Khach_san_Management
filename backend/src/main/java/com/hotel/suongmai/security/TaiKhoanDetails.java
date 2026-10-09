package com.hotel.suongmai.security;

import com.hotel.suongmai.entity.TaiKhoan;
import com.hotel.suongmai.entity.TrangThaiTaiKhoan;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
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
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() {
        return this.taiKhoan.getTrangThai() != TrangThaiTaiKhoan.BI_KHOA;
    }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() {
        return this.taiKhoan.getTrangThai() == TrangThaiTaiKhoan.HOAT_DONG;
    }
}