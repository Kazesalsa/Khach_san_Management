import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import DatePicker from '../ui/DatePicker';
import { useToast } from '../ui/Toast';
import { redirectToPayOS } from '../../services/paymentService';
import { createBooking, createBookingPayment, getAuthToken, getBookingAttempt, getBookingErrorMessage, getLocalDate, validateBooking } from '../../services/bookingService';

const BookingConfirmModal = ({
  isOpen,
  onClose,
  room,
  initialCheckIn = '',
  initialCheckOut = '',
  initialGuests = 2,
}) => {
  const { addToast } = useToast();
  const navigate = useNavigate();

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

  // Persisted booking state: do not repeat POST after losing a response.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);
  const lastItinerary = useRef(null);
  const [outcomeUnknown, setOutcomeUnknown] = useState(false);
  const [authRejected, setAuthRejected] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const previous = lastItinerary.current;
    const restore =
      previous?.roomId === room?.id &&
      previous.initialCheckIn === initialCheckIn &&
      previous.initialCheckOut === initialCheckOut;

    const initialIn =
      (restore ? previous.checkIn : initialCheckIn) || getLocalDate();

    const initialOut =
      (restore ? previous.checkOut : initialCheckOut) || getLocalDate(1);

    const attempt = getBookingAttempt({
      roomId: room?.id,
      checkIn: initialIn,
      checkOut: initialOut,
    });

    const saved = attempt?.status === 'created' ? attempt.data : null;

    setCreatedBooking(saved ? { data: saved } : null);
    setOutcomeUnknown(Boolean(attempt && !saved));
    setSubmitError(attempt && !saved ? getBookingErrorMessage({}) : '');
    setErrors({});

    setCheckIn(initialIn);
    setCheckOut(initialOut);
    setGuests(
      attempt?.guestCounts?.adults ??
      attempt?.payload?.guestCount ??
      initialGuests
    );
    setChildrenCount(attempt?.guestCounts?.children ?? 0);
    setGuestName(attempt?.payload?.guestName || '');
    setPhone(attempt?.payload?.phone || '');
    setEmail(attempt?.payload?.email || '');
  }, [isOpen, room?.id, initialCheckIn, initialCheckOut, initialGuests]);

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
  const subtotal = createdBooking ? Number(createdBooking.data.estimatedTotal) : roomPricePerNight * nights;
  const depositPercent = room?.pricing?.depositPercent || 30;
  const depositAmount = createdBooking ? Number(createdBooking.data.requiredDeposit) : Math.round((subtotal * depositPercent) / 100);

  const formatVND = (num) => new Intl.NumberFormat('vi-VN').format(num) + '₫';

  const bookingPayload = {
    roomId: room?.id, checkIn, checkOut,
    guestCount: Number(guests) + Number(childrenCount),
    guestName: guestName.trim(), phone: phone.trim(), email: email.trim(),
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (submitting.current || outcomeUnknown) return;
    const fieldErrors = validateBooking(bookingPayload, room?.specs.guests);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;
    setSubmitError('');
    if (!getAuthToken() || authRejected) {
      const params = new URLSearchParams({ roomId: room.id, checkIn, checkOut });
      navigate(`/dang-nhap?next=${encodeURIComponent(`/booking?${params.toString()}`)}`);
      return;
    }
    submitting.current = true;
    lastItinerary.current = { roomId: room.id, checkIn, checkOut, initialCheckIn, initialCheckOut };
    setIsSubmitting(true);
    let saved;
    try {
      saved = await createBooking(bookingPayload, { adults: guests, children: childrenCount });
      setCreatedBooking({ data: saved });
      const payment = await createBookingPayment(saved, bookingPayload);
      redirectToPayOS(payment.checkoutUrl);
    } catch (error) {
      const status = error.response?.status;
      setAuthRejected(status === 401 || status === 403);
      const message = saved
        ? `Đã tạo đơn ${saved.bookingCode}; chưa xác nhận thanh toán cọc. PayOS gặp lỗi: ${error.response?.data?.message || error.message}. Bấm Tiếp tục thanh toán để thử lại cho cùng mã.`
        : getBookingErrorMessage(error);
      if (!saved) setOutcomeUnknown(['BOOKING_OUTCOME_UNKNOWN', 'BOOKING_RESPONSE_INVALID', 'BOOKING_ATTEMPT_CHANGED'].includes(error.code));
      setErrors((previous) => ({ ...previous, ...error.response?.data?.errors }));
      setSubmitError(message);
      addToast({ title: 'Chưa hoàn tất đặt phòng', message, type: 'error', duration: 6000 });
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  if (!room) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      showClose={!isSubmitting}
      title="Xác Nhận Đặt Phòng Nghỉ"
      subtitle={`Hạng phòng: ${room.name} • Indochine Heritage Luxury`}
      maxWidth="max-w-2xl"
    >
        <form onSubmit={handleConfirmBooking} noValidate className="flex flex-col gap-6">

                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-900">
            Phòng chưa được khóa giữ chỗ. Hệ thống sẽ kiểm tra lại phòng trống ngay khi bạn xác nhận đặt phòng.
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

          <fieldset disabled={isSubmitting || Boolean(createdBooking) || outcomeUnknown} className="contents">
          {/* Date & Guest Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              label="Ngày nhận phòng"
              id="modal-check-in"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={getLocalDate()}
              error={errors.checkIn}
              required
            />
            <DatePicker
              label="Ngày trả phòng"
              id="modal-check-out"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || getLocalDate()}
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

          </fieldset>
          {errors.guestCount && <p role="alert" className="text-sm text-red-800">{errors.guestCount}</p>}

          {/* Financial Calculation Breakdown */}
          <div className="bg-surface-alt/60 rounded-xl p-4 border border-border-custom flex flex-col gap-2 text-xs">
            <div className="flex justify-between items-center text-text-secondary">
              <span>{createdBooking ? `Tiền phòng theo đơn (${nights} đêm):` : `Đơn giá phòng (${nights} đêm x ${formatVND(room.pricing.price)}):`}</span>
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

          {createdBooking && <p role="status" className="text-sm text-primary">Đã tạo đơn <strong>{createdBooking.data.bookingCode}</strong>. Tiếp tục thanh toán cọc cho đơn này.</p>}
          {submitError && (
            <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
              {submitError}
            </div>
          )}
          {(!getAuthToken() || authRejected) && (
            <p className="text-xs text-amber-800">Vui lòng đăng nhập hoặc đăng ký để đặt phòng. Nhấn Xác nhận đặt sẽ chuyển đến trang đăng nhập.</p>
          )}
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
              isDisabled={outcomeUnknown}
            >
              {isSubmitting ? 'Đang xử lý…' : createdBooking ? 'Tiếp tục thanh toán' : 'Xác nhận đặt'}
            </Button>
          </div>

        </form>
    </Modal>
  );
};

export default BookingConfirmModal;
