import axios from 'axios';

const API_BASE = '/api';

const getAuthToken = () =>
  localStorage.getItem('authToken') ||
  sessionStorage.getItem('authToken');

const getAuthConfig = () => {
  const token = getAuthToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const buildDefaultUrls = (bookingCode, type, customReturnUrl, customCancelUrl) => {
  const origin = window.location.origin;
  return {
    returnUrl: customReturnUrl || `${origin}/payment/result?bookingCode=${bookingCode || ''}&type=${type}`,
    cancelUrl: customCancelUrl || `${origin}/payment/result?bookingCode=${bookingCode || ''}&type=${type}&cancel=true`,
  };
};

/**
 * Gọi API backend tạo link thanh toán tiền cọc qua cổng PayOS
 */
export const createDepositPayment = async (data) => {
  const urls = buildDefaultUrls(data.bookingCode, 'DEPOSIT', data.returnUrl, data.cancelUrl);
  const response = await axios.post(
    `${API_BASE}/payment/create-deposit`,
    { ...data, ...urls },
    getAuthConfig()
  );
  return response.data;
};

/**
 * Gọi API backend tạo link thanh toán quyết toán hóa đơn khi Checkout qua cổng PayOS
 */
export const createCheckoutPayment = async (data) => {
  const urls = buildDefaultUrls(data.bookingCode, 'CHECKOUT', data.returnUrl, data.cancelUrl);
  const response = await axios.post(
    `${API_BASE}/payment/create-checkout`,
    { ...data, ...urls },
    getAuthConfig()
  );
  return response.data;
};

/**
 * Kiểm tra trạng thái giao dịch theo orderCode và đồng bộ với PayOS
 */
export const getPaymentStatus = async (orderCode) => {
  const response = await axios.get(
    `${API_BASE}/payment/status/${orderCode}`,
    getAuthConfig()
  );
  return response.data;
};

/**
 * Chuyển hướng trình duyệt sang cổng thanh toán chính thức của PayOS
 */
export const redirectToPayOS = (checkoutUrl) => {
  if (!checkoutUrl) {
    throw new Error('Không nhận được đường dẫn thanh toán checkoutUrl từ PayOS');
  }
  window.location.href = checkoutUrl;
};
