import {
  confirmCheckIn,
  getPendingCheckInBookings,
} from '../../services/checkInService';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

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

const getBookingRoomStatus = (booking) => {
  const rooms = Array.isArray(booking.rooms) ? booking.rooms : [];

  if (rooms.length === 0) return 'dirty';

  if (rooms.some((room) => room.cleaningStatus === 'CHUA_DON')) {
    return 'dirty';
  }

  if (rooms.some((room) => room.cleaningStatus === 'DANG_DON')) {
    return 'cleaning';
  }

  if (rooms.every((room) => room.cleaningStatus === 'DA_DON_XONG')) {
    return 'clean';
  }

  return 'dirty';
};

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard({ booking, onCheckIn, busy, disabled }) {
  const roomStatus = getBookingRoomStatus(booking);
  const rs = ROOM_STATUS_CONFIG[roomStatus];
  const done = booking.bookingStatus === 'DA_NHAN';

  return (
    <div className={`bg-surface rounded-2xl border shadow-sm overflow-hidden transition-all ${
      done ? 'border-emerald-200 opacity-80' : rs.warn ? 'border-amber-200' : 'border-border-custom'
    }`}>
      {/* Top bar */}
      <div className={`h-1 w-full ${done ? 'bg-emerald-500' : rs.warn ? roomStatus === 'dirty' ? 'bg-danger-custom' : 'bg-amber-400' : 'bg-accent'}`} />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-primary">
                Đặt phòng {booking.bookingCode}
              </span>
              <Badge variant={done ? 'success' : 'default'} dot>
                {done ? 'Đã check-in' : 'Chờ check-in'}
              </Badge>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {booking.rooms?.length || 0} phòng trong đặt phòng
            </p>
          </div>
        </div>

        {/* Danh sách phòng thuộc booking */}
        <div className="space-y-2">
          {booking.rooms?.map((room) => (
            <div
              key={room.roomId}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-background border border-border-custom"
            >
              <div>
                <p className="text-sm font-bold text-primary">
                  Phòng {room.roomNumber}
                </p>
                <p className="text-xs text-text-secondary">
                  {room.roomType} · Tầng {room.floor}
                </p>
              </div>

              <Badge
                variant={
                  room.cleaningStatus === 'DA_DON_XONG'
                    ? 'success'
                    : room.cleaningStatus === 'DANG_DON'
                      ? 'warning'
                      : 'danger'
                }
                dot
              >
                {room.cleaningStatus === 'DA_DON_XONG'
                  ? 'Đã dọn xong'
                  : room.cleaningStatus === 'DANG_DON'
                    ? 'Đang dọn'
                    : 'Chưa sẵn sàng'}
              </Badge>
            </div>
          ))}
        </div>

        {/* Cảnh báo phòng chưa dọn */}
        {rs.warn && !done && (
          <div className={`p-3 rounded-xl border text-xs font-semibold ${
            roomStatus === 'dirty'
              ? 'bg-rose-50 border-rose-200 text-danger-custom'
              : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}>
            <span>{rs.label} — Cần thông báo cho bộ phận buồng phòng trước khi check-in</span>
          </div>
        )}

        {/* Thông tin khách */}
        <div className="p-3 bg-background rounded-xl border border-border-custom/60">
          <p className="font-bold text-primary truncate">{booking.guestName}</p>
          <p className="text-xs text-text-secondary mt-0.5">{booking.phone} · {booking.email}</p>
          <p className="text-xs text-text-secondary mt-0.5">
            Tổng số khách:{' '}
            {(booking.rooms ?? []).reduce(
              (total, room) => total + (Number(room.guestCount) || 0),
              0
            )}
          </p>
        </div>

        {/* Chi tiết đặt phòng */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              {
                label: 'Tổng tiền dự kiến',
                value: formatVND(booking.estimatedTotal ?? 0),
              },
              {
                label: 'Tiền cọc yêu cầu',
                value: formatVND(booking.requiredDeposit ?? 0),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col gap-0.5 p-2.5 bg-surface-alt/50 rounded-xl"
              >
                <span className="text-xs text-text-secondary font-medium">
                  {label}
                </span>
                <span className="font-bold text-primary">{value}</span>
              </div>
            ))}
          </div>

          {/* Ngày nhận/trả phòng theo từng phòng */}
          <div className="space-y-2">
            {(booking.rooms ?? []).map((room) => (
              <div
                key={room.roomId}
                className="p-3 bg-surface-alt/50 rounded-xl text-xs space-y-1"
              >
                <p className="font-bold text-primary">
                  Phòng {room.roomNumber}
                </p>
                <p className="text-text-secondary">
                  Nhận phòng: {formatDate(room.checkIn)}
                </p>
                <p className="text-text-secondary">
                  Trả phòng: {formatDate(room.checkOut)}
                </p>
                <p className="text-text-secondary">
                  Số đêm: {room.nights} đêm · {room.guestCount} khách
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ghi chú */}
        {booking.note && (
          <div className="p-3 bg-accent/5 border border-accent/20 rounded-xl text-xs text-text-secondary">
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
            <Badge variant="success">
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
            isLoading={busy}
            isDisabled={disabled || roomStatus !== 'clean' || booking.bookingStatus !== 'DA_DAT'}
            onClick={() => onCheckIn(booking)}
          >
            {busy
              ? 'Đang xử lý…'
              : roomStatus !== 'clean'
                ? 'Phòng chưa sẵn sàng'
                : 'Xác nhận Check-in'}
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

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState('');
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const inputRef = useRef(null);
  const submittingRef = useRef(false);
  const requestIdRef = useRef(0);

  // Tải danh sách và tìm kiếm trên Backend; bỏ qua kết quả request cũ.
  useEffect(() => {
    let active = true;
    const requestId = ++requestIdRef.current;

    setLoadingBookings(true);
    setBookingsError('');

    const timer = setTimeout(async () => {
      try {
        const data = await getPendingCheckInBookings(query);
        if (!active || requestId !== requestIdRef.current) return;
        setBookings(data);
      } catch (err) {
        console.error('Không thể tải booking chờ check-in:', err);
        if (!active || requestId !== requestIdRef.current) return;
        setBookings([]);
        setBookingsError(
          err.response?.data?.message ||
            'Không thể tải danh sách đặt phòng. Vui lòng thử lại sau.'
        );
      } finally {
        if (active && requestId === requestIdRef.current) {
          setLoadingBookings(false);
        }
      }
    }, query.trim() ? 350 : 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, refreshKey]);

  // Tự focus ô tìm kiếm khi load
  useEffect(() => { inputRef.current?.focus(); }, []);

  // API chỉ trả booking DA_DAT, không cung cấp thống kê đã check-in hôm nay.
  const pendingCount = bookings.length;
  const readyCount = bookings.filter((b) => getBookingRoomStatus(b) === 'clean').length;
  const warnCount = bookings.reduce(
    (total, b) => total + (Array.isArray(b.rooms)
      ? b.rooms.filter((room) => room.cleaningStatus !== 'DA_DON_XONG').length
      : 0),
    0
  );

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCheckIn = async (booking) => {
    if (submittingRef.current) return;

    if (booking.bookingStatus !== 'DA_DAT') {
      showToast('Đặt phòng không ở trạng thái chờ check-in.', 'error');
      return;
    }

    if (getBookingRoomStatus(booking) !== 'clean') {
      showToast('Không thể check-in vì có phòng chưa dọn xong.', 'error');
      return;
    }

    submittingRef.current = true;
    setBusyId(booking.bookingCode);

    try {
      const result = await confirmCheckIn(booking.bookingCode);

      // GET pending chỉ chứa DA_DAT; booking đã check-in không còn ở danh sách.
      requestIdRef.current += 1;
      setBookings((prev) => prev.filter((b) => b.bookingCode !== booking.bookingCode));
      setRefreshKey((value) => value + 1);

      showToast(result.message || `Check-in thành công! Đặt phòng ${booking.bookingCode}`);
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
      submittingRef.current = false;
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
              <p className="text-accent text-xs font-semibold">Sương Mai Hotel</p>
              <h1 className="text-2xl sm:text-3xl font-bold mt-1">Tiếp Nhận Check-in</h1>
              <p className="text-text-on-dark/70 text-sm mt-1">Tìm đặt phòng và xác nhận check-in cho khách</p>
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
            <p className="text-xs text-text-secondary font-medium">Chờ check-in</p>
            <p className="text-3xl font-bold text-primary mt-1">{pendingCount}</p>
            <p className="text-xs text-text-secondary mt-1">đặt phòng đang chờ</p>
          </div>
          <div className="bg-surface rounded-2xl border border-emerald-200 shadow-sm p-5">
            <p className="text-xs text-text-secondary font-medium">Sẵn sàng check-in</p>
            <p className="text-3xl font-bold text-success-custom mt-1">{readyCount}</p>
            <p className="text-xs text-text-secondary mt-1">đặt phòng đủ điều kiện</p>
          </div>
          <div className="bg-surface rounded-2xl border border-amber-200 shadow-sm p-5">
            <p className="text-xs text-text-secondary font-medium">Phòng cần lưu ý</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">{warnCount}</p>
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
              placeholder="Nhập mã đặt phòng hoặc số điện thoại khách..."
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
          {query && !loadingBookings && !bookingsError && (
            <p className="text-xs text-text-secondary mt-2.5">
              Tìm thấy <strong className="text-primary">{bookings.length}</strong> kết quả cho &ldquo;{query}&rdquo;
            </p>
          )}
        </div>

        {/* Danh sách booking */}
        {loadingBookings ? (
          <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-14 text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-accent animate-spin inline-block">progress_activity</span>
            <p className="text-sm text-text-secondary">Đang tải danh sách đặt phòng...</p>
          </div>
        ) : bookingsError ? (
          <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-14 flex flex-col items-center text-center gap-3">
            <span className="material-symbols-outlined text-5xl text-danger-custom">error_outline</span>
            <h3 className="font-headline text-xl font-bold text-primary">Không thể tải danh sách đặt phòng</h3>
            <p className="text-text-secondary text-sm max-w-sm">{bookingsError}</p>
            <Button variant="outline" size="sm" iconLeft="refresh" onClick={() => setRefreshKey((value) => value + 1)}>
              Thử lại
            </Button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-14 flex flex-col items-center text-center gap-3">
            <span className="material-symbols-outlined text-5xl text-text-secondary/30">search_off</span>
            <h3 className="font-headline text-xl font-bold text-primary">
              {query.trim() ? 'Không tìm thấy đặt phòng' : 'Chưa có đặt phòng chờ check-in'}
            </h3>
            <p className="text-text-secondary text-sm max-w-sm">
              {query.trim()
                ? <>Không tìm thấy mã đặt phòng hoặc số điện thoại &ldquo;{query}&rdquo;. Kiểm tra lại thông tin.</>
                : 'Hiện không có đặt phòng nào ở trạng thái chờ nhận phòng.'}
            </p>
            {query.trim() ? (
              <Button variant="outline" size="sm" iconLeft="refresh" onClick={() => setQuery('')}>Xóa tìm kiếm</Button>
            ) : (
              <Button variant="outline" size="sm" iconLeft="refresh" onClick={() => setRefreshKey((value) => value + 1)}>Tải lại</Button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                Hiển thị <strong className="text-primary">{bookings.length}</strong> đặt phòng đang chờ check-in
              </p>
              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />Sẵn sàng</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />Cần dọn phòng</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <BookingCard
                  key={b.bookingCode}
                  booking={b}
                  onCheckIn={handleCheckIn}
                  busy={busyId === b.bookingCode}
                  disabled={busyId !== null}
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
