import axios from 'axios';

export async function confirmCheckIn(bookingCode) {
  const token =
    localStorage.getItem('authToken') ||
    sessionStorage.getItem('authToken');

  if (!token) {
    throw new Error('Vui lòng đăng nhập để thực hiện check-in.');
  }

  const response = await axios.post(
    `/api/bookings/${encodeURIComponent(bookingCode)}/check-in`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getPendingCheckInBookings(keyword = '') {
  const token =
    localStorage.getItem('authToken') ||
    sessionStorage.getItem('authToken');

  if (!token) {
    throw new Error('Vui lòng đăng nhập để xem danh sách đặt phòng.');
  }

  const response = await axios.get(
    '/api/bookings/pending-check-in',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: keyword.trim()
        ? { keyword: keyword.trim() }
        : {},
    }
  );

  if (!Array.isArray(response.data)) {
    throw new Error('Dữ liệu danh sách đặt phòng không hợp lệ.');
  }

  return response.data;
}
