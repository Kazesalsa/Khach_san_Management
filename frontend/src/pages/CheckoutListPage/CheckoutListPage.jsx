import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import InvoiceModal from '../../components/Invoice/InvoiceModal';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

const formatDate = (s) => {
  if (!s) return '—';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const todayStr = new Date().toISOString().split('T')[0];

const getDaysLeft = (checkOut) =>
  Math.round((new Date(checkOut) - new Date(todayStr)) / 86400000);

// ─── Checkout Popup ───────────────────────────────────────────────────────────
function CheckoutModal({ room, onClose, onConfirmed }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  if (!room) return null;

  const remaining = room.totalAmount - room.depositPaid;
  const hasUnpaid = room.paymentStatus === 'unpaid' && remaining > 0;
  const daysLeft  = getDaysLeft(room.checkOut);

  const handleConfirm = async () => {
    setBusy(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      await axios.post(
        `/api/bookings/${room.bookingCode}/checkout`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setDone(true);
      setTimeout(() => {
        onConfirmed(room.id);
        onClose();
      }, 1800);

      } catch (err) {
        setError(
          err.response?.data?.message ||
          `Lỗi từ máy chủ (${err.response?.status || 'kết nối'}). Vui lòng thử lại.`
        );
        setBusy(false);
      }
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-primary-dark/80 backdrop-blur-sm"
      />

      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 14 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-surface rounded-2xl border border-border-custom shadow-2xl z-10 my-8 overflow-hidden"
      >
        {/* Top bar màu */}
        <div className={`h-1.5 w-full ${hasUnpaid ? 'bg-amber-400' : 'bg-emerald-500'}`} />

        {done ? (
          /* ── Success state ── */
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px] text-emerald-700">check_circle</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-primary mb-2">Trả phòng thành công!</h3>
            <p className="text-sm text-text-secondary mb-1">
              Phòng <strong className="text-primary">{room.roomNumber}</strong> · {room.bookingCode}
            </p>
            <p className="text-sm text-text-secondary">
              Cảm ơn <strong className="text-primary">{room.guestName}</strong> đã lưu trú tại Sương Mai Hotel.
            </p>
          </div>
        ) : (
          /* ── Confirm form ── */
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-border-custom flex items-start justify-between gap-4 bg-background/50">
              <div>
                <h3 className="font-headline text-xl font-bold text-primary">Xác Nhận Trả Phòng</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Phòng {room.roomNumber} · {room.bookingCode}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-surface-alt hover:bg-border-custom flex items-center justify-center text-text-secondary hover:text-primary transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Thông tin khách */}
              <div className="flex items-center gap-3 p-3.5 bg-background rounded-xl border border-border-custom">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                </div>
                <div>
                  <p className="font-bold text-primary">{room.guestName}</p>
                  <p className="text-xs text-text-secondary">{room.phone} · {room.roomType} · Tầng {room.floor}</p>
                </div>
                <Badge variant={room.paymentStatus === 'paid' ? 'success' : 'warning'} dot className="ml-auto shrink-0">
                  {room.paymentStatus === 'paid' ? 'Đã TT' : 'Chưa TT'}
                </Badge>
              </div>

              {/* Chi tiết lưu trú */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { icon: 'login',       label: 'Nhận phòng', value: formatDate(room.checkIn) },
                  { icon: 'logout',      label: 'Trả phòng',  value: formatDate(room.checkOut) },
                  { icon: 'nights_stay', label: 'Số đêm',     value: `${room.nights} đêm` },
                  { icon: 'group',       label: 'Số khách',   value: `${room.adults} NL${room.children > 0 ? ` · ${room.children} TE` : ''}` },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5 p-3 bg-surface-alt/50 rounded-xl">
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-text-secondary font-semibold">
                      <span className="material-symbols-outlined text-accent text-[13px]">{icon}</span>
                      {label}
                    </span>
                    <span className={`font-bold ${label === 'Trả phòng' && daysLeft <= 0 ? 'text-danger-custom' : 'text-primary'}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bảng tiền */}
              <div className="bg-background rounded-xl border border-border-custom p-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Tổng tiền phòng</span>
                  <span className="font-semibold text-primary">{formatVND(room.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Đã thanh toán cọc</span>
                  <span className="font-semibold text-success-custom">{formatVND(room.depositPaid)}</span>
                </div>
                <div className={`flex justify-between border-t border-border-custom pt-2.5 font-bold ${hasUnpaid ? 'text-amber-600' : 'text-success-custom'}`}>
                  <span>{hasUnpaid ? 'Còn phải thu' : 'Đã thanh toán đủ'}</span>
                  <span>{hasUnpaid ? formatVND(remaining) : '✓ Hoàn tất'}</span>
                </div>
              </div>

              {/* Cảnh báo chưa thanh toán */}
              {hasUnpaid && (
                <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  <span className="material-symbols-outlined text-amber-500 text-[20px] shrink-0 mt-0.5">warning</span>
                  <div>
                    <p className="font-bold mb-0.5">Khách chưa thanh toán đủ</p>
                    <p>Còn <strong>{formatVND(remaining)}</strong> chưa được thu. Vui lòng thu tiền trước khi xác nhận trả phòng.</p>
                  </div>
                </div>
              )}

              {/* Lỗi API */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-danger-custom">
                  <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-1">
                <Button variant="outline" size="md" onClick={onClose} className="flex-1">
                  Hủy
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  iconLeft={busy ? undefined : 'logout'}
                  isLoading={busy}
                  isDisabled={hasUnpaid}
                  onClick={handleConfirm}
                  className="flex-1"
                >
                  {busy ? 'Đang xử lý…' : 'Xác nhận trả phòng'}
                </Button>
              </div>

              {hasUnpaid && (
                <p className="text-center text-[11px] text-amber-600 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  Nút bị khóa vì còn khoản phí chưa thanh toán
                </p>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ─── Room Card ────────────────────────────────────────────────────────────────
function RoomCard({ room, onOpenCheckout, onOpenInvoice }) {
  const daysLeft  = getDaysLeft(room.checkOut);
  const remaining = room.totalAmount - room.depositPaid;

  return (
    <div
      className={`bg-surface rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md cursor-pointer group ${
        room.paymentStatus === 'paid' ? 'border-emerald-200 hover:border-emerald-400' : 'border-amber-200 hover:border-amber-400'
      }`}
      onClick={() => onOpenCheckout(room)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpenCheckout(room)}
      aria-label={`Xem chi tiết phòng ${room.roomNumber}`}
    >
      <div className={`h-1 w-full ${room.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-amber-400'}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline text-2xl font-bold text-primary group-hover:text-accent transition-colors">
                Phòng {room.roomNumber}
              </span>
              <Badge variant={room.paymentStatus === 'paid' ? 'success' : 'warning'} dot>
                {room.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </Badge>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">{room.roomType} · Tầng {room.floor}</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 ${
            daysLeft <= 0 ? 'bg-danger-custom/10 text-danger-custom'
            : daysLeft <= 2 ? 'bg-amber-50 text-amber-700'
            : 'bg-surface-alt text-text-secondary'
          }`}>
            {daysLeft < 0
              ? `Quá hạn ${Math.abs(daysLeft)} ngày`
              : daysLeft === 0
                ? 'Trả phòng hôm nay'
                : `Còn ${daysLeft} ngày`}
          </span>
        </div>

        {/* Thông tin khách */}
        <div className="flex items-center gap-2.5 mb-3 p-3 bg-background rounded-xl border border-border-custom/60">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-[18px]">person</span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-primary text-sm truncate">{room.guestName}</p>
            <p className="text-[11px] text-text-secondary">
              {room.phone} · {room.adults} NL{room.children > 0 ? ` · ${room.children} TE` : ''}
            </p>
          </div>
        </div>

        {/* Thông tin booking */}
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
          {room.paymentStatus === 'unpaid' ? (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-amber-600 font-semibold">Còn phải thu</p>
              <p className="font-bold text-amber-700">{formatVND(remaining)}</p>
            </div>
          ) : (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-success-custom font-semibold">Đã thanh toán</p>
              <p className="font-bold text-success-custom">{formatVND(room.depositPaid)}</p>
            </div>
          )}
        </div>

        {/* Hint click */}
        <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="outline" size="sm" iconLeft="receipt_long" className="flex-1"
            onClick={(e) => { e.stopPropagation(); onOpenInvoice(room); }}>
            Hóa đơn
          </Button>
          <Button
            variant="secondary" size="sm" iconLeft="logout" className="flex-1"
            onClick={(e) => { e.stopPropagation(); onOpenCheckout(room); }}>
            Trả phòng
          </Button>
        </div>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-text-secondary group-hover:text-accent transition-colors">
          <span className="material-symbols-outlined text-[15px]">touch_app</span>
          Bấm thẻ để xác nhận trả phòng
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CheckoutListPage() {
  useEffect(() => {
    document.title = 'Danh Sách Phòng Cần Trả | Sương Mai Hotel';
  }, []);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchNotice, setFetchNotice] = useState('');
  const [search,       setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFloor,  setFilterFloor]  = useState('all');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal,    setShowModal]    = useState(false);
  const [invoiceRoom,  setInvoiceRoom]  = useState(null);
  const [showInvoice,  setShowInvoice]  = useState(false);

  // Lấy danh sách phòng đang có khách từ Backend
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setFetchNotice('');

    try {
      const token =
        localStorage.getItem('authToken') ||
        sessionStorage.getItem('authToken');

      if (!token) {
        setRooms([]);
        setFetchNotice(
          'Vui lòng đăng nhập để xem danh sách phòng đang có khách.'
        );
        return;
      }

      const response = await axios.get('/api/checkout/rooms', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!Array.isArray(response.data)) {
        throw new Error('Dữ liệu danh sách phòng không hợp lệ.');
      }

      const mappedRooms = response.data.map((item) => {
        const checkIn = item.checkInTime
          ? item.checkInTime.split('T')[0]
          : '';

        const checkOut = item.expectedCheckOutDate || '';

        const nights =
          checkIn && checkOut
            ? Math.max(
                1,
                Math.round(
                  (new Date(checkOut) - new Date(checkIn)) /
                    86400000
                )
              )
            : 1;

        return {
          id: item.bookingDetailId,
          roomNumber: item.roomNumber,
          roomType: item.roomType,
          floor: item.floor,
          bookingCode: item.bookingCode,
          guestName: item.guestName,
          phone: item.phone || '—',
          checkIn,
          checkOut,
          nights,
          totalAmount: Number(item.totalAmount ?? 0),
          depositPaid: Number(item.paidAmount ?? 0),
          paymentStatus: item.paymentStatus,
          adults: item.guestCount ?? 1,
          children: 0,
        };
      });

      setRooms(mappedRooms);
    } catch (err) {
      console.error('Không thể tải danh sách phòng:', err);
      setRooms([]);

      setFetchNotice(
        err.response?.data?.message ||
          err.message ||
          'Không thể tải danh sách phòng đang có khách.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const floors = useMemo(() => [...new Set(rooms.map((r) => r.floor))].sort(), [rooms]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rooms.filter((r) => {
      const matchSearch = !q || r.roomNumber.includes(q) || r.guestName.toLowerCase().includes(q) || r.bookingCode.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || r.paymentStatus === filterStatus;
      const matchFloor  = filterFloor  === 'all' || r.floor === Number(filterFloor);
      return matchSearch && matchStatus && matchFloor;
    });
  }, [rooms, search, filterStatus, filterFloor]);

  const paidCount   = rooms.filter((r) => r.paymentStatus === 'paid').length;
  const unpaidCount = rooms.filter((r) => r.paymentStatus === 'unpaid').length;

  const handleOpenCheckout = useCallback((room) => {
    setSelectedRoom(room);
    setShowModal(true);
  }, []);

  const handleOpenInvoice = useCallback((room) => {
    setInvoiceRoom(room);
    setShowInvoice(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setTimeout(() => setSelectedRoom(null), 300);
  }, []);

  // Đồng bộ danh sách phòng với Backend sau khi Checkout thành công
  const handleCheckedOut = useCallback(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-text-on-dark border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-accent text-xs font-bold uppercase tracking-[0.2em]">Sương Mai Hotel</p>
              <h1 className="font-headline text-2xl sm:text-3xl font-bold mt-1">Danh Sách Phòng Cần Trả</h1>
              <p className="text-text-on-dark/70 text-sm mt-2">
                Bấm vào thẻ phòng để xem chi tiết và xác nhận trả phòng
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 sm:px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="hidden sm:inline">Về trang chủ</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Thông báo lỗi khi lấy danh sách phòng */}
        {fetchNotice && (
          <div
            role="alert"
            className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            <p className="font-semibold">
              Không thể tải danh sách phòng đang có khách
            </p>
            <p className="mt-1">{fetchNotice}</p>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-accent text-[20px]">hotel</span>
              <p className="text-xs uppercase tracking-wider text-text-secondary">Đang có khách</p>
            </div>
            <p className="font-headline text-3xl font-bold text-primary">{rooms.length}</p>
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
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

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
                      ? value === 'paid' ? 'bg-success-custom text-white'
                        : value === 'unpaid' ? 'bg-amber-500 text-white'
                        : 'bg-primary text-text-on-dark'
                      : 'bg-surface text-text-secondary hover:bg-surface-alt'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="bg-background border border-border-custom rounded-xl px-3.5 py-2.5 text-sm text-text-primary font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 shrink-0"
            >
              <option value="all">Tất cả tầng</option>
              {floors.map((f) => <option key={f} value={f}>Tầng {f}</option>)}
            </select>
          </div>

          {search && (
            <p className="text-xs text-text-secondary mt-3">
              Tìm thấy <strong className="text-primary">{filtered.length}</strong> kết quả cho &ldquo;{search}&rdquo;
            </p>
          )}
        </div>

        {/* Danh sách */}
        {filtered.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-14 flex flex-col items-center text-center gap-3">
            <span className="material-symbols-outlined text-5xl text-text-secondary/30">search_off</span>
            <h3 className="font-headline text-xl font-bold text-primary">Không tìm thấy kết quả</h3>
            <p className="text-text-secondary text-sm max-w-sm">Không có phòng nào khớp với bộ lọc hiện tại.</p>
            <Button variant="outline" size="sm" iconLeft="refresh" onClick={() => { setSearch(''); setFilterStatus('all'); setFilterFloor('all'); }}>
              Xóa bộ lọc
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                Hiển thị <strong className="text-primary">{filtered.length}</strong> / {rooms.length} phòng
              </p>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Đã thanh toán
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block ml-2" /> Chưa thanh toán
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((room) => (
                <RoomCard key={room.id} room={room} onOpenCheckout={handleOpenCheckout} onOpenInvoice={handleOpenInvoice} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showModal && (
          <CheckoutModal
            room={selectedRoom}
            onClose={handleCloseModal}
            onConfirmed={handleCheckedOut}
          />
        )}
      </AnimatePresence>

      {/* Invoice Modal */}
      <AnimatePresence>
        {showInvoice && (
          <InvoiceModal
            isOpen={showInvoice}
            onClose={() => { setShowInvoice(false); setTimeout(() => setInvoiceRoom(null), 300); }}
            room={invoiceRoom}
            onPaymentConfirmed={() => {
              fetchRooms();
              setShowInvoice(false);
              setTimeout(() => setInvoiceRoom(null), 300);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
