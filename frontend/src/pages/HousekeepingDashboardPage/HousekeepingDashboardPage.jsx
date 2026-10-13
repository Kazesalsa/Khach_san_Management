import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

function HousekeepingDashboardPage() {
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [updating, setUpdating] = useState(false);
  const [apiFeedback, setApiFeedback] = useState({
    type: '',
    message: '',
  });

  useEffect(() => {
    document.title = 'Dashboard Buồng Phòng | Sương Mai Hotel';
  }, []);

  // Đánh dấu phòng đã dọn xong bằng API thật
  const markRoomCleanByCode = async () => {
    const code = roomCodeInput.trim();

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

  const handleMarkClean = (id) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'clean' } : r))
    );
  };

  const handleMarkDirty = (id) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'dirty' } : r))
    );
  };

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
      </main>
    </div>
  );
}

export default HousekeepingDashboardPage;
