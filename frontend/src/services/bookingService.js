import axios from 'axios';
import { createDepositPayment } from './paymentService';

const bookingRequests = new Map();
const paymentRequests = new Map();
const rejectedStatuses = new Set([400, 401, 403, 404, 409, 422]);

export const getAuthToken = () =>
  localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

export const getLocalDate = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || '')
  && !Number.isNaN(Date.parse(value))
  && new Date(value).toISOString().slice(0, 10) === value;

export const validateBooking = (payload, capacity) => {
  const errors = {};
  if (!payload.guestName.trim()) errors.guestName = 'Vui lòng nhập họ và tên';
  else if (payload.guestName.trim().length > 100) errors.guestName = 'Họ tên không được vượt quá 100 ký tự';
  const phone = payload.phone.trim();
  if (!phone) errors.phone = 'Vui lòng nhập số điện thoại';
  else if (!/^[0-9+() .-]{9,20}$/.test(phone) || !/^\d{9,15}$/.test(phone.replace(/\D/g, ''))) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }
  if (!payload.email.trim()) errors.email = 'Vui lòng nhập email';
  else if (payload.email.trim().length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    errors.email = 'Email không hợp lệ';
  }
  if (!isDate(payload.checkIn)) errors.checkIn = 'Vui lòng chọn ngày nhận phòng hợp lệ';
  else if (payload.checkIn < getLocalDate()) errors.checkIn = 'Ngày nhận phòng không được ở trong quá khứ';
  if (!isDate(payload.checkOut)) errors.checkOut = 'Vui lòng chọn ngày trả phòng hợp lệ';
  else if (payload.checkIn && payload.checkOut <= payload.checkIn) errors.checkOut = 'Ngày trả phòng phải sau ngày nhận phòng';
  if (!Number.isInteger(payload.guestCount) || payload.guestCount < 1) errors.guestCount = 'Số khách phải lớn hơn 0';
  else if (capacity && payload.guestCount > capacity) errors.guestCount = `Phòng chỉ dành cho tối đa ${capacity} khách (gồm người lớn và trẻ em)`;
  return errors;
};

const attemptKey = (payload) => {
  const token = getAuthToken();
  if (!token) return null;
  let owner;
  try {
    owner = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).sub;
  } catch {
    const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
    try { owner = JSON.parse(storage.getItem('authUser'))?.accountId; } catch { /* Missing profile. */ }
  }
  return `booking86:${JSON.stringify([owner || 'current-session', payload.roomId, payload.checkIn, payload.checkOut])}`;
};

const readAttempt = (key) => {
  try {
    const value = sessionStorage.getItem(key);
    if (value === null) return null;
    const attempt = JSON.parse(value);
    return attempt && typeof attempt === 'object' && ['pending', 'created'].includes(attempt.status)
      ? attempt
      : { status: 'unknown' };
  } catch {
    // A broken journal must never allow another POST whose outcome is unknown.
    return { status: 'unknown' };
  }
};

export const getBookingAttempt = (payload) => {
  const key = attemptKey(payload);
  return key ? readAttempt(key) : null;
};

const bookingError = (message, code) => Object.assign(new Error(message), { code });
const unknownOutcome = () => bookingError(
  'Chưa xác định được kết quả tạo booking. Đã chặn gửi lại để tránh đặt trùng; vui lòng liên hệ lễ tân kiểm tra đơn theo số điện thoại và ngày đặt trước khi đặt tiếp.',
  'BOOKING_OUTCOME_UNKNOWN',
);

const fingerprint = (payload) => JSON.stringify(payload);
const matchesBooking = (booking, payload) => booking
  && /^BK[\w-]+$/.test(booking.bookingCode || '')
  && booking.roomId === payload.roomId
  && booking.checkIn === payload.checkIn && booking.checkOut === payload.checkOut
  && booking.guestCount === payload.guestCount
  && Number.isFinite(Number(booking.estimatedTotal)) && Number(booking.estimatedTotal) > 0
  && Number.isFinite(Number(booking.requiredDeposit)) && Number(booking.requiredDeposit) > 0
  && Number(booking.requiredDeposit) <= Number(booking.estimatedTotal);

export const createBooking = async (payload, guestCounts) => {
  const token = getAuthToken();
  if (!token) throw bookingError('Vui lòng đăng nhập trước khi đặt phòng.', 'BOOKING_AUTH_REQUIRED');
  const key = attemptKey(payload);
  const existing = readAttempt(key);
  if (existing?.fingerprint && existing.fingerprint !== fingerprint(payload)) {
    throw bookingError('Đã gửi yêu cầu đặt phòng cho phòng và ngày này. Vui lòng giữ nguyên thông tin và kiểm tra đơn trước khi đặt tiếp.', 'BOOKING_ATTEMPT_CHANGED');
  }
  if (existing?.status === 'created' && matchesBooking(existing.data, payload)) return existing.data;
  if (bookingRequests.has(key)) return bookingRequests.get(key);
  if (existing) throw unknownOutcome();

  const attempt = { status: 'pending', payload, guestCounts, fingerprint: fingerprint(payload) };
  try {
    // Persist BEFORE the request so reloads and lost responses cannot repeat it.
    sessionStorage.setItem(key, JSON.stringify(attempt));
  } catch {
    throw bookingError('Không lưu được trạng thái đơn trong trình duyệt. Chưa gửi yêu cầu đặt phòng; vui lòng kiểm tra quyền lưu trữ của trình duyệt.', 'BOOKING_STORAGE_UNAVAILABLE');
  }

  const request = (async () => {
    let response;
    try {
      response = await axios.post('/api/bookings', payload, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 60000,
      });
    } catch (error) {
      if (rejectedStatuses.has(error.response?.status)) sessionStorage.removeItem(key);
      else throw unknownOutcome();
      throw error;
    }
    if (response.status !== 201 || !matchesBooking(response.data, payload)) {
      throw bookingError('Phản hồi tạo booking không khớp phòng, ngày, số khách hoặc số tiền yêu cầu. Đã dừng thanh toán và chặn gửi lại; vui lòng liên hệ lễ tân kiểm tra đơn.', 'BOOKING_RESPONSE_INVALID');
    }
    try {
      sessionStorage.setItem(key, JSON.stringify({ ...attempt, status: 'created', data: response.data }));
    } catch {
      throw unknownOutcome();
    }
    return response.data;
  })();
  bookingRequests.set(key, request);
  try { return await request; } finally { bookingRequests.delete(key); }
};

export const createBookingPayment = async (booking, payload) => {
  const key = attemptKey(payload);
  const attempt = key ? readAttempt(key) : null;
  if (!matchesBooking(booking, payload) || attempt?.data?.bookingCode !== booking.bookingCode) {
    throw bookingError('Không xác minh được booking đã tạo cho phòng này. Đã dừng thanh toán.', 'BOOKING_RESPONSE_INVALID');
  }
  if (attempt.payment) return attempt.payment;
  if (paymentRequests.has(key)) return paymentRequests.get(key);
  const request = (async () => {
    const payment = await createDepositPayment({
      bookingCode: booking.bookingCode,
      roomId: booking.roomId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guestName: booking.guestName,
      phone: booking.phone,
      email: booking.email,
      adults: booking.guestCount,
      children: 0,
      totalAmount: Number(booking.estimatedTotal),
      depositAmount: Number(booking.requiredDeposit),
    });
    let url;
    try { url = new URL(payment?.checkoutUrl); } catch { /* Reject missing/invalid URL. */ }
    if (!url || url.protocol !== 'https:' || !['pay.payos.vn', 'next.pay.payos.vn'].includes(url.hostname)
      || url.username || url.password || !payment.bookingCode
      || payment.bookingCode !== booking.bookingCode
      || !Number.isSafeInteger(Number(payment.orderCode)) || Number(payment.orderCode) <= 0
      || Number(payment.amount) !== Number(booking.requiredDeposit)) {
      throw new Error('PayOS trả về liên kết, mã booking hoặc số tiền không hợp lệ. Chưa chuyển sang thanh toán.');
    }
    sessionStorage.setItem(key, JSON.stringify({ ...attempt, payment }));
    return payment;
  })();
  paymentRequests.set(key, request);
  try { return await request; } finally { paymentRequests.delete(key); }
};

export const getBookingErrorMessage = (error) => {
  if (error.code?.startsWith('BOOKING_')) return error.message;
  const status = error.response?.status;
  if (status === 409) return 'Phòng vừa có người đặt hoặc dữ liệu đặt phòng đã thay đổi. Vui lòng tra cứu lại phòng hoặc đổi ngày.';
  if (status === 401 || status === 403) return 'Phiên đăng nhập không hợp lệ hoặc tài khoản chưa có quyền đặt phòng. Vui lòng đăng nhập lại.';
  if (status === 422) return 'Chưa có bảng giá phù hợp cho thời gian đã chọn. Vui lòng đổi ngày hoặc phòng.';
  if (status === 400) return Object.values(error.response.data?.errors || {})[0] || error.response.data?.message || 'Thông tin đặt phòng chưa hợp lệ. Vui lòng kiểm tra lại.';
  if (status === 404) return 'Không tìm thấy phòng này. Vui lòng tra cứu lại.';
  if (status >= 500 || !error.response) return unknownOutcome().message;
  return error.response.data?.message || 'Đặt phòng thất bại.';
};
