import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import DatePicker from '../../components/ui/DatePicker';
import { redirectToPayOS } from '../../services/paymentService';
import { getPublicRoomDetail, DEFAULT_ROOM_IMAGE } from '../../services/roomService';
import {
  createBooking,
  createBookingPayment,
  getAuthToken,
  getBookingAttempt,
  getBookingErrorMessage,
  getLocalDate,
  validateBooking,
} from '../../services/bookingService';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

const formatDisplay = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
};

const calcNights = (ci, co) => {
  if (!ci || !co) return 0;
  const diff = (new Date(co) - new Date(ci)) / 86400000;
  return diff > 0 ? Math.round(diff) : 0;
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BookingPage() {
  useEffect(() => {
    document.title = 'Xác Nhận Đặt Phòng | Sương Mai Hotel';
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const roomId   = searchParams.get('roomId')   || '';
  const paramIn  = searchParams.get('checkIn')  || searchParams.get('from_date') || '';
  const paramOut = searchParams.get('checkOut') || searchParams.get('to_date')   || '';

  const today = getLocalDate();
  const tomorrow = getLocalDate(1);

  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);

  useEffect(() => {
    let mounted = true;
    setRoom(null);
    setLoadingRoom(true);
    if (roomId) {
      getPublicRoomDetail(roomId).then((dbRoom) => {
          if (mounted && dbRoom?.id === roomId) {
            const categorySlug =
              dbRoom.categoryId === 'cat-4' ? 'suite' :
              dbRoom.categoryId === 'cat-3' ? 'deluxe' :
              dbRoom.categoryId === 'cat-2' ? 'superior' : 'standard';
                               dbRoom.categoryId === 'cat-3' ? 'deluxe' :
                               dbRoom.categoryId === 'cat-2' ? 'superior' : 'standard';
          setRoom({
            id: dbRoom.id,
            slug: dbRoom.roomCode?.toLowerCase() || dbRoom.id,
            categoryId: dbRoom.categoryId,
            roomCode: dbRoom.roomCode,
            roomNumber: dbRoom.roomNumber,
            name: dbRoom.name,
            nameEn: `${dbRoom.categoryName} Room ${dbRoom.roomNumber}`,
            category: categorySlug,
            floor: `Tầng ${dbRoom.floor}`,
            // DANH SÁCH ẢNH THỰC TẾ TỪ BẢNG phong_hinh_anh
            images: dbRoom.images && dbRoom.images.length > 0 ? dbRoom.images.map((img) => ({
              url: img.url,
              caption: img.caption || `Ảnh phòng ${dbRoom.roomNumber}`
            })) : [
              { url: dbRoom.primaryImageUrl, caption: `Ảnh phòng ${dbRoom.roomNumber}` }
            ],
            specs: {
              area: dbRoom.categoryId === 'cat-4' ? 65 : dbRoom.categoryId === 'cat-3' ? 45 : 32,
              bed: dbRoom.maxCapacity >= 4 ? '2 King Lớn' : '1 King (1.8m x 2m)',
              guests: dbRoom.maxCapacity || 2,
            },
            pricing: {
              originalPrice: Number(dbRoom.originalPrice) || 1500000,
              price: Number(dbRoom.price) || 1200000,
              discountPercent: dbRoom.discountPercent || 20,
              depositPercent: 30,
            },
            policies: {
              deposit: 'Đặt cọc để giữ phòng ngay',
            }
          });
        }
      }).catch((err) => {
        console.warn('Lỗi lấy thông tin phòng đặt từ database:', err);
      }).finally(() => {
        if (mounted) setLoadingRoom(false);
      });
    } else {
      setLoadingRoom(false);
    }
    return () => { mounted = false; };
  }, [roomId]);

  // Form state
  const [checkIn,  setCheckIn]  = useState(paramIn  || today);
  const [checkOut, setCheckOut] = useState(paramOut || tomorrow);
  const [adults,   setAdults]   = useState(2);
  const [children, setChildren] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [phone,     setPhone]     = useState('');
  const [email,     setEmail]     = useState('');
  const [note,      setNote]      = useState('');
  const [errors,    setErrors]    = useState({});
  const [busy,      setBusy]      = useState(false);

  const submitting = useRef(false);
  const [outcomeUnknown, setOutcomeUnknown] = useState(false);
  const [authRejected, setAuthRejected] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [bookingConflict, setBookingConflict] = useState(false);

  useEffect(() => {
    if (submitting.current) return;
    const initialIn = paramIn || today;
    const initialOut = paramOut || tomorrow;
    const attempt = getBookingAttempt({ roomId, checkIn: initialIn, checkOut: initialOut });
    const saved = attempt?.status === 'created' ? attempt.data : null;
    setCheckIn(initialIn);
    setCheckOut(initialOut);
    setCreatedBooking(saved ? { data: saved } : null);
    setOutcomeUnknown(Boolean(attempt && !saved));
    setBookingConflict(false);
    setErrors(attempt && !saved ? { submit: getBookingErrorMessage({}) } : {});
    setGuestName(attempt?.payload?.guestName || '');
    setPhone(attempt?.payload?.phone || '');
    setEmail(attempt?.payload?.email || '');
    setAdults(attempt?.guestCounts?.adults ?? attempt?.payload?.guestCount ?? 2);
    setChildren(attempt?.guestCounts?.children ?? 0);
  }, [roomId, paramIn, paramOut, today, tomorrow]);

  // Tính giá
  const nights       = calcNights(checkIn, checkOut);
  const pricePerNight = room?.pricing?.price || 1200000;
  const subtotal      = createdBooking ? Number(createdBooking.data.estimatedTotal) : pricePerNight * Math.max(nights, 1);
  const depositPct    = room?.pricing?.depositPercent || 30;
  const deposit       = createdBooking ? Number(createdBooking.data.requiredDeposit) : Math.round((subtotal * depositPct) / 100);
  const remaining     = subtotal - deposit;

  // Weekend surcharge
  const weekendSurcharge = room?.pricing?.weekendSurcharge || 0;

  const bookingPayload = {
    roomId, checkIn, checkOut,
    guestCount: Number(adults) + Number(children),
    guestName: guestName.trim(), phone: phone.trim(), email: email.trim(),
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (submitting.current || outcomeUnknown) return;
    const fieldErrors = validateBooking(bookingPayload, room?.specs.guests);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;
    if (!getAuthToken() || authRejected) {
      navigate(`/dang-nhap?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    if (!room || loadingRoom || room.id !== roomId) {
      setErrors({ submit: 'Thông tin phòng chưa khớp phòng được chọn. Vui lòng tải lại trang.' });
      return;
    }
    submitting.current = true;
    setBusy(true);
    setBookingConflict(false);
    let saved;
    try {
      const request = createBooking(bookingPayload, { adults, children });
      // Keep attempted dates in the URL so reload restores the same request.
      if (paramIn !== checkIn || paramOut !== checkOut) {
        const params = new URLSearchParams(searchParams);
        params.set('checkIn', checkIn);
        params.set('checkOut', checkOut);
        setSearchParams(params, { replace: true });
      }
      saved = await request;
      setCreatedBooking({ data: saved });
      const payment = await createBookingPayment(saved, bookingPayload);
      redirectToPayOS(payment.checkoutUrl);
    } catch (error) {
      const status = error.response?.status;
      setAuthRejected(status === 401 || status === 403);
      setBookingConflict(!saved && status === 409);
      if (saved) {
        const reason = error.response?.data?.message || error.message || 'Không thể kết nối thanh toán';
        setErrors({ submit: `Đã tạo đơn ${saved.bookingCode}; chưa xác nhận thanh toán cọc. Không mở được PayOS: ${reason}. Bấm Tiếp tục thanh toán để thử lại cho cùng mã.` });
      } else {
        setOutcomeUnknown(['BOOKING_OUTCOME_UNKNOWN', 'BOOKING_RESPONSE_INVALID', 'BOOKING_ATTEMPT_CHANGED'].includes(error.code));
        setErrors({ ...error.response?.data?.errors, submit: getBookingErrorMessage(error) });
      }
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        {loadingRoom ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
            <p className="text-sm text-text-secondary font-medium">Đang tải thông tin phòng từ hệ thống...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 max-w-md bg-surface p-8 rounded-2xl border border-border-custom shadow-md">
            <span className="material-symbols-outlined text-[48px] text-accent">search_off</span>
            <h2 className="font-headline text-xl font-bold text-primary">Không tìm thấy phòng đặt</h2>
            <p className="text-xs text-text-secondary">Mã phòng này không tồn tại hoặc đã được cập nhật. Vui lòng chọn một phòng khác trong danh mục.</p>
            <Button variant="primary" fullWidth onClick={() => navigate('/rooms')}>
              Xem danh sách phòng nghỉ
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border-custom bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-text-secondary">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link to="/rooms" className="hover:text-primary transition-colors">Phòng nghỉ</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="font-semibold text-primary">Xác nhận đặt phòng</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <p className="text-accent text-xs font-bold uppercase tracking-[0.2em]">Sương Mai Hotel</p>
          <h1 className="font-headline text-3xl font-bold text-primary mt-1">Tóm Tắt & Xác Nhận Đặt Phòng</h1>
          <p className="text-text-secondary text-sm mt-1">Kiểm tra thông tin và hoàn tất đặt phòng của bạn.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

            {/* ── LEFT COLUMN ── */}
            <fieldset disabled={busy || Boolean(createdBooking) || outcomeUnknown} className="space-y-6 min-w-0">

              {/* Ảnh & thông tin phòng */}
              <section className="bg-surface rounded-2xl border border-border-custom shadow-sm overflow-hidden">
                <div className="relative h-52 sm:h-64">
                  <img
                    src={room.images[0]?.url || DEFAULT_ROOM_IMAGE}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_ROOM_IMAGE;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <Badge variant="goldSolid" className="mb-2">
                      {room.category === 'suite' || room.category === 'president' ? 'Presidential Suite' : (room.category ? room.category.charAt(0).toUpperCase() + room.category.slice(1) : 'Standard')}
                    </Badge>
                    <h2 className="font-headline text-xl sm:text-2xl font-bold text-white">{room.name}</h2>
                    <p className="text-white/70 text-xs mt-1">{room.floor} · {room.specs.area} m² · {room.specs.bed}</p>
                  </div>
                </div>

                {/* Thông tin lưu trú */}
                <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: 'login',  label: 'Nhận phòng',  value: formatDisplay(checkIn) },
                    { icon: 'logout', label: 'Trả phòng',   value: formatDisplay(checkOut) },
                    { icon: 'nights_stay', label: 'Số đêm', value: nights > 0 ? `${nights} đêm` : '—' },
                    { icon: 'group',  label: 'Số khách',    value: `${adults} người lớn${children > 0 ? ` · ${children} trẻ em` : ''}` },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-text-secondary font-semibold">
                        <span className="material-symbols-outlined text-accent text-[14px]">{icon}</span>
                        {label}
                      </span>
                      <span className="text-sm font-bold text-primary">{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Chọn ngày & số khách */}
              <section className="bg-surface rounded-2xl border border-border-custom shadow-sm p-5">
                <h3 className="font-headline text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent text-[20px]">calendar_month</span>
                  Điều chỉnh thời gian lưu trú
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <DatePicker
                    label="Ngày nhận phòng"
                    id="check-in"
                    value={checkIn}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      setErrors((p) => ({ ...p, checkIn: '' }));
                    }}
                    min={today}
                    required
                    error={errors.checkIn}
                    helperText={checkIn ? formatDisplay(checkIn) : ''}
                  />
                  <DatePicker
                    label="Ngày trả phòng"
                    id="check-out"
                    value={checkOut}
                    onChange={(e) => {
                      setCheckOut(e.target.value);
                      setErrors((p) => ({ ...p, checkOut: '' }));
                    }}
                    min={checkIn || tomorrow}
                    required
                    error={errors.checkOut}
                    helperText={checkOut ? formatDisplay(checkOut) : ''}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-text-secondary font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-accent text-[17px]">person</span>
                      Người lớn
                    </label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="bg-white border border-border-custom rounded-xl px-3.5 py-2.5 text-sm text-text-primary font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>{n} người lớn</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-text-secondary font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-accent text-[17px]">child_care</span>
                      Trẻ em (dưới 12t)
                    </label>
                    <select
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="bg-white border border-border-custom rounded-xl px-3.5 py-2.5 text-sm text-text-primary font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    >
                      {[0, 1, 2].map((n) => (
                        <option key={n} value={n}>{n} trẻ em</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {errors.guestCount && <p role="alert" className="text-sm text-red-800">{errors.guestCount}</p>}

              {/* Form thông tin khách */}
              <section className="bg-surface rounded-2xl border border-border-custom shadow-sm p-5">
                <h3 className="font-headline text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent text-[20px]">person_edit</span>
                  Thông tin khách lưu trú
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Họ và tên người đặt"
                    id="guest-name"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={guestName}
                    onChange={(e) => { setGuestName(e.target.value); setErrors((p) => ({ ...p, guestName: '' })); }}
                    error={errors.guestName}
                    icon="badge"
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Số điện thoại di động"
                      id="phone"
                      placeholder="0912 xxx xxx"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: '' })); }}
                      error={errors.phone}
                      icon="call"
                      required
                    />
                    <Input
                      label="Địa chỉ email"
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                      error={errors.email}
                      icon="mail"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="note" className="text-[11px] uppercase tracking-wider text-text-secondary font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-accent text-[17px]">edit_note</span>
                      Ghi chú phòng (tùy chọn)
                    </label>
                    <textarea
                      id="note"
                      rows={3}
                      placeholder="Ví dụ: Tầng cao, nhận phòng sớm, cần giường phụ..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full bg-white border border-border-custom rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Chính sách */}
              <section className="bg-surface rounded-2xl border border-border-custom shadow-sm p-5">
                <h3 className="font-headline text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent text-[20px]">policy</span>
                  Chính sách lưu trú
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { icon: 'login',    label: 'Nhận phòng từ',     value: room.policies.checkIn },
                    { icon: 'logout',   label: 'Trả phòng trước',   value: room.policies.checkOut },
                    { icon: 'cancel',   label: 'Hủy đặt phòng',     value: room.policies.cancellation },
                    { icon: 'payments', label: 'Chính sách cọc',    value: room.policies.deposit },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex gap-2.5 p-3 bg-background rounded-xl border border-border-custom/60">
                      <span className="material-symbols-outlined text-accent text-[18px] shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <p className="font-bold text-text-secondary uppercase tracking-wide text-[10px]">{label}</p>
                        <p className="text-text-primary mt-0.5 leading-5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </fieldset>

            {/* ── RIGHT COLUMN — Bảng giá & CTA ── */}
            <div className="space-y-4">
              <div className="lg:sticky lg:top-6">

                {/* Bảng chi tiết tiền */}
                <section className="bg-surface rounded-2xl border border-border-custom shadow-sm p-5 mb-4">
                  <h3 className="font-headline text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent text-[20px]">receipt_long</span>
                    Chi tiết thanh toán
                  </h3>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-text-secondary">
                      <span>{createdBooking ? `Tiền phòng theo đơn (${nights} đêm)` : `${formatVND(pricePerNight)} × ${Math.max(nights, 1)} đêm`}</span>
                      <span className="font-semibold text-primary">{formatVND(subtotal)}</span>
                    </div>
                    {weekendSurcharge > 0 && (
                      <div className="flex justify-between text-text-secondary">
                        <span>Phụ thu cuối tuần</span>
                        <span className="font-semibold text-primary">+{formatVND(weekendSurcharge)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-text-secondary">
                      <span>Phí dọn phòng</span>
                      <span className="font-semibold text-success-custom">Miễn phí</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Bữa sáng Buffet</span>
                      <span className="font-semibold text-success-custom">Đã bao gồm</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Thuế VAT</span>
                      <span className="font-semibold text-success-custom">Đã bao gồm</span>
                    </div>

                    <div className="border-t border-border-custom pt-2.5 flex justify-between">
                      <span className="font-bold text-primary">Tổng tạm tính</span>
                      <span className="font-headline text-lg font-bold text-primary">{formatVND(subtotal)}</span>
                    </div>
                  </div>

                  {/* Cọc */}
                  <div className="mt-4 rounded-xl bg-accent/10 border border-accent/30 p-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-primary uppercase tracking-wide">Tiền cọc cần đặt trước ({depositPct}%)</span>
                      <span className="font-headline text-xl font-bold text-accent">{formatVND(deposit)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary">Còn lại thanh toán khi nhận phòng</span>
                      <span className="text-sm font-semibold text-text-secondary">{formatVND(remaining)}</span>
                    </div>
                  </div>
                </section>

                {/* Đặc quyền */}
                {room.pricing.perks?.length > 0 && (
                  <section className="bg-surface rounded-2xl border border-border-custom shadow-sm p-5 mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-accent text-[18px]">star</span>
                      Đặc quyền đi kèm
                    </h3>
                    <ul className="space-y-2">
                      {room.pricing.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2 text-xs text-text-secondary">
                          <span className="material-symbols-outlined text-success-custom text-[15px] mt-0.5 shrink-0">check_circle</span>
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {createdBooking && <p role="status" className="mb-3 text-sm text-primary">Đã tạo đơn <strong>{createdBooking.data.bookingCode}</strong>. Tiếp tục thanh toán cọc cho đơn này.</p>}
                {/* API errors are not successful bookings. */}
                {errors.submit && (
                  <div role="alert" className="mb-3 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                    {errors.submit}
                    {bookingConflict && (
                      <Link className="ml-2 font-semibold underline" to={`/rooms/available?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`}>
                        Tìm phòng khác
                      </Link>
                    )}
                  </div>
                )}
                {(!getAuthToken() || authRejected) && (
                  <div className="mb-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
                    Vui lòng <Link className="font-semibold underline" to={`/dang-nhap?next=${encodeURIComponent(window.location.pathname + window.location.search)}`}>đăng nhập</Link> hoặc <Link className="font-semibold underline" to={`/dang-ky?next=${encodeURIComponent(window.location.pathname + window.location.search)}`}>đăng ký</Link> trước khi đặt phòng.
                  </div>
                )}
                {/* CTA button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={busy}
                  isDisabled={outcomeUnknown || loadingRoom || room.id !== roomId}
                >
                  {busy ? 'Đang xử lý…' : createdBooking ? 'Tiếp tục thanh toán' : 'Xác nhận đặt'}
                </Button>

                <p className="text-center text-[10px] text-text-secondary mt-3 leading-5">
                  Bằng cách nhấn xác nhận, bạn đồng ý với{' '}
                  <Link to="/" className="text-accent hover:underline">chính sách đặt phòng</Link>{' '}
                  của Sương Mai Hotel.
                </p>
              </div>
            </div>

          </div>
        </form>
      </main>

    </div>
  );
}
