import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const getStoredUser = () => {
  try {
    const localUser = localStorage.getItem('authUser');
    const sessionUser = sessionStorage.getItem('authUser');

    return JSON.parse(localUser || sessionUser || 'null');
  } catch {
    return null;
  }
};

const roleLabels = {
  CHU_KHACH_SAN: 'Chủ khách sạn',
  LE_TAN: 'Lễ tân',
  NHAN_VIEN_BUONG: 'Nhân viên buồng',
  KHACH_HANG: 'Khách hàng',
};

const dashboardPaths = {
  CHU_KHACH_SAN: '/admin/price-lists',
  NHAN_VIEN_BUONG: '/admin/housekeeping',
};

const Header = () => {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [user, setUser] = useState(() => getStoredUser());
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [logoutNotice, setLogoutNotice] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');

    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authUser');

    setUser(null);
    setAccountMenuOpen(false);
    setLogoutConfirmOpen(false);

    navigate('/');

    setLogoutNotice(true);

    setTimeout(() => {
      setLogoutNotice(false);
    }, 2500);
  };

  return (
    <>
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
                    ? "text-primary font-bold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-accent"
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
                    ? "text-primary font-bold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-accent"
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
                    ? "text-primary font-bold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-accent"
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
                    ? "text-primary font-bold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-accent"
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
                    ? "text-primary font-bold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-accent"
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
                    ? "text-primary font-bold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-accent"
                    : 'text-text-secondary hover:text-primary'
                }`
              }
            >
              Liên hệ
            </NavLink>
          </nav>

          {/* Action Controls & Contact */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">

            {/* Language */}
            <div className="hidden 2xl:flex items-center gap-1.5 text-text-secondary hover:text-text-primary cursor-pointer bg-surface border border-border-custom px-2.5 py-1 rounded-full text-xs">
              <span className="font-semibold text-primary uppercase">
                🇻🇳 VI
              </span>

              <span className="text-border-custom font-normal">/</span>

              <span className="text-text-secondary hover:text-text-primary uppercase">
                EN
              </span>
            </div>

            {/* Hotline */}
            <a
              className="hidden lg:flex items-center gap-1.5 text-text-secondary hover:text-accent transition-colors group"
              href="tel:02438280000"
            >
              <span className="material-symbols-outlined text-accent text-[18px]">
                call
              </span>

              <span className="text-xs font-semibold group-hover:text-accent">
                024.3828.xxxx
              </span>
            </a>

            {/* Account */}
            <div className="relative hidden sm:block">
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setAccountMenuOpen((open) => !open)
                    }
                    aria-expanded={accountMenuOpen}
                    aria-haspopup="menu"
                    className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-surface px-3.5 py-2 text-xs font-bold text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary hover:text-text-on-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      person
                    </span>

                    <span className="max-w-[140px] truncate">
                      {user.fullName || user.username}
                    </span>

                    <span
                      className={`material-symbols-outlined text-[17px] transition-transform ${
                        accountMenuOpen ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>

                  {accountMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 overflow-hidden rounded-xl border border-border-custom bg-surface shadow-xl"
                    >
                      {/* User info */}
                      <div className="border-b border-border-custom px-4 py-3">
                        <p className="truncate text-sm font-bold text-primary">
                          {user.fullName || user.username}
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                          {roleLabels[user.role] || user.role}
                        </p>
                      </div>

                      {/* Account options */}
                      <div className="border-b border-border-custom py-1">
                        <button
                          type="button"
                          onClick={() =>
                            setAccountMenuOpen(false)
                          }
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-text-primary transition-colors hover:bg-surface-alt hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-[18px] text-text-secondary">
                            account_circle
                          </span>

                          Trang cá nhân
                        </button>

                        {dashboardPaths[user.role] && (
                          <button
                            type="button"
                            onClick={() => {
                              setAccountMenuOpen(false);
                              navigate(dashboardPaths[user.role]);
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-text-primary transition-colors hover:bg-surface-alt hover:text-primary"
                          >
                            <span className="material-symbols-outlined text-[18px] text-text-secondary">
                              dashboard
                            </span>

                            Bảng điều khiển
                          </button>
                        )}
                      </div>

                      {/* Logout */}
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          setLogoutConfirmOpen(true);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-danger-custom transition-colors hover:bg-danger-custom/5"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          logout
                        </span>

                        Đăng xuất
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/dang-nhap"
                  className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-surface px-3.5 py-2 text-xs font-bold text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary hover:text-text-on-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    person
                  </span>

                  <span>Đăng nhập</span>
                </Link>
              )}
            </div>

            {/* Direct Booking CTA */}
            <Link
              to="/rooms"
              className="hidden sm:flex bg-accent text-primary hover:bg-accent-hover font-semibold text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all tracking-wide items-center justify-center shrink-0"
            >
              Đặt phòng ngay
            </Link>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className="xl:hidden w-9 h-9 rounded-lg bg-surface border border-border-custom flex items-center justify-center text-text-primary"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-surface border-b border-border-custom px-4 py-5 shadow-xl flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-primary py-2 border-b border-border-custom/50 flex items-center justify-between"
            >
              <span>Trang chủ</span>

              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>
            </Link>

            <Link
              to="/rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-accent py-2 border-b border-border-custom/50 flex items-center justify-between"
            >
              <span>Phòng & Bảng giá</span>

              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>
            </Link>

            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-text-secondary py-2 border-b border-border-custom/50 flex items-center justify-between"
            >
              <span>Dịch vụ</span>

              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>
            </Link>

            <Link
              to="/promotions"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-text-secondary py-2 border-b border-border-custom/50 flex items-center justify-between"
            >
              <span>Ưu đãi</span>

              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>
            </Link>

            <Link
              to="/location"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-text-secondary py-2 border-b border-border-custom/50 flex items-center justify-between"
            >
              <span>Vị trí</span>

              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-text-secondary py-2 flex items-center justify-between"
            >
              <span>Liên hệ</span>

              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>
            </Link>

            <div className="pt-3 border-t border-border-custom flex items-center justify-between text-xs text-text-secondary">
              <span>Hotline: 024.3828.xxxx</span>

              <span className="font-bold text-primary">
                Tiếng Việt (VI)
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-black/40 px-4 backdrop-blur-[3px]">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-[400px] rounded-2xl border border-border-custom bg-surface p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-danger-custom/10 text-danger-custom">
                <span className="material-symbols-outlined">
                  logout
                </span>
              </div>

              <div>
                <h2
                  id="logout-title"
                  className="text-lg font-bold text-primary"
                >
                  Xác nhận đăng xuất
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Bạn có chắc chắn muốn đăng xuất khỏi tài khoản hiện tại?
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setLogoutConfirmOpen(false)
                }
                className="rounded-lg border border-border-custom bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary transition hover:bg-surface-alt"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-danger-custom px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Success Toast */}
      {logoutNotice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-5 top-24 z-[110] flex items-center gap-2 rounded-xl border border-success-custom/30 bg-surface px-4 py-3 text-sm font-semibold text-success-custom shadow-xl"
        >
          <span className="material-symbols-outlined text-[19px]">
            check_circle
          </span>

          Đăng xuất thành công.
        </div>
      )}
    </>
  );
};

export default Header;