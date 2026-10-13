import { confirmCheckIn } from '../../services/checkInService';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

// ─── Dữ liệu mẫu ─────────────────────────────────────────────────────────────
const MOCK_BOOKINGS = [
  {
    bookingCode: 'SM-482031',
    phone: '0912345678',
    guestName: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    adults: 2, children: 0,
    roomNumber: '101', roomType: 'Standard', floor: 1,
    checkIn: '2026-10-12', checkOut: '2026-10-14', nights: 2,
    totalAmount: 2400000, depositPaid: 720000,
    roomStatus: 'clean',     // 'clean' | 'dirty' | 'cleaning'
    checkinStatus: 'pending', // 'pending' | 'checked_in'
    note: '',
  },
  {
    bookingCode: 'SM-719204',
    phone: '0987654321',
    guestName: 'Trần Thị Bích',
    email: 'bich.tran@email.com',
    adults: 2, children: 1,
    roomNumber: '203', roomType: 'Deluxe Ban Công', floor: 2,
    checkIn: '2026-10-12', checkOut: '2026-10-15', nights: 3,
    totalAmount: 5400000, depositPaid: 1620000,
    roomStatus: 'dirty',
    checkinStatus: 'pending',
    note: 'Yêu cầu tầng cao, giường đôi',
  },
  {
    bookingCode: 'SM-330587',
    phone: '0903111222',
    guestName: 'Lê Minh Khoa',
    email: 'khoa.le@email.com',
    adults: 3, children: 0,
    roomNumber: '305', roomType: 'Premier Suite', floor: 3,
    checkIn: '2026-10-12', checkOut: '2026-10-16', nights: 4,
    totalAmount: 11200000, depositPaid: 3360000,
    roomStatus: 'cleaning',
    checkinStatus: 'pending',
    note: '',
  },
  {
    bookingCode: 'SM-965412',
    phone: '0978333444',
    guestName: 'Hoàng Đức Tài',
    email: 'tai.hoang@email.com',
    adults: 2, children: 2,
    roomNumber: '401', roomType: 'Executive King', floor: 4,
    checkIn: '2026-10-12', checkOut: '2026-10-15', nights: 3,
    totalAmount: 10500000, depositPaid: 3150000,
    roomStatus: 'clean',
    checkinStatus: 'checked_in',
    note: 'VIP - ưu tiên phục vụ',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

const formatDate = (s) => {
  if (!s) return '—';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
};

const ROOM_STATUS_CONFIG = {
  clean:    { label: 'Phòng sạch sẵn sàng', variant: 'success', icon: 'check_circle',    warn: false },
  cleaning: { label: 'Đang dọn dẹp',         variant: 'warning', icon: 'cleaning_services', warn: true  },
  dirty:    { label: 'Phòng chưa dọn',        variant: 'danger',  icon: 'warning',          warn: true  },
};

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard({ booking, onCheckIn, busy }) {
  const rs   = ROOM_STATUS_CONFIG[booking.roomStatus] || ROOM_STATUS_CONFIG.clean;
  const done = booking.checkinStatus === 'checked_in';

  return (
    <div className={`bg-surface rounded-2xl border shadow-sm overflow-hidden transition-all ${
      done ? 'border-emerald-200 opacity-80' : rs.warn ? 'border-amber-200' : 'border-border-custom'
    }`}>
      {/* Top bar */}
      <div className={`h-1 w-full ${done ? 'bg-emerald-500' : rs.warn ? booking.roomStatus === 'dirty' ? 'bg-danger-custom' : 'bg-amber-400' : 'bg-accent'}`} />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-headline text-lg font-bold text-primary">Phòng {booking.roomNumber}</span>
              <Badge variant={done ? 'success' : 'default'} dot>
                {done ? 'Đã check-in' : 'Chờ check-in'}
              </Badge>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">{booking.roomType} · Tầng {booking.floor}</p>
          </div>
          <span className="text-xs font-bold text-accent">{booking.bookingCode}</span>
        </div>

        {/* Cảnh báo phòng chưa dọn */}
        {rs.warn && !done && (
          <div className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold ${
            booking.roomStatus === 'dirty'
              ? 'bg-rose-50 border-rose-200 text-danger-custom'
              : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}>
            <span className="material-symbols-outlined text-[18px] shrink-0">{rs.icon}</span>
            <span>{rs.label} — Cần thông báo cho bộ phận buồng phòng trước khi check-in</span>
          </div>
        )}

        {/* Thông tin khách */}
        <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border-custom/60">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-primary truncate">{booking.guestName}</p>
            <p className="text-[11px] text-text-secondary">{booking.phone} · {booking.email}</p>
            <p className="text-[11px] text-text-secondary">{booking.adults} người lớn{booking.children > 0 ? ` · ${booking.children} trẻ em` : ''}</p>
          </div>
        </div>

        {/* Chi tiết đặt phòng */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { icon: 'login',       label: 'Check-in',  value: formatDate(booking.checkIn)  },
            { icon: 'logout',      label: 'Check-out', value: formatDate(booking.checkOut) },
            { icon: 'nights_stay', label: 'Số đêm',    value: `${booking.nights} đêm`      },
            { icon: 'payments',    label: 'Đã cọc',    value: formatVND(booking.depositPaid) },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex flex-col gap-0.5 p-2.5 bg-surface-alt/50 rounded-xl">
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-text-secondary font-semibold">
                <span className="material-symbols-outlined text-accent text-[13px]">{icon}</span>
                {label}
              </span>
              <span className="font-bold text-primary">{value}</span>
            </div>
          ))}
        </div>

        {/* Ghi chú */}
        {booking.note && (
          <div className="flex items-start gap-2 p-3 bg-accent/5 border border-accent/20 rounded-xl text-xs text-text-secondary">
            <span className="material-symbols-outlined text-accent text-[16px] mt-0.5 shrink-0">edit_note</span>
            <span>{booking.note}</span>
          </div>
        )}

        {/* Trạng thái phòng */}
        <div className="flex items-center justify-between">
          {done ? (
            <Badge variant="success" dot>
              Đang ở
            </Badge>
          ) : (
            <Badge variant={rs.variant} dot>
              {rs.label}
            </Badge>
          )}

          {done && (
            <Badge variant="success" icon="check_circle">
              {booking.actualCheckInTime
                ? `Check-in lúc ${new Date(
                    booking.actualCheckInTime
                  ).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`
                : 'Đã check-in'}
            </Badge>
          )}
        </div>

        {/* Nút xác nhận */}
        {!done && (
          <Button
            variant="secondary"
            size="md"
            fullWidth
            iconLeft={busy ? undefined : 'how_to_reg'}
            isLoading={busy}
            onClick={() => onCheckIn(booking)}
          >
            {busy ? 'Đang xử lý…' : 'Xác nhận Check-in'}
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CheckInPage() {
  useEffect(() => {
    document.title = 'Tiếp Nhận Check-in | Sương Mai Hotel';
  }, []);

  const [bookings, setBookings] = useState(
    import.meta.env.DEV ? MOCK_BOOKINGS : []
  );
  const [query,       setQuery]       = useState('');
  const [busyId,      setBusyId]      = useState(null);
  const [toast,       setToast]       = useState(null);
  const inputRef = useRef(null);

  // Tự focus ô tìm kiếm khi load
  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = bookings.filter((b) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return b.bookingCode.toLowerCase().includes(q) || b.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''));
  });

  const pendingCount    = bookings.filter((b) => b.checkinStatus === 'pending').length;
  const checkedInCount  = bookings.filter((b) => b.checkinStatus === 'checked_in').length;
  const warnCount       = bookings.filter((b) => b.roomStatus !== 'clean' && b.checkinStatus === 'pending').length;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCheckIn = async (booking) => {
    setBusyId(booking.bookingCode);

    try {
      const result = await confirmCheckIn(booking.bookingCode);

      setBookings((prev) =>
        prev.map((b) =>
          b.bookingCode === booking.bookingCode
            ? {
                ...b,
                checkinStatus: 'checked_in',
                usageStatus: result.roomStatus,
                actualCheckInTime: result.checkInTime,
              }
            : b
        )
      );

      showToast(
        result.message ||
          `Check-in thành công! Phòng ${booking.roomNumber}`
      );
    } catch (err) {
      const status = err.response?.status;

      const messages = {
        401: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.',
        403: 'Bạn không có quyền thực hiện check-in.',
        404: 'Không tìm thấy đặt phòng hoặc hồ sơ lễ tân.',
        409: 'Không thể check-in vì phòng chưa sẵn sàng hoặc trạng thái đặt phòng không hợp lệ.',
      };

      showToast(
        err.response?.data?.message ||
          messages[status] ||
          err.message ||
          'Không thể check-in. Vui lòng thử lại.',
        'error'
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-text-on-dark border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-accent text-xs font-bold uppercase tracking-[0.2em]">Sương Mai Hotel</p>
              <h1 className="font-headline text-2xl sm:text-3xl font-bold mt-1">Tiếp Nhận Check-in</h1>
              <p className="text-text-on-dark/70 text-sm mt-2">Tìm đặt phòng và xác nhận check-in cho khách</p>
            </div>
            <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 sm:px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 shrink-0">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="hidden sm:inline">Về trang chủ</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-accent text-[20px]">pending_actions</span>
              <p className="text-xs uppercase tracking-wider text-text-secondary">Chờ check-in</p>
            </div>
            <p className="font-headline text-3xl font-bold text-primary">{pendingCount}</p>
            <p className="text-xs text-text-secondary mt-1">khách đang chờ</p>
          </div>
          <div className="bg-surface rounded-2xl border border-emerald-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">how_to_reg</span>
              <p className="text-xs uppercase tracking-wider text-text-secondary">Đã check-in</p>
            </div>
            <p className="font-headline text-3xl font-bold text-success-custom">{checkedInCount}</p>
            <p className="text-xs text-text-secondary mt-1">khách hôm nay</p>
          </div>
          <div className="bg-surface rounded-2xl border border-amber-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-amber-600 text-[20px]">warning</span>
              <p className="text-xs uppercase tracking-wider text-text-secondary">Phòng cần lưu ý</p>
            </div>
            <p className="font-headline text-3xl font-bold text-amber-600">{warnCount}</p>
            <p className="text-xs text-text-secondary mt-1">phòng chưa sẵn sàng</p>
          </div>
        </div>

        {/* Ô tìm kiếm */}
        <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-5">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-[22px]">search</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Nhập mã đặt phòng (SM-XXXXXX) hoặc số điện thoại khách..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-background border border-border-custom rounded-xl pl-12 pr-10 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>
          {query && (
            <p className="text-xs text-text-secondary mt-2.5">
              Tìm thấy <strong className="text-primary">{filtered.length}</strong> kết quả cho &ldquo;{query}&rdquo;
            </p>
          )}
        </div>

        {/* Danh sách booking */}
        {filtered.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-14 flex flex-col items-center text-center gap-3">
            <span className="material-symbols-outlined text-5xl text-text-secondary/30">search_off</span>
            <h3 className="font-headline text-xl font-bold text-primary">Không tìm thấy đặt phòng</h3>
            <p className="text-text-secondary text-sm max-w-sm">
              Không tìm thấy mã đặt phòng hoặc số điện thoại &ldquo;{query}&rdquo;. Kiểm tra lại thông tin.
            </p>
            <Button variant="outline" size="sm" iconLeft="refresh" onClick={() => setQuery('')}>Xóa tìm kiếm</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                Hiển thị <strong className="text-primary">{filtered.length}</strong> / {bookings.length} đặt phòng hôm nay
              </p>
              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />Chờ check-in</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />Đã check-in</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
              {filtered.map((b) => (
                <BookingCard
                  key={b.bookingCode}
                  booking={b}
                  onCheckIn={handleCheckIn}
                  busy={busyId === b.bookingCode}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Toast notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-semibold transition-all ${
          toast.type === 'error'
            ? 'bg-danger-custom text-white'
            : 'bg-primary text-text-on-dark border border-accent/30'
        }`}>
          <span className="material-symbols-outlined text-[20px]">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
