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