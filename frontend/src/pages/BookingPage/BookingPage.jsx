import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import DatePicker from '../../components/ui/DatePicker';
import { ROOMS_DATA } from '../../data/roomsData';
import { createDepositPayment, redirectToPayOS } from '../../services/paymentService';

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

// ─── Booking Success Modal ────────────────────────────────────────────────────
function BookingSuccessModal({ isOpen, onClose, bookingRef, guestName, email, checkIn, checkOut, nights, depositAmount, roomName }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary-dark/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-surface rounded-2xl border border-border-custom shadow-2xl z-10 my-8 overflow-hidden"
          >
            {/* Accent top bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-accent via-accent-hover to-accent" />

            <div className="p-8 flex flex-col items-center text-center">
              {/* Check icon */}
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[36px] text-emerald-700">check_circle</span>
              </div>

              <Badge variant="gold" className="mb-3">Đặt phòng thành công</Badge>

              <h2 className="font-headline text-2xl font-bold text-primary mb-2">
                Kính chúc quý khách kỳ nghỉ an yên!
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed max-w-sm mb-6">
                Thông tin xác nhận đã được gửi đến{' '}
                <strong className="text-primary">{email}</strong>. Vui lòng kiểm tra hộp thư.
              </p>

              {/* Booking ticket */}
              <div className="w-full bg-surface-alt/60 rounded-xl border border-border-custom p-5 text-left text-xs space-y-3 mb-6">
                <div className="flex justify-between pb-2.5 border-b border-border-custom/50">
                  <span className="text-text-secondary uppercase font-semibold tracking-wide">Mã đặt phòng</span>
                  <span className="font-headline text-base font-bold text-accent">{bookingRef}</span>
                </div>
                <div className="flex justify-between pb-2.5 border-b border-border-custom/50">
                  <span className="text-text-secondary uppercase font-semibold tracking-wide">Hạng phòng</span>
                  <span className="font-bold text-primary">{roomName}</span>
                </div>
                <div className="flex justify-between pb-2.5 border-b border-border-custom/50">
                  <span className="text-text-secondary uppercase font-semibold tracking-wide">Khách lưu trú</span>
                  <span className="font-bold text-primary">{guestName}</span>
                </div>
                <div className="flex justify-between pb-2.5 border-b border-border-custom/50">
                  <span className="text-text-secondary uppercase font-semibold tracking-wide">Thời gian</span>
                  <span className="font-bold text-primary">{formatDisplay(checkIn)} → {formatDisplay(checkOut)} ({nights} đêm)</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-primary font-bold uppercase tracking-wide">Tiền cọc cần thanh toán (30%)</span>
                  <span className="font-headline text-lg font-bold text-accent">{formatVND(depositAmount)}</span>
                </div>
              </div>

              <p className="text-[11px] text-text-secondary mb-5 leading-5">
                Vui lòng thanh toán tiền cọc trong vòng <strong>24 giờ</strong> để giữ phòng.
                Thông tin chuyển khoản đã được gửi qua email.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button variant="secondary" fullWidth onClick={onClose}>
                  Về trang chủ
                </Button>
                <Button variant="primary" fullWidth onClick={onClose} iconLeft="receipt_long">
                  Xem chi tiết đặt phòng
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BookingPage() {
  useEffect(() => {
    document.title = 'Xác Nhận Đặt Phòng | Sương Mai Hotel';
  }, []);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const roomId   = searchParams.get('roomId')   || '';
  const paramIn  = searchParams.get('checkIn')  || searchParams.get('from_date') || '';
  const paramOut = searchParams.get('checkOut') || searchParams.get('to_date')   || '';

  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Tìm phòng từ data, fallback về phòng đầu tiên nếu không tìm thấy
  const room = useMemo(
    () => ROOMS_DATA.find((r) => r.id === roomId) || ROOMS_DATA[0],
    [roomId]
  );

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

  // Success modal
  const [showSuccess, setShowSuccess]   = useState(false);
  const [bookingRef,  setBookingRef]    = useState('');

  // Tính giá
  const nights       = calcNights(checkIn, checkOut);
  const pricePerNight = room.pricing.price;
  const subtotal      = pricePerNight * Math.max(nights, 1);
  const depositPct    = room.pricing.depositPercent || 30;
  const deposit       = Math.round((subtotal * depositPct) / 100);
  const remaining     = subtotal - deposit;

  // Weekend surcharge
  const weekendSurcharge = room.pricing.weekendSurcharge || 0;

  // Validate
  const validate = () => {
    const e = {};
    if (!guestName.trim()) e.guestName = 'Vui lòng nhập họ và tên';
    if (!phone.trim())     e.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^[0-9+() -]{9,15}$/.test(phone.trim())) e.phone = 'Số điện thoại không hợp lệ';
    if (!email.trim())     e.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Email không hợp lệ';
    if (!checkIn)  e.checkIn  = 'Vui lòng chọn ngày nhận phòng';
    if (!checkOut) e.checkOut = 'Vui lòng chọn ngày trả phòng';
    else if (checkIn && checkOut <= checkIn) e.checkOut = 'Ngày trả phòng phải sau ngày nhận phòng';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);

    const code = 'SM-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(code);

    try {
      // 1. Gửi yêu cầu tạo giao dịch thanh toán đặt cọc qua cổng PayOS
      const paymentRes = await createDepositPayment({
        bookingCode: code,
        roomCategoryId: room.categoryId || room.category,
        roomId: room.id,
        roomName: room.name,
        checkIn,
        checkOut,
        guestName,
        phone,
        email,
        adults,
        children,
        totalAmount: subtotal,
        depositAmount: deposit,
      });

      if (paymentRes?.checkoutUrl) {
        // [PAYOS GATEWAY]: Chuyển hướng trực tiếp sang trang thanh toán PayOS
        redirectToPayOS(paymentRes.checkoutUrl);
        return;
      }
      throw new Error('Không nhận được liên kết thanh toán từ cổng PayOS');
    } catch (err) {
      console.warn('Không thể chuyển sang PayOS, hiển thị modal thông báo:', err);
      setBusy(false);
      setShowSuccess(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/');
  };

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
            <div className="space-y-6">

              {/* Ảnh & thông tin phòng */}
              <section className="bg-surface rounded-2xl border border-border-custom shadow-sm overflow-hidden">
                <div className="relative h-52 sm:h-64">
                  <img
                    src={room.images[0]?.url}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <Badge variant="goldSolid" className="mb-2">{room.category === 'president' ? 'Presidential Suite' : room.category.charAt(0).toUpperCase() + room.category.slice(1)}</Badge>
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
            </div>

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
                      <span>{formatVND(pricePerNight)} × {Math.max(nights, 1)} đêm</span>
                      <span className="font-semibold text-primary">{formatVND(pricePerNight * Math.max(nights, 1))}</span>
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

                {/* CTA button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={busy}
                >
                  {busy ? 'Đang xử lý…' : 'Xác nhận đặt'}
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

      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        bookingRef={bookingRef}
        guestName={guestName}
        email={email}
        checkIn={checkIn}
        checkOut={checkOut}
        nights={nights}
        depositAmount={deposit}
        roomName={room.name}
      />
    </div>
  );
}
