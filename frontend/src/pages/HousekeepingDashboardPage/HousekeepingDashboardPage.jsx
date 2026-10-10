import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

// Dữ liệu mẫu — sau này thay bằng API call
const INITIAL_ROOMS = [
  { id: 1, number: '101', type: 'Standard', floor: 1, status: 'dirty' },
  { id: 2, number: '102', type: 'Standard', floor: 1, status: 'dirty' },
  { id: 3, number: '201', type: 'Deluxe', floor: 2, status: 'dirty' },
  { id: 4, number: '202', type: 'Deluxe', floor: 2, status: 'dirty' },
  { id: 5, number: '301', type: 'Suite', floor: 3, status: 'dirty' },
  { id: 6, number: '103', type: 'Standard', floor: 1, status: 'dirty' },
  { id: 7, number: '203', type: 'Deluxe', floor: 2, status: 'dirty' },
  { id: 8, number: '302', type: 'Suite', floor: 3, status: 'dirty' },
];

function HousekeepingDashboardPage() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);

  useEffect(() => {
    document.title = 'Dashboard Nhân viên Buồng phòng | Sương Mai Hotel';
  }, []);

  const dirtyRooms = rooms.filter((r) => r.status === 'dirty');
  const cleanRooms = rooms.filter((r) => r.status === 'clean');

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
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-accent text-xs font-bold uppercase tracking-[0.2em]">
            Sương Mai Hotel
          </p>
          <h1 className="font-headline text-3xl font-bold mt-1">
            Dashboard Nhân Viên Buồng Phòng
          </h1>
          <p className="text-text-on-dark/70 text-sm mt-2">
            Quản lý trạng thái dọn dẹp các phòng trong khách sạn
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-6">
            <p className="text-xs uppercase tracking-wider text-text-secondary">
              Tổng phòng
            </p>
            <p className="font-headline text-3xl font-bold text-primary mt-1">
              {rooms.length}
            </p>
          </div>
          <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-6">
            <p className="text-xs uppercase tracking-wider text-text-secondary">
              Chưa dọn
            </p>
            <p className="font-headline text-3xl font-bold text-danger-custom mt-1">
              {dirtyRooms.length}
            </p>
          </div>
          <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-6">
            <p className="text-xs uppercase tracking-wider text-text-secondary">
              Đã dọn xong
            </p>
            <p className="font-headline text-3xl font-bold text-success-custom mt-1">
              {cleanRooms.length}
            </p>
          </div>
        </div>

        {/* Danh sách phòng chưa dọn */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-headline text-2xl font-bold text-primary">
                Phòng Chưa Dọn
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                {dirtyRooms.length} phòng cần được dọn dẹp
              </p>
            </div>
          </div>

          {dirtyRooms.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-success-custom">
                check_circle
              </span>
              <p className="font-headline text-xl font-bold text-primary mt-3">
                Tất cả phòng đã được dọn sạch!
              </p>
              <p className="text-text-secondary text-sm mt-1">
                Không còn phòng nào cần dọn dẹp.
              </p>
            </div>
          ) : (
            <div className="bg-surface rounded-2xl border border-border-custom shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px]">
                  <thead className="bg-surface-alt/60">
                    <tr className="text-left">
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                        Số phòng
                      </th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                        Loại phòng
                      </th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                        Tầng
                      </th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-custom">
                    {dirtyRooms.map((room) => (
                      <tr
                        key={room.id}
                        className="hover:bg-background/70 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-primary">
                          {room.number}
                        </td>
                        <td className="px-6 py-4 text-text-primary">
                          {room.type}
                        </td>
                        <td className="px-6 py-4 text-text-secondary">
                          Tầng {room.floor}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="danger" dot>
                            Chưa dọn
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="secondary"
                            size="sm"
                            iconLeft="check_circle"
                            onClick={() => handleMarkClean(room.id)}
                          >
                            Đã dọn xong
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Danh sách phòng đã dọn */}
        {cleanRooms.length > 0 && (
          <section>
            <div className="mb-4">
              <h2 className="font-headline text-2xl font-bold text-primary">
                Phòng Đã Dọn Xong
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                {cleanRooms.length} phòng đã hoàn thành
              </p>
            </div>

            <div className="bg-surface rounded-2xl border border-border-custom shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px]">
                  <thead className="bg-surface-alt/60">
                    <tr className="text-left">
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                        Số phòng
                      </th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                        Loại phòng
                      </th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                        Tầng
                      </th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-custom">
                    {cleanRooms.map((room) => (
                      <tr
                        key={room.id}
                        className="hover:bg-background/70 transition-colors opacity-75"
                      >
                        <td className="px-6 py-4 font-bold text-primary">
                          {room.number}
                        </td>
                        <td className="px-6 py-4 text-text-primary">
                          {room.type}
                        </td>
                        <td className="px-6 py-4 text-text-secondary">
                          Tầng {room.floor}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="success" dot>
                            Đã dọn sạch
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            iconLeft="undo"
                            onClick={() => handleMarkDirty(room.id)}
                          >
                            Đánh dấu lại
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default HousekeepingDashboardPage;
