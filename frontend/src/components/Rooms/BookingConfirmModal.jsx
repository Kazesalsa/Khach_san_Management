import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import DatePicker from '../ui/DatePicker';
import { useToast } from '../ui/Toast';

const BookingConfirmModal = ({
  isOpen,
  onClose,
  room,
  initialCheckIn = '',
  initialCheckOut = '',
  initialGuests = 2,
  onSuccess,
}) => {
  const { addToast } = useToast();

  // Booking details state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  // Guest personal info
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Processing & Success state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Anti-double booking timer (10 mins)
  const [timerSeconds, setTimerSeconds] = useState(600);

  // Set default dates if not provided
  useEffect(() => {
    if (isOpen) {
      setBookingSuccess(false);
      setErrors({});
      setTimerSeconds(600);

      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      const formatDate = (d) => d.toISOString().split('T')[0];
      setCheckIn(initialCheckIn || formatDate(today));
      setCheckOut(initialCheckOut || formatDate(tomorrow));
      setGuests(initialGuests || 2);
    }
  }, [isOpen, initialCheckIn, initialCheckOut, initialGuests]);

  // Countdown timer for room lock
  useEffect(() => {
    if (!isOpen || bookingSuccess) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, bookingSuccess]);

  // Format timer MM:SS
  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Calculate nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const roomPricePerNight = room?.pricing?.price || 1200000;
  const subtotal = roomPricePerNight * nights;
  const depositPercent = room?.pricing?.depositPercent || 30;
  const depositAmount = Math.round((subtotal * depositPercent) / 100);

  const formatVND = (num) => new Intl.NumberFormat('vi-VN').format(num) + '₫';

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!guestName.trim()) {
      newErrors.guestName = 'Vui lòng nhập họ và tên của quý khách';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại liên hệ';
    } else if (!/^[0-9+() -]{9,15}$/.test(phone.trim())) {
      newErrors.phone = 'Số điện thoại không đúng định dạng';
    }
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email nhận phiếu xác nhận';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Email không hợp lệ';
    }

    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    if (d2 <= d1) {
      newErrors.checkOut = 'Ngày trả phòng phải sau ngày nhận phòng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate backend booking API call (1.2s delay)
    setTimeout(() => {
      const code = 'SM-' + Math.floor(100000 + Math.random() * 900000);
      setBookingRef(code);
      setIsSubmitting(false);
      setBookingSuccess(true);

      addToast({
        title: 'Giữ phòng thành công!',
        message: `Mã đặt phòng ${code} đã được gửi tới email ${email}. Cảm ơn quý khách!`,
        type: 'success',
        duration: 5000,
      });

      if (onSuccess) {
        onSuccess({ code, room, checkIn, checkOut, guestName, depositAmount });
      }
    }, 1200);
  };

  if (!room) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={bookingSuccess ? 'Xác Nhận Giữ Phòng Thành Công' : 'Xác Nhận Đặt Phòng Nghỉ'}
      subtitle={
        bookingSuccess
          ? 'Hệ thống Khách sạn Sương Mai đã ghi nhận yêu cầu lưu trú của quý khách'
          : `Hạng phòng: ${room.name} • Indochine Heritage Luxury`
      }
      maxWidth="max-w-2xl"
    >
      {bookingSuccess ? (
        /* Success State */
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-300">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>

          <h4 className="font-headline text-2xl font-bold text-primary mb-1">
            Kính chúc quý khách kỳ nghỉ an yên!
          </h4>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mb-6 leading-relaxed">
            Mã đặt chỗ của quý khách là <strong className="text-primary font-bold text-base">{bookingRef}</strong>. Thông tin xác nhận chi tiết và hướng dẫn thanh toán cọc đã được gửi đến hộp thư <strong className="text-primary">{email}</strong>.
          </p>

          {/* Booking Summary Ticket */}
          <div className="w-full bg-surface-alt/60 rounded-xl border border-border-custom p-5 mb-6 text-left flex flex-col gap-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border-custom/50">
              <span className="text-text-secondary uppercase font-semibold">Khách lưu trú:</span>
              <span className="font-bold text-primary">{guestName} ({phone})</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border-custom/50">
              <span className="text-text-secondary uppercase font-semibold">Thời gian lưu trú:</span>
              <span className="font-bold text-primary">
                {checkIn} đến {checkOut} ({nights} đêm)
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border-custom/50">
              <span className="text-text-secondary uppercase font-semibold">Số lượng khách:</span>
              <span className="font-bold text-primary">
                {guests} Người lớn {childrenCount > 0 ? `+ ${childrenCount} Trẻ em` : ''}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="text-primary font-bold">Tiền cọc cần thanh toán (30%):</span>
              <span className="font-headline text-lg font-bold text-accent">
                {formatVND(depositAmount)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="secondary" size="md" onClick={onClose} fullWidth>
              Hoàn tất & Đóng
            </Button>
          </div>
        </div>
      ) : (
        /* Booking Confirmation Form */
        <form onSubmit={handleConfirmBooking} className="flex flex-col gap-6">
          
          {/* Anti-Double Booking Lock Notification */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-accent text-[20px] shrink-0">
                lock_clock
              </span>
              <span>
                Phòng đang được khóa tạm thời trên hệ thống trong:
              </span>
            </div>
            <div className="px-2.5 py-1 rounded bg-amber-200/80 font-mono font-bold text-amber-950 text-xs shrink-0">
              {formatTimer(timerSeconds)}
            </div>
          </div>

          {/* Room Brief Card */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface-alt/40 p-3.5 rounded-xl border border-border-custom">
            <img
              src={room.images[0]?.url}
              alt={room.name}
              className="w-full sm:w-24 h-24 object-cover rounded-lg shrink-0"
            />
            <div className="flex-1 text-left w-full">
              <span className="text-[10px] text-accent uppercase font-bold tracking-wider">
                {room.floor} • {room.specs.area} m²
              </span>
              <h4 className="font-headline text-base font-bold text-primary">
                {room.name}
              </h4>
              <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-1">
                {room.specs.bed} • {room.specs.tub}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-headline text-sm font-bold text-primary">
                  {formatVND(room.pricing.price)}
                </span>
                <span className="text-[10px] text-text-secondary">/ đêm</span>
                <span className="text-[10px] text-accent font-semibold">
                  (Miễn phí Buffet sáng)
                </span>
              </div>
            </div>
          </div>

          {/* Date & Guest Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              label="Ngày nhận phòng"
              id="modal-check-in"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <DatePicker
              label="Ngày trả phòng"
              id="modal-check-out"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
              error={errors.checkOut}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-text-secondary font-bold">
                Người lớn
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="bg-white border border-border-custom rounded-xl p-2.5 text-xs text-text-primary font-semibold focus:border-accent focus:ring-1 focus:ring-accent"
              >
                <option value={1}>1 khách</option>
                <option value={2}>2 khách</option>
                <option value={3}>3 khách</option>
                <option value={4}>4 khách</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-text-secondary font-bold">
                Trẻ em (dưới 12t)
              </label>
              <select
                value={childrenCount}
                onChange={(e) => setChildrenCount(Number(e.target.value))}
                className="bg-white border border-border-custom rounded-xl p-2.5 text-xs text-text-primary font-semibold focus:border-accent focus:ring-1 focus:ring-accent"
              >
                <option value={0}>0 bé</option>
                <option value={1}>1 bé</option>
                <option value={2}>2 bé</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-3 pt-2 border-t border-border-custom/50">
            <span className="text-xs uppercase tracking-wider font-bold text-primary">
              Thông tin liên hệ nhận phòng
            </span>
            <Input
              label="Họ và tên người đặt"
              id="modal-guest-name"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              error={errors.guestName}
              icon="person"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Số điện thoại di động"
                id="modal-guest-phone"
                placeholder="0912 xxx xxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
                icon="call"
                required
              />
              <Input
                label="Địa chỉ Email"
                id="modal-guest-email"
                placeholder="email@vidu.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon="mail"
                required
              />
            </div>
            <Input
              label="Ghi chú thêm (tùy chọn)"
              id="modal-guest-note"
              placeholder="Ví dụ: Cần tầng cao, giường đôi, nhận phòng sớm..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              icon="edit_note"
            />
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="bg-surface-alt/60 rounded-xl p-4 border border-border-custom flex flex-col gap-2 text-xs">
            <div className="flex justify-between items-center text-text-secondary">
              <span>Đơn giá phòng ({nights} đêm x {formatVND(room.pricing.price)}):</span>
              <span className="font-semibold text-text-primary">{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-800">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                Đặc quyền đặt trực tiếp (Voucher Spa tặng kèm):
              </span>
              <span className="font-semibold">-200.000₫ (Quà tặng)</span>
            </div>
            <div className="flex justify-between items-center text-text-secondary">
              <span>Thuế VAT & Phí phục vụ:</span>
              <span className="font-semibold text-text-primary">Đã bao gồm</span>
            </div>
            <div className="pt-2 border-t border-border-custom flex justify-between items-baseline">
              <span className="font-bold text-primary">Tổng tiền thanh toán dự kiến:</span>
              <span className="font-headline text-lg font-bold text-primary">
                {formatVND(subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center bg-accent/15 p-2 rounded-lg text-primary font-bold">
              <span>Tiền cọc giữ phòng ngay ({depositPercent}%):</span>
              <span className="text-base text-accent font-extrabold">
                {formatVND(depositAmount)}
              </span>
            </div>
          </div>

          {/* Critical Warning Alert before Irreversible Action */}
          <div className="bg-rose-50 border border-rose-300 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-rose-900">
            <span className="material-symbols-outlined text-danger-custom text-[20px] shrink-0 mt-0.5">
              warning
            </span>
            <div className="flex flex-col gap-0.5">
              <strong className="font-bold">Cảnh báo quy định hủy phòng & hoàn cọc:</strong>
              <span className="leading-relaxed">
                Quý khách được miễn phí hủy phòng trước 48 giờ so với giờ nhận phòng ({checkIn} lúc 14:00). Sau thời gian này, khoản tiền đặt cọc {formatVND(depositAmount)} không thể hoàn lại theo quy định của khách sạn.
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-custom">
            <Button
              variant="outline"
              size="md"
              onClick={onClose}
              isDisabled={isSubmitting}
            >
              Quay lại
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              iconRight="check"
            >
              Xác nhận giữ phòng ({formatVND(depositAmount)})
            </Button>
          </div>

        </form>
      )}
    </Modal>
  );
};

export default BookingConfirmModal;
