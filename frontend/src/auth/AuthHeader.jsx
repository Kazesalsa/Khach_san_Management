import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import logo from "../assets/auth/logo.png";

const links = [
  { label: "Trang chủ", to: "/", end: true },
  { label: "Phòng & Bảng giá", to: "/rooms" },
  { label: "Dịch vụ", to: "/services" },
  { label: "Ưu đãi", to: "/promotions" },
  { label: "Vị trí", to: "/location" },
  { label: "Liên hệ", to: "/contact" },
];

export default function AuthHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20 border-b border-border-custom bg-background/95 shadow-[0_1px_12px_rgba(19,42,58,0.06)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1360px] items-center justify-between gap-6 px-4 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Sương Mai Hotel">
          <img
            src={logo}
            alt="Logo Sương Mai Hotel"
            className="size-10 rounded-full border border-border-custom object-cover"
          />
          <div className="flex flex-col">
            <span className="font-headline text-xl font-bold leading-none tracking-tight text-primary transition-colors hover:text-accent">
              Sương Mai Hotel
            </span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-text-secondary">
              Indochine Elegance & Hospitality
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 xl:flex" aria-label="Điều hướng chính">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative py-1 text-sm font-medium transition-colors ${
                  isActive
                    ? "font-bold text-primary after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-accent after:content-['']"
                    : "text-text-secondary hover:text-primary"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/rooms"
            className="hidden items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-semibold tracking-wide text-primary shadow-md transition-all hover:bg-accent-hover hover:shadow-lg sm:flex"
          >
            Đặt phòng ngay <ArrowUpRight size={16} />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="auth-mobile-nav"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            className="grid size-10 place-items-center rounded-lg border border-border-custom bg-surface text-primary xl:hidden"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="auth-mobile-nav"
          aria-label="Điều hướng di động"
          className="grid border-t border-border-custom bg-surface px-4 py-4 shadow-lg xl:hidden"
        >
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-alt hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/rooms"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-lg bg-accent px-3 py-3 text-center text-sm font-semibold text-primary transition-colors hover:bg-accent-hover"
          >
            Đặt phòng ngay
          </Link>
        </nav>
      )}
    </header>
  );
}
