import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

// ─── Dữ liệu mẫu ─────────────────────────────────────────────────────────────
const OCCUPIED_ROOMS = [
  {
    id: 1,
    roomNumber: '101',
    roomType: 'Standard',
    floor: 1,
    bookingCode: 'SM-482031',
    guestName: 'Nguyễn Văn An',
    phone: '0912 345 678',
    checkIn: '2026-10-08',
    checkOut: '2026-10-12',
    nights: 4,
    totalAmount: 4800000,
    depositPaid: 1440000,
    paymentStatus: 'paid',       // 'paid' | 'unpaid'
    adults: 2,
    children: 0,
  },
  {
    id: 2,
    roomNumber: '203',
    roomType: 'Deluxe Ban Công',
    floor: 2,
    bookingCode: 'SM-719204',
    guestName: 'Trần Thị Bích',
    phone: '0987 654 321',
    checkIn: '2026-10-09',
    checkOut: '2026-10-11',
    nights: 2,
    totalAmount: 3600000,
    depositPaid: 0,
    paymentStatus: 'unpaid',
    adults: 2,
    children: 1,
  },
  {
    id: 3,
    roomNumber: '305',
    roomType: 'Premier Suite',
    floor: 3,
    bookingCode: 'SM-330587',
    guestName: 'Lê Minh Khoa',
    phone: '0903 111 222',
    checkIn: '2026-10-07',
    checkOut: '2026-10-13',
    nights: 6,
    totalAmount: 16800000,
    depositPaid: 5040000,
    paymentStatus: 'paid',
    adults: 3,
    children: 0,
  },
  {
    id: 4,
    roomNumber: '102',
    roomType: 'Standard',
    floor: 1,
    bookingCode: 'SM-204815',
    guestName: 'Phạm Thu Hà',
    phone: '0934 567 890',
    checkIn: '2026-10-10',
    checkOut: '2026-10-12',
    nights: 2,
    totalAmount: 2400000,
    depositPaid: 0,
    paymentStatus: 'unpaid',
    adults: 1,
    children: 0,
  },
  {
    id: 5,
    roomNumber: '401',
    roomType: 'Executive King',
    floor: 4,
    bookingCode: 'SM-965412',
    guestName: 'Hoàng Đức Tài',
    phone: '0978 333 444',
    checkIn: '2026-10-09',
    checkOut: '2026-10-14',
    nights: 5,
    totalAmount: 17500000,
    depositPaid: 5250000,
    paymentStatus: 'paid',
    adults: 2,
    children: 2,
  },
  {
    id: 6,
    roomNumber: '202',
    roomType: 'Deluxe Ban Công',
    floor: 2,
    bookingCode: 'SM-841763',
    guestName: 'Vũ Thanh Liêm',
    phone: '0901 888 999',
    checkIn: '2026-10-10',
    checkOut: '2026-10-13',
    nights: 3,
    totalAmount: 5400000,
    depositPaid: 0,
    paymentStatus: 'unpaid',
    adults: 2,
    children: 0,
  },
  {
    id: 7,
    roomNumber: '502',
    roomType: 'Family Duplex',
    floor: 5,
    bookingCode: 'SM-127934',
    guestName: 'Ngô Thị Mai',
    phone: '0911 222 333',
    checkIn: '2026-10-08',
    checkOut: '2026-10-12',
    nights: 4,
    totalAmount: 16800000,
    depositPaid: 5040000,
    paymentStatus: 'paid',
    adults: 4,
    children: 2,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

const formatDate = (s) => {
  if (!s) return '—';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const todayStr = new Date().toISOString().split('T')[0];

const getDaysLeft = (checkOut) => {
  const diff = Math.round((new Date(checkOut) - new Date(todayStr)) / 86400000);
  return diff;
};

// ─── Room Card ────────────────────────────────────────────────────────────────
function RoomCard({ room }) {
  const daysLeft = getDaysLeft(room.checkOut);
  const remaining = room.totalAmount - room.depositPaid;

  return (
    <div className={`bg-surface rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
      room.paymentStatus === 'paid' ? 'border-emerald-200' : 'border-amber-200'
    }`}>
      {/* Màu top bar theo trạng thái thanh toán */}
      <div className={`h-1 w-full ${room.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-amber-400'}`} />

      <div className="p-5">
        {/* Header: số phòng + badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline text-2xl font-bold text-primary">Phòng {room.roomNumber}</span>
              <Badge variant={room.paymentStatus === 'paid' ? 'success' : 'warning'} dot>
                {room.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </Badge>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">{room.roomType} · Tầng {room.floor}</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
            daysLeft <= 1
              ? 'bg-danger-custom/10 text-danger-custom'
              : daysLeft <= 2
              ? 'bg-amber-50 text-amber-700'
              : 'bg-surface-alt text-text-secondary'
          }`}>
            {daysLeft <= 0 ? 'Trả phòng hôm nay' : `Còn ${daysLeft} ngày`}
          </span>
        </div>

        {/* Thông tin khách */}
        <div className="flex items-center gap-2.5 mb-3 p-3 bg-background rounded-xl border border-border-custom/60">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-[18px]">person</span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-primary text-sm truncate">{room.guestName}</p>
            <p className="text-[11px] text-text-secondary">{room.phone} · {room.adults} người lớn{room.children > 0 ? ` · ${room.children} trẻ em` : ''}</p>
          </div>
        </div>

        {/* Mã đặt phòng + thời gian */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">Mã đặt phòng</span>
            <span className="font-bold text-primary">{room.bookingCode}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">Số đêm</span>
            <span className="font-bold text-primary">{room.nights} đêm</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">Nhận phòng</span>
            <span className="font-semibold text-text-primary">{formatDate(room.checkIn)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">Trả phòng</span>
            <span className={`font-semibold ${daysLeft <= 0 ? 'text-danger-custom' : 'text-text-primary'}`}>
              {formatDate(room.checkOut)}
            </span>
          </div>
        </div>

        {/* Tiền */}
        <div className="border-t border-border-custom/60 pt-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">Tổng tiền</p>
            <p className="font-headline text-base font-bold text-primary">{formatVND(room.totalAmount)}</p>
          </div>
          {room.paymentStatus === 'unpaid' && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-amber-600 font-semibold">Còn phải thu</p>
              <p className="font-bold text-amber-700">{formatVND(remaining)}</p>
            </div>
          )}
          {room.paymentStatus === 'paid' && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-success-custom font-semibold">Đã thanh toán</p>
              <p className="font-bold text-success-custom">{formatVND(room.depositPaid)}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-3 flex gap-2">
          <Button variant="outline" size="sm" iconLeft="receipt_long" className="flex-1">
            Chi tiết
          </Button>
          <Button
            variant={room.paymentStatus === 'unpaid' ? 'primary' : 'secondary'}
            size="sm"
            iconLeft={room.paymentStatus === 'unpaid' ? 'payments' : 'logout'}
            className="flex-1"
          >
            {room.paymentStatus === 'unpaid' ? 'Thu tiền' : 'Trả phòng'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CheckoutListPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'paid' | 'unpaid'
  const [filterFloor, setFilterFloor] = useState('all');

  const floors = useMemo(() => {
    const unique = [...new Set(OCCUPIED_ROOMS.map((r) => r.floor))].sort();
    return unique;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return OCCUPIED_ROOMS.filter((r) => {
      const matchSearch =
        !q ||
        r.roomNumber.includes(q) ||
        r.guestName.toLowerCase().includes(q) ||
        r.bookingCode.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || r.paymentStatus === filterStatus;
      const matchFloor  = filterFloor === 'all'  || r.floor === Number(filterFloor);
      return matchSearch && matchStatus && matchFloor;
    });
  }, [search, filterStatus, filterFloor]);

  const paidCount   = OCCUPIED_ROOMS.filter((r) => r.paymentStatus === 'paid').length;
  const unpaidCount = OCCUPIED_ROOMS.filter((r) => r.paymentStatus === 'unpaid').length;
  const totalRevenue = OCCUPIED_ROOMS.reduce((s, r) => s + r.totalAmount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-text-on-dark border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-accent text-xs font-bold uppercase tracking-[0.2em]">Sương Mai Hotel</p>
              <h1 className="font-headline text-3xl font-bold mt-1">Danh Sách Phòng Cần Trả</h1>
              <p className="text-text-on-dark/70 text-sm mt-2">
                Quản lý các phòng đang có khách lưu trú và trạng thái thanh toán
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Về trang chủ
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-accent text-[20px]">hotel</span>
              <p className="text-xs uppercase tracking-wider text-text-secondary">Đang có khách</p>
            </div>
            <p className="font-headline text-3xl font-bold text-primary">{OCCUPIED_ROOMS.length}</p>
            <p className="text-xs text-text-secondary mt-1">phòng đang hoạt động</p>
          </div>
          <div className="bg-surface rounded-2xl border border-emerald-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
              <p className="text-xs uppercase tracking-wider text-text-secondary">Đã thanh toán</p>
            </div>
            <p className="font-headline text-3xl font-bold text-success-custom">{paidCount}</p>
            <p className="text-xs text-text-secondary mt-1">phòng đã thanh toán đủ</p>
          </div>
          <div className="bg-surface rounded-2xl border border-amber-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-amber-600 text-[20px]">pending</span>
              <p className="text-xs uppercase tracking-wider text-text-secondary">Chưa thanh toán</p>
            </div>
            <p className="font-headline text-3xl font-bold text-amber-600">{unpaidCount}</p>
            <p className="text-xs text-text-secondary mt-1">phòng cần thu tiền</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Thanh tìm kiếm */}
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">search</span>
              <input
                type="text"
                placeholder="Tìm theo số phòng, tên khách hoặc mã đặt phòng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Filter trạng thái */}
            <div className="flex rounded-xl border border-border-custom overflow-hidden text-xs font-semibold shrink-0">
              {[
                { value: 'all',    label: 'Tất cả' },
                { value: 'paid',   label: 'Đã thanh toán' },
                { value: 'unpaid', label: 'Chưa thanh toán' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilterStatus(value)}
                  className={`px-3 py-2.5 transition-colors border-r border-border-custom last:border-r-0 ${
                    filterStatus === value
                      ? value === 'paid'
                        ? 'bg-success-custom text-white'
                        : value === 'unpaid'
                        ? 'bg-amber-500 text-white'
                        : 'bg-primary text-text-on-dark'
                      : 'bg-surface text-text-secondary hover:bg-surface-alt'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Filter tầng */}
            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="bg-background border border-border-custom rounded-xl px-3.5 py-2.5 text-sm text-text-primary font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 shrink-0"
            >
              <option value="all">Tất cả tầng</option>
              {floors.map((f) => (
                <option key={f} value={f}>Tầng {f}</option>
              ))}
            </select>
          </div>

          {/* Kết quả tìm kiếm */}
          {search && (
            <p className="text-xs text-text-secondary mt-3">
              Tìm thấy <strong className="text-primary">{filtered.length}</strong> kết quả cho &ldquo;{search}&rdquo;
            </p>
          )}
        </div>

        {/* Danh sách phòng */}
        {filtered.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-14 flex flex-col items-center text-center gap-3">
            <span className="material-symbols-outlined text-5xl text-text-secondary/30">search_off</span>
            <h3 className="font-headline text-xl font-bold text-primary">Không tìm thấy kết quả</h3>
            <p className="text-text-secondary text-sm max-w-sm">
              Không có phòng nào khớp với bộ lọc hiện tại. Thử tìm kiếm với từ khóa khác.
            </p>
            <Button variant="outline" size="sm" iconLeft="refresh" onClick={() => { setSearch(''); setFilterStatus('all'); setFilterFloor('all'); }}>
              Xóa bộ lọc
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                Hiển thị <strong className="text-primary">{filtered.length}</strong> / {OCCUPIED_ROOMS.length} phòng
              </p>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                Đã thanh toán
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block ml-2" />
                Chưa thanh toán
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
