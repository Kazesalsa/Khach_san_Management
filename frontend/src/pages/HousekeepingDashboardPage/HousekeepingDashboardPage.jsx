import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

function HousekeepingDashboardPage() {
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomsError, setRoomsError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [apiFeedback, setApiFeedback] = useState({
    type: '',
    message: '',
  });

  useEffect(() => {
    document.title = 'Dashboard Buồng Phòng | Sương Mai Hotel';

    const loadRooms = async () => {
      const token =
        localStorage.getItem('authToken') ||
        sessionStorage.getItem('authToken');

      if (!token) {
        setRoomsError('Vui lòng đăng nhập để xem danh sách phòng.');
        setLoadingRooms(false);
        return;
      }

      try {
        const response = await axios.get('/api/rooms', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!Array.isArray(response.data)) {
          throw new Error('Dữ liệu danh sách phòng không hợp lệ');
        }

        setRooms(response.data);
        setRoomsError('');
      } catch (err) {
        console.error('Không thể tải danh sách phòng:', err);

        setRoomsError(
          'Không thể tải danh sách phòng. Vui lòng thử lại sau.'
        );
      } finally {
        setLoadingRooms(false);
      }
    };

    loadRooms();
  }, []);

  // Đánh dấu phòng đã dọn xong bằng API thật
  const markRoomCleanByCode = async (selectedCode) => {
  const code = (selectedCode ?? roomCodeInput).trim();

    if (!code) {
      setApiFeedback({
        type: 'error',
        message: 'Vui lòng nhập mã phòng.',
      });
      return;
    }

    const token =
      localStorage.getItem('authToken') ||
      sessionStorage.getItem('authToken');

    if (!token) {
      setApiFeedback({
        type: 'error',
        message: 'Vui lòng đăng nhập bằng tài khoản nhân viên buồng phòng.',
      });
      return;
    }

    setUpdating(true);
    setApiFeedback({ type: '', message: '' });

    try {
      const response = await axios.patch(
        `/api/rooms/${encodeURIComponent(code)}/cleaning-status`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApiFeedback({
        type: 'success',
        message: `Đã đánh dấu thành công cho phòng ${response.data.roomNumber}`,
      });

      setRoomCodeInput('');
      setRooms((prev) =>
        prev.map((room) =>
          room.roomCode === code
            ? { ...room, cleaningStatus: 'DA_DON_XONG' }
            : room
        )
      );

      // Tải lại danh sách phòng sau khi PATCH thành công
      try {
        const roomsResponse = await axios.get('/api/rooms', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!Array.isArray(roomsResponse.data)) {
          throw new Error('Dữ liệu danh sách phòng không hợp lệ');
        }

        setRooms(roomsResponse.data);
        setRoomsError('');
      } catch (refreshError) {
        console.error('Không thể tải lại danh sách phòng:', refreshError);
        // Giữ trạng thái đã cập nhật ở trên nếu GET tạm thời lỗi.
      }

    } catch (err) {
      const status = err.response?.status;

      let message = 'Không thể cập nhật trạng thái phòng. Vui lòng thử lại sau.';

      if (status === 404) {
        message = 'Phòng không tồn tại';
      } else if (status === 400) {
        message = 'Phòng này đã được đánh dấu dọn xong';
      } else if (status === 401) {
        message = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (status === 403) {
        message = 'Bạn không có quyền thực hiện thao tác này.';
      } else if (!err.response) {
        message = 'Không thể kết nối đến máy chủ. Vui lòng thử lại.';
      }

      setApiFeedback({ type: 'error', message });
    } finally {
      setUpdating(false);
    }
  };

  const uncleanedRooms = rooms.filter(
    (room) => room.cleaningStatus === 'CHUA_DON'
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-text-on-dark border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-accent text-xs font-bold uppercase tracking-[0.2em]">
                Sương Mai Hotel
              </p>
              <h1 className="font-headline text-2xl sm:text-3xl font-bold mt-1">
                Dashboard Nhân Viên Buồng Phòng
              </h1>
              <p className="text-text-on-dark/70 text-sm mt-2">
                Quản lý trạng thái dọn dẹp các phòng trong khách sạn
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 sm:px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="hidden sm:inline">Về trang chủ</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Đánh dấu phòng đã dọn bằng API */}
        <section className="bg-surface rounded-2xl border border-border-custom shadow-sm p-6">
          <h2 className="font-headline text-xl font-bold text-primary mb-4">
            Đánh dấu phòng đã dọn xong
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!updating) markRoomCleanByCode();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value)}
              placeholder="Nhập mã phòng..."
              aria-label="Mã phòng cần đánh dấu"
              className="flex-1 bg-background border border-border-custom rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent"
            />

            <Button
              type="submit"
              variant="secondary"
              iconLeft="check_circle"
              isLoading={updating}
              isDisabled={updating}
            >
              {updating ? 'Đang cập nhật...' : 'Đã dọn xong'}
            </Button>
          </form>

          {apiFeedback.message && (
            <div
              role="alert"
              className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                apiFeedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {apiFeedback.message}
            </div>
          )}
        </section>

        {/* Danh sách phòng cần dọn từ API */}
        <section className="bg-surface rounded-2xl border border-border-custom shadow-sm p-6">
          <h2 className="font-headline text-xl font-bold text-primary mb-4">
            Danh sách phòng cần dọn
          </h2>

          {loadingRooms ? (
            <p className="text-text-secondary">
              Đang tải danh sách phòng...
            </p>
          ) : roomsError ? (
            <p role="alert" className="text-red-600">
              {roomsError}
            </p>
          ) : uncleanedRooms.length === 0 ? (
            <p className="text-text-secondary">
              Hiện không có phòng nào cần dọn.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uncleanedRooms.map((room) => (
                <div
                  key={room.id}
                  className="rounded-xl border border-border-custom p-4 space-y-2"
                >
                  <h3 className="font-bold text-primary text-lg">
                    Phòng {room.roomNumber}
                  </h3>

                  <p className="text-sm text-text-secondary">
                    Mã phòng: {room.roomCode}
                  </p>

                  <p className="text-sm text-text-secondary">
                    Loại phòng: {room.roomType || 'Chưa xác định'}
                  </p>

                  <p className="text-sm text-text-secondary">
                    Tầng: {room.floor}
                  </p>

                  <span className="inline-block rounded-lg bg-amber-100 text-amber-800 px-3 py-1 text-xs font-semibold">
                    Chưa dọn
                  </span>

                  <Button
                    type="button"
                    variant="secondary"
                    iconLeft="check_circle"
                    onClick={() => markRoomCleanByCode(room.roomCode)}
                    isLoading={updating}
                    isDisabled={updating}
                  >
                    Đã dọn xong
                  </Button>

                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default HousekeepingDashboardPage;
