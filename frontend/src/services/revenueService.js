
import axios from 'axios';

export async function getRevenueReport({
  fromDate,
  toDate,
  roomCategoryId,
}) {
  const token =
    localStorage.getItem('authToken') ||
    sessionStorage.getItem('authToken');

  if (!token) {
    throw new Error('Vui lòng đăng nhập để xem báo cáo doanh thu.');
  }

  const response = await axios.get('/api/revenue', {
    params: {
      fromDate,
      toDate,
      ...(roomCategoryId ? { roomCategoryId } : {}),
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
