import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border-custom shadow-[0_1px_12px_rgba(19,42,58,0.06)]">
      <div className="h-20 max-w-[1360px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-6">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            alt="Logo Khách sạn Sương Mai"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjii5p4ZDIa8n-aBQ8TAdNiNtzIO_iFgE6rj7Ffb9Ggqy9p_GeqsoCAuK6QxhZzX86dwBt_9vyYpi3Or6ggAqTzoLS5ohnNFGVK0nF4TgGecEF0lYnajRVCMxQJ_P66Yrv3uNAl2_KwfhwVEvbCE7iMK55M36UxEG2oCvEynYrusI-99DUok3vKZ3pRF8_cwFJXE40yxbdCoQx_Odz7G5qkLkFwn8Dt-m0kivYXas"
          />
          <div className="flex flex-col">
            <span className="font-headline text-xl text-primary font-bold tracking-tight leading-none hover:text-accent transition-colors">
              Sương Mai Hotel
            </span>
            <span className="text-[10px] uppercase tracking-widest text-text-secondary font-medium mt-1">
              Indochine Elegance & Hospitality
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-7">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm font-medium py-1 transition-colors relative ${
                isActive
                  ? 'text-primary font-bold after:content-[\'\'] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-accent'
                  : 'text-text-secondary hover:text-primary'
              }`
            }
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/rooms"
            className={({ isActive }) =>
              `text-sm font-medium py-1 transition-colors relative ${
                isActive
                  ? 'text-primary font-bold after:content-[\'\'] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-accent'
                  : 'text-text-secondary hover:text-primary'
              }`
            }
          >
            Phòng & Bảng giá
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              `text-sm font-medium py-1 transition-colors relative ${
                isActive
                  ? 'text-primary font-bold after:content-[\'\'] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-accent'
                  : 'text-text-secondary hover:text-primary'
              }`
            }
          >
            Dịch vụ
          </NavLink>
          <NavLink
            to="/promotions"
            className={({ isActive }) =>
              `text-sm font-medium py-1 transition-colors relative ${
                isActive
                  ? 'text-primary font-bold after:content-[\'\'] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-accent'
                  : 'text-text-secondary hover:text-primary'
              }`
            }
          >
            Ưu đãi
          </NavLink>
          <NavLink
            to="/location"
            className={({ isActive }) =>
              `text-sm font-medium py-1 transition-colors relative ${
                isActive
                  ? 'text-primary font-bold after:content-[\'\'] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-accent'
                  : 'text-text-secondary hover:text-primary'
              }`
            }
          >
            Vị trí
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-sm font-medium py-1 transition-colors relative ${
                isActive
                  ? 'text-primary font-bold after:content-[\'\'] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-accent'
                  : 'text-text-secondary hover:text-primary'
              }`
            }
          >
            Liên hệ
          </NavLink>
        </nav>

        {/* Action Controls & Contact */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="hidden 2xl:flex items-center gap-1.5 text-text-secondary hover:text-text-primary cursor-pointer bg-surface border border-border-custom px-2.5 py-1 rounded-full text-xs">
            <span className="font-semibold text-primary uppercase">🇻🇳 VI</span>
            <span className="text-border-custom font-normal">/</span>
            <span className="text-text-secondary hover:text-text-primary uppercase">EN</span>
          </div>

          <a
            className="hidden lg:flex items-center gap-1.5 text-text-secondary hover:text-accent transition-colors group"
            href="tel:02438280000"
          >
            <span className="material-symbols-outlined text-accent text-[18px]">call</span>
            <span className="text-xs font-semibold group-hover:text-accent">024.3828.xxxx</span>
          </a>

          {/* Login Dropdown */}
          <div className="relative group hidden sm:block">
            <button
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-alt/60 transition-all border border-transparent hover:border-border-custom"
              type="button"
            >
              <span>Đăng nhập</span>
              <span className="material-symbols-outlined text-[16px] text-text-secondary transition-transform group-hover:rotate-180">
                expand_more
              </span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border-custom rounded-xl shadow-[0_14px_34px_-4px_rgba(19,42,58,0.12)] p-2 hidden group-hover:flex flex-col z-50">
              <div className="px-3 py-1.5 text-[10px] text-text-secondary uppercase tracking-wider font-semibold">
                Cổng đăng nhập hệ thống
              </div>
              <a
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-[18px] text-accent">bed</span>
                Khách hàng lưu trú
              </a>
              <a
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">concierge</span>
                Lễ tân tiếp đón
              </a>
              <a
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-[18px] text-text-secondary">cleaning_services</span>
                Tổ Buồng phòng
              </a>
              <a
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-[18px] text-accent">hotel</span>
                Chủ khách sạn
              </a>
              <a
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-[18px] text-danger-custom">admin_panel_settings</span>
                Quản trị viên
              </a>
            </div>
          </div>

          {/* Direct Booking CTA */}
          <Link
            to="/rooms"
            className="hidden sm:flex bg-accent text-primary hover:bg-accent-hover font-semibold text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all tracking-wide items-center justify-center shrink-0"
          >
            Đặt phòng ngay
          </Link>

          {/* User profile avatar icon */}
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-text-on-dark hidden sm:flex">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-9 h-9 rounded-lg bg-surface border border-border-custom flex items-center justify-center text-text-primary"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu (Mobile 390px) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface border-b border-border-custom px-4 py-5 shadow-xl flex flex-col gap-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold text-primary py-2 border-b border-border-custom/50 flex items-center justify-between"
          >
            <span>Trang chủ</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
          <Link
            to="/rooms"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold text-accent py-2 border-b border-border-custom/50 flex items-center justify-between"
          >
            <span>Phòng & Bảng giá</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-text-secondary py-2 border-b border-border-custom/50 flex items-center justify-between"
          >
            <span>Dịch vụ</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
          <Link
            to="/promotions"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-text-secondary py-2 border-b border-border-custom/50 flex items-center justify-between"
          >
            <span>Ưu đãi</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
          <Link
            to="/location"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-text-secondary py-2 border-b border-border-custom/50 flex items-center justify-between"
          >
            <span>Vị trí</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-text-secondary py-2 flex items-center justify-between"
          >
            <span>Liên hệ</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>

          <div className="pt-3 border-t border-border-custom flex items-center justify-between text-xs text-text-secondary">
            <span>Hotline: 024.3828.xxxx</span>
            <span className="font-bold text-primary">Tiếng Việt (VI)</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
