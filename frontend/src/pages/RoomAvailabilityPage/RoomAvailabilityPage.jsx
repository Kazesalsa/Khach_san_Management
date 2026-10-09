import { useState } from 'react';
import axios from 'axios';
import DatePicker from '../../components/ui/DatePicker';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const API_BASE = 'http://localhost:8080/api';

// Định dạng ngày về yyyy-MM-dd để gửi lên API
const toDateString = (date) => date;

// Định dạng ngày hiển thị đẹp cho người dùng
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Format giá tiền VNĐ
const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);

function RoomAvailabilityPage() {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState(null); // null = chưa search, [] = không có phòng
  const [apiError, setApiError] = useState('');
  const [searched, setSearched] = useState(false);

  // Validate ngày trước khi gọi API
  const validate = () => {
    const newErrors = {};

    if (!checkIn) {
      newErrors.checkIn = 'Vui lòng chọn ngày nhận phòng';
    } else if (checkIn < today) {
      newErrors.checkIn = 'Ngày nhận phòng không được là ngày trong quá khứ';
    }

    if (!checkOut) {
      newErrors.checkOut = 'Vui lòng chọn ngày trả phòng';
    } else if (checkIn && checkOut <= checkIn) {
      newErrors.checkOut = 'Ngày trả phòng phải sau ngày nhận phòng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý thay đổi ngày nhận phòng — tự động reset ngày trả nếu bị lỗi
  const handleCheckInChange = (e) => {
    const val = e.target.value;
    setCheckIn(val);
    setErrors((prev) => ({ ...prev, checkIn: '' }));

    // Nếu ngày trả đã chọn mà <= ngày nhận mới → báo lỗi ngay
    if (checkOut && checkOut <= val) {
      setErrors((prev) => ({
        ...prev,
        checkOut: 'Ngày trả phòng phải sau ngày nhận phòng',
      }));
    } else {
      setErrors((prev) => ({ ...prev, checkOut: '' }));
    }
  };

  // Xử lý thay đổi ngày trả phòng
  const handleCheckOutChange = (e) => {
    const val = e.target.value;
    setCheckOut(val);

    if (checkIn && val <= checkIn) {
      setErrors((prev) => ({
        ...prev,
        checkOut: 'Ngày trả phòng phải sau ngày nhận phòng',
      }));
    } else {
      setErrors((prev) => ({ ...prev, checkOut: '' }));
    }
  };

  // Gọi API tra cứu phòng trống
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');
    setRooms(null);
    setSearched(false);

    try {
      const response = await axios.get(`${API_BASE}/rooms/available`, {
        params: {
          checkIn: toDateString(checkIn),
          checkOut: toDateString(checkOut),
        },
      });
      setRooms(response.data);
      setSearched(true);
    } catch (err) {
      if (err.response) {
        // Lỗi từ server (4xx, 5xx)
        setApiError(
          err.response.data?.message ||
            `Lỗi từ máy chủ (${err.response.status}). Vui lòng thử lại.`
        );
      } else if (err.request) {
        // Không kết nối được backend
        setApiError(
          'Không thể kết nối tới máy chủ. Vui lòng kiểm tra backend đang chạy.'
        );
      } else {
        setApiError('Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
      }
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  // Tính số đêm
  const nightCount =
    checkIn && checkOut && checkOut > checkIn
      ? Math.round(
          (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
        )
      : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-text-on-dark border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <p className="text-accent text-xs font-bold uppercase tracking-[0.2em]">
            Sương Mai Hotel
          </p>
          <h1 className="font-headline text-3xl font-bold mt-1">
            Tra Cứu Phòng Trống
          </h1>
          <p className="text-text-on-dark/70 text-sm mt-2">
            Chọn ngày nhận phòng và trả phòng để xem danh sách phòng còn trống
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Search Form */}
        <section className="bg-surface rounded-2xl border border-border-custom shadow-sm p-6">
          <h2 className="font-headline text-xl font-bold text-primary mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-accent text-[22px]">
              search
            </span>
            Chọn Thời Gian Lưu Trú
          </h2>

          <form onSubmit={handleSearch} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              {/* Ngày nhận phòng */}
              <DatePicker
                id="check-in"
                label="Ngày nhận phòng"
                icon="calendar_today"
                value={checkIn}
                onChange={handleCheckInChange}
                min={today}
                required
                error={errors.checkIn}
                helperText={
                  checkIn
                    ? formatDisplayDate(checkIn)
                    : 'Tối thiểu từ hôm nay'
                }
              />

              {/* Ngày trả phòng */}
              <DatePicker
                id="check-out"
                label="Ngày trả phòng"
                icon="event"
                value={checkOut}
                onChange={handleCheckOutChange}
                min={checkIn ? (() => {
                  // min của check-out = ngày sau check-in
                  const d = new Date(checkIn + 'T00:00:00');
                  d.setDate(d.getDate() + 1);
                  return d.toISOString().split('T')[0];
                })() : tomorrow}
                required
                error={errors.checkOut}
                helperText={
                  checkOut
                    ? formatDisplayDate(checkOut)
                    : 'Phải sau ngày nhận phòng'
                }
              />
            </div>

            {/* Thông tin tóm tắt kỳ lưu trú */}
            {nightCount > 0 && (
              <div className="mb-5 flex items-center gap-2 text-sm text-text-secondary bg-background rounded-xl px-4 py-3 border border-border-custom">
                <span className="material-symbols-outlined text-accent text-[18px]">
                  nights_stay
                </span>
                <span>
                  Lưu trú{' '}
                  <strong className="text-primary">{nightCount} đêm</strong>
                  {' · '}
                  {formatDisplayDate(checkIn)} →{' '}
                  {formatDisplayDate(checkOut)}
                </span>
              </div>
            )}

            <Button
              type="submit"
              iconLeft={loading ? null : 'search'}
              isLoading={loading}
              fullWidth
              size="lg"
            >
              {loading ? 'Đang tra cứu...' : 'Tìm Phòng Trống'}
            </Button>
          </form>
        </section>

        {/* Kết quả */}
        {searched && (
          <section>
            {/* Lỗi API */}
            {apiError && (
              <div className="bg-surface rounded-2xl border border-danger-custom/30 shadow-sm p-6 flex items-start gap-4">
                <span className="material-symbols-outlined text-danger-custom text-3xl shrink-0">
                  wifi_off
                </span>
                <div>
                  <h3 className="font-bold text-danger-custom text-base">
                    Không thể tra cứu
                  </h3>
                  <p className="text-text-secondary text-sm mt-1">{apiError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    iconLeft="refresh"
                    onClick={handleSearch}
                    className="mt-4"
                  >
                    Thử lại
                  </Button>
                </div>
              </div>
            )}

            {/* Không có phòng trống */}
            {!apiError && rooms && rooms.length === 0 && (
              <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-12 flex flex-col items-center text-center gap-3">
                <span className="material-symbols-outlined text-5xl text-text-secondary/40">
                  bed
                </span>
                <h3 className="font-headline text-xl font-bold text-primary">
                  Không có phòng trống
                </h3>
                <p className="text-text-secondary text-sm max-w-sm">
                  Không tìm thấy phòng trống trong khoảng thời gian từ{' '}
                  <strong>{formatDisplayDate(checkIn)}</strong> đến{' '}
                  <strong>{formatDisplayDate(checkOut)}</strong>.
                </p>
                <p className="text-text-secondary text-sm">
                  Vui lòng thử chọn khoảng thời gian khác.
                </p>
              </div>
            )}

            {/* Danh sách phòng trống */}
            {!apiError && rooms && rooms.length > 0 && (
              <>
                {/* Header kết quả */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-headline text-2xl font-bold text-primary">
                      Phòng Trống
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">
                      Tìm thấy{' '}
                      <strong className="text-primary">{rooms.length} phòng</strong>{' '}
                      · {nightCount} đêm · {formatDisplayDate(checkIn)} →{' '}
                      {formatDisplayDate(checkOut)}
                    </p>
                  </div>
                  <Badge variant="success" dot>
                    {rooms.length} phòng trống
                  </Badge>
                </div>

                {/* Bảng phòng */}
                <div className="bg-surface rounded-2xl border border-border-custom shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead className="bg-surface-alt/60">
                        <tr className="text-left">
                          <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                            Số phòng
                          </th>
                          <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                            Loại phòng
                          </th>
                          <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                            Sức chứa
                          </th>
                          <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                            Giá / đêm
                          </th>
                          <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                            Tổng {nightCount} đêm
                          </th>
                          <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                            Trạng thái
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-custom">
                        {rooms.map((room) => (
                          <tr
                            key={room.id ?? room.roomNumber}
                            className="hover:bg-background/70 transition-colors"
                          >
                            <td className="px-6 py-4 font-bold text-primary">
                              {room.roomNumber ?? room.number ?? room.id}
                            </td>
                            <td className="px-6 py-4 text-text-primary">
                              {room.roomType ?? room.type ?? '—'}
                            </td>
                            <td className="px-6 py-4 text-text-secondary">
                              {room.capacity ?? room.maxGuests
                                ? `${room.capacity ?? room.maxGuests} khách`
                                : '—'}
                            </td>
                            <td className="px-6 py-4 font-semibold text-success-custom">
                              {room.pricePerNight
                                ? formatPrice(room.pricePerNight)
                                : '—'}
                            </td>
                            <td className="px-6 py-4 font-bold text-primary">
                              {room.pricePerNight && nightCount
                                ? formatPrice(room.pricePerNight * nightCount)
                                : '—'}
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="success" dot>
                                Còn trống
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default RoomAvailabilityPage;
