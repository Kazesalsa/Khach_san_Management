import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

// ─── Dữ liệu mẫu ───────────────────────────────────────────────────────────
const REVENUE_BY_DAY = [
  { date: '01/10', revenue: 12400000, bookings: 8 },
  { date: '02/10', revenue: 9800000,  bookings: 6 },
  { date: '03/10', revenue: 15600000, bookings: 11 },
  { date: '04/10', revenue: 18200000, bookings: 13 },
  { date: '05/10', revenue: 21000000, bookings: 15 },
  { date: '06/10', revenue: 17500000, bookings: 12 },
  { date: '07/10', revenue: 23400000, bookings: 17 },
  { date: '08/10', revenue: 19800000, bookings: 14 },
  { date: '09/10', revenue: 14200000, bookings: 10 },
  { date: '10/10', revenue: 25600000, bookings: 18 },
  { date: '11/10', revenue: 22100000, bookings: 16 },
  { date: '12/10', revenue: 16800000, bookings: 12 },
  { date: '13/10', revenue: 28400000, bookings: 20 },
  { date: '14/10', revenue: 31200000, bookings: 22 },
];

const REVENUE_BY_ROOM_TYPE = [
  {
    id: 1,
    type: 'Standard',
    rooms: 10,
    bookings: 48,
    occupancyRate: 85,
    avgPrice: 1200000,
    totalRevenue: 57600000,
    trend: 'up',
  },
  {
    id: 2,
    type: 'Deluxe Ban Công',
    rooms: 8,
    bookings: 35,
    occupancyRate: 78,
    avgPrice: 1800000,
    totalRevenue: 63000000,
    trend: 'up',
  },
  {
    id: 3,
    type: 'Premier Suite',
    rooms: 5,
    bookings: 20,
    occupancyRate: 71,
    avgPrice: 2800000,
    totalRevenue: 56000000,
    trend: 'down',
  },
  {
    id: 4,
    type: 'Executive King',
    rooms: 4,
    bookings: 18,
    occupancyRate: 80,
    avgPrice: 3500000,
    totalRevenue: 63000000,
    trend: 'up',
  },
  {
    id: 5,
    type: 'Family Duplex',
    rooms: 3,
    bookings: 12,
    occupancyRate: 71,
    avgPrice: 4200000,
    totalRevenue: 50400000,
    trend: 'stable',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatVND = (value) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

const formatMillions = (value) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}tr`;
  return value;
};

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    return JSON.parse(raw || 'null');
  } catch {
    return null;
  }
};

// ─── Custom Tooltip cho biểu đồ ──────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border-custom bg-surface px-4 py-3 shadow-lg text-xs">
      <p className="font-bold text-primary mb-2">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="mt-1">
          {entry.name === 'revenue' ? 'Doanh thu: ' : 'Lượt đặt: '}
          <span className="font-bold">
            {entry.name === 'revenue' ? formatVND(entry.value) : `${entry.value} phòng`}
          </span>
        </p>
      ))}
    </div>
  );
};

// ─── Component chính ──────────────────────────────────────────────────────────
export default function RevenueDashboardPage() {
  useEffect(() => {
    document.title = 'Báo Cáo Doanh Thu | Sương Mai Hotel';
  }, []);

  const [chartType, setChartType] = useState('bar'); // 'bar' | 'line'
  const [period, setPeriod] = useState('month');     // 'week' | 'month'

  const displayData = period === 'week' ? REVENUE_BY_DAY.slice(-7) : REVENUE_BY_DAY;

  const stats = useMemo(() => {
    const totalRevenue = REVENUE_BY_ROOM_TYPE.reduce((s, r) => s + r.totalRevenue, 0);
    const totalBookings = REVENUE_BY_ROOM_TYPE.reduce((s, r) => s + r.bookings, 0);
    const avgOccupancy = Math.round(
      REVENUE_BY_ROOM_TYPE.reduce((s, r) => s + r.occupancyRate, 0) / REVENUE_BY_ROOM_TYPE.length
    );
    const topType = [...REVENUE_BY_ROOM_TYPE].sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
    return { totalRevenue, totalBookings, avgOccupancy, topType };
  }, []);

  const sortedRooms = [...REVENUE_BY_ROOM_TYPE].sort((a, b) => b.totalRevenue - a.totalRevenue);
  const totalRev = stats.totalRevenue;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-text-on-dark border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-accent text-xs font-bold uppercase tracking-[0.2em]">Sương Mai Hotel</p>
              <h1 className="font-headline text-2xl sm:text-3xl font-bold mt-1">Báo Cáo Doanh Thu</h1>
              <p className="text-text-on-dark/70 text-sm mt-2">Biểu đồ doanh thu và chi tiết theo từng loại phòng</p>
            </div>
            <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 sm:px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 shrink-0">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="hidden sm:inline">Về trang chủ</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-accent text-[20px]">payments</span>
              <p className="text-xs uppercase tracking-wider text-text-secondary">Tổng doanh thu</p>
            </div>
            <p className="font-headline text-2xl font-bold text-primary">{formatVND(stats.totalRevenue)}</p>
            <p className="text-[11px] text-success-custom mt-1 font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +12.4% so với tháng trước
            </p>
          </div>

          <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-accent text-[20px]">calendar_month</span>
              <p className="text-xs uppercase tracking-wider text-text-secondary">Tổng lượt đặt</p>
            </div>
            <p className="font-headline text-2xl font-bold text-primary">{stats.totalBookings}</p>
            <p className="text-[11px] text-success-custom mt-1 font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +8 lượt so với tháng trước
            </p>
          </div>

          <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-accent text-[20px]">hotel</span>
              <p className="text-xs uppercase tracking-wider text-text-secondary">Tỉ lệ lấp đầy</p>
            </div>
            <p className="font-headline text-2xl font-bold text-primary">{stats.avgOccupancy}%</p>
            <p className="text-[11px] text-text-secondary mt-1">Trung bình toàn khách sạn</p>
          </div>

          <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-accent text-[20px]">emoji_events</span>
              <p className="text-xs uppercase tracking-wider text-text-secondary">Phòng dẫn đầu</p>
            </div>
            <p className="font-headline text-lg font-bold text-primary leading-tight">{stats.topType.type}</p>
            <p className="text-[11px] text-success-custom mt-1 font-semibold">{formatVND(stats.topType.totalRevenue)}</p>
          </div>
        </div>

        {/* Biểu đồ */}
        <section className="bg-surface rounded-2xl border border-border-custom shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-headline text-xl font-bold text-primary">
                Doanh Thu Theo Ngày
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Biểu đồ thể hiện doanh thu tăng giảm theo thời gian
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Period toggle */}
              <div className="flex rounded-lg border border-border-custom overflow-hidden text-xs font-semibold">
                <button
                  onClick={() => setPeriod('week')}
                  className={`px-3 py-1.5 transition-colors ${
                    period === 'week'
                      ? 'bg-primary text-text-on-dark'
                      : 'bg-surface text-text-secondary hover:bg-surface-alt'
                  }`}
                >
                  7 ngày
                </button>
                <button
                  onClick={() => setPeriod('month')}
                  className={`px-3 py-1.5 transition-colors border-l border-border-custom ${
                    period === 'month'
                      ? 'bg-primary text-text-on-dark'
                      : 'bg-surface text-text-secondary hover:bg-surface-alt'
                  }`}
                >
                  14 ngày
                </button>
              </div>

              {/* Chart type toggle */}
              <div className="flex rounded-lg border border-border-custom overflow-hidden text-xs font-semibold">
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1.5 transition-colors flex items-center gap-1 ${
                    chartType === 'bar'
                      ? 'bg-accent text-primary'
                      : 'bg-surface text-text-secondary hover:bg-surface-alt'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">bar_chart</span>
                  Cột
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1.5 transition-colors border-l border-border-custom flex items-center gap-1 ${
                    chartType === 'line'
                      ? 'bg-accent text-primary'
                      : 'bg-surface text-text-secondary hover:bg-surface-alt'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">show_chart</span>
                  Đường
                </button>
              </div>
            </div>
          </div>

          {displayData.length === 0 ? (
            <EmptyState
              icon="bar_chart"
              title="Chưa có dữ liệu doanh thu"
              desc="Doanh thu sẽ hiển thị khi có dữ liệu đặt phòng."
            />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              {chartType === 'bar' ? (
                <BarChart data={displayData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDD6C9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#667078' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatMillions}
                    tick={{ fontSize: 11, fill: '#667078' }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="revenue"
                    name="revenue"
                    fill="#C6A15B"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              ) : (
                <LineChart data={displayData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDD6C9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#667078' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatMillions}
                    tick={{ fontSize: 11, fill: '#667078' }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="revenue"
                    stroke="#C6A15B"
                    strokeWidth={2.5}
                    dot={{ fill: '#C6A15B', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          )}
        </section>

        {/* Bảng chi tiết */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-headline text-2xl font-bold text-primary">
                Chi Tiết Theo Loại Phòng
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Doanh thu và tỉ lệ lấp đầy của từng hạng phòng
              </p>
            </div>
            <Badge variant="gold" dot>
              {REVENUE_BY_ROOM_TYPE.length} loại phòng
            </Badge>
          </div>

          {sortedRooms.length === 0 ? (
            <EmptyState
              icon="bed"
              title="Chưa có dữ liệu loại phòng"
              desc="Dữ liệu chi tiết sẽ hiển thị khi có doanh thu từ các loại phòng."
            />
          ) : (
            <div className="bg-surface rounded-2xl border border-border-custom shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-surface-alt/60">
                    <tr className="text-left">
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">Loại phòng</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary text-center">Số phòng</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary text-center">Lượt đặt</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary text-center">Lấp đầy</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary text-right">Giá TB / đêm</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary text-right">Doanh thu</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary text-right">Tỉ trọng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-custom">
                    {sortedRooms.map((room, idx) => {
                      const share = ((room.totalRevenue / totalRev) * 100).toFixed(1);
                      return (
                        <tr key={room.id} className="hover:bg-background/70 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              {idx === 0 && (
                                <span className="material-symbols-outlined text-[16px] text-accent">emoji_events</span>
                              )}
                              <span className="font-semibold text-primary">{room.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-text-secondary text-sm">{room.rooms}</td>
                          <td className="px-6 py-4 text-center text-text-secondary text-sm">{room.bookings}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`text-sm font-semibold ${room.occupancyRate >= 80 ? 'text-success-custom' : room.occupancyRate >= 65 ? 'text-amber-600' : 'text-danger-custom'}`}>
                                {room.occupancyRate}%
                              </span>
                              {/* Progress bar */}
                              <div className="w-16 h-1.5 rounded-full bg-border-custom overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${room.occupancyRate >= 80 ? 'bg-success-custom' : room.occupancyRate >= 65 ? 'bg-amber-500' : 'bg-danger-custom'}`}
                                  style={{ width: `${room.occupancyRate}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-text-secondary">{formatVND(room.avgPrice)}</td>
                          <td className="px-6 py-4 text-right font-bold text-success-custom">{formatVND(room.totalRevenue)}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-sm font-semibold text-primary">{share}%</span>
                              <div className="w-16 h-1.5 rounded-full bg-border-custom overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-accent"
                                  style={{ width: `${share}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* Footer tổng */}
                  <tfoot className="border-t-2 border-border-custom bg-surface-alt/40">
                    <tr>
                      <td className="px-6 py-4 font-bold text-primary text-sm" colSpan={5}>
                        Tổng cộng
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-primary text-sm">
                        {formatVND(totalRev)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-primary text-sm">
                        100%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ icon, title, desc }) {
  return (
    <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-12 flex flex-col items-center text-center gap-3">
      <span className="material-symbols-outlined text-5xl text-text-secondary/30">{icon}</span>
      <h3 className="font-headline text-xl font-bold text-primary">{title}</h3>
      <p className="text-text-secondary text-sm max-w-sm">{desc}</p>
    </div>
  );
}
