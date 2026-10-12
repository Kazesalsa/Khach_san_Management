import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

// ─── Dữ liệu mẫu ─────────────────────────────────────────────────────────────
const ALL_DATA = [
  { date: '2026-10-01', dateLabel: '01/10', roomRevenue: 12400000, serviceRevenue: 1800000, bookings: 8,  roomType: 'Standard' },
  { date: '2026-10-02', dateLabel: '02/10', roomRevenue: 9800000,  serviceRevenue: 950000,  bookings: 6,  roomType: 'Deluxe Ban Công' },
  { date: '2026-10-03', dateLabel: '03/10', roomRevenue: 15600000, serviceRevenue: 2100000, bookings: 11, roomType: 'Standard' },
  { date: '2026-10-04', dateLabel: '04/10', roomRevenue: 18200000, serviceRevenue: 3200000, bookings: 13, roomType: 'Premier Suite' },
  { date: '2026-10-05', dateLabel: '05/10', roomRevenue: 21000000, serviceRevenue: 4100000, bookings: 15, roomType: 'Executive King' },
  { date: '2026-10-06', dateLabel: '06/10', roomRevenue: 17500000, serviceRevenue: 2800000, bookings: 12, roomType: 'Deluxe Ban Công' },
  { date: '2026-10-07', dateLabel: '07/10', roomRevenue: 23400000, serviceRevenue: 5200000, bookings: 17, roomType: 'Family Duplex' },
  { date: '2026-10-08', dateLabel: '08/10', roomRevenue: 19800000, serviceRevenue: 3100000, bookings: 14, roomType: 'Standard' },
  { date: '2026-10-09', dateLabel: '09/10', roomRevenue: 14200000, serviceRevenue: 1600000, bookings: 10, roomType: 'Premier Suite' },
  { date: '2026-10-10', dateLabel: '10/10', roomRevenue: 25600000, serviceRevenue: 4800000, bookings: 18, roomType: 'Executive King' },
  { date: '2026-10-11', dateLabel: '11/10', roomRevenue: 22100000, serviceRevenue: 3900000, bookings: 16, roomType: 'Deluxe Ban Công' },
  { date: '2026-10-12', dateLabel: '12/10', roomRevenue: 16800000, serviceRevenue: 2200000, bookings: 12, roomType: 'Standard' },
  { date: '2026-10-13', dateLabel: '13/10', roomRevenue: 28400000, serviceRevenue: 6100000, bookings: 20, roomType: 'Family Duplex' },
  { date: '2026-10-14', dateLabel: '14/10', roomRevenue: 31200000, serviceRevenue: 7200000, bookings: 22, roomType: 'Executive King' },
];

const ROOM_TYPES = ['Tất cả', 'Standard', 'Deluxe Ban Công', 'Premier Suite', 'Executive King', 'Family Duplex'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatVND = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(v);

const formatMillions = (v) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}tr` : v;

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border-custom bg-surface px-4 py-3 shadow-lg text-xs min-w-[180px]">
      <p className="font-bold text-primary mb-2">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="mt-1 flex justify-between gap-4">
          <span>{entry.name === 'roomRevenue' ? 'Tiền phòng' : entry.name === 'serviceRevenue' ? 'Dịch vụ' : 'Lượt thuê'}</span>
          <span className="font-bold">
            {entry.name === 'bookings' ? `${entry.value} lượt` : formatVND(entry.value)}
          </span>
        </p>
      ))}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RevenueDashboardPage() {
  useEffect(() => {
    document.title = 'Báo Cáo Doanh Thu | Sương Mai Hotel';
  }, []);

  const today    = new Date().toISOString().split('T')[0];
  const weekAgo  = new Date(Date.now() - 13 * 86400000).toISOString().split('T')[0];

  const [fromDate,    setFromDate]    = useState(weekAgo);
  const [toDate,      setToDate]      = useState(today);
  const [roomType,    setRoomType]    = useState('Tất cả');
  const [dateError,   setDateError]   = useState('');
  const [chartType,   setChartType]   = useState('bar');

  // Validate ngày
  const handleFromDate = (e) => {
    setFromDate(e.target.value);
    if (toDate && e.target.value > toDate) {
      setDateError('Ngày bắt đầu không được sau ngày kết thúc');
    } else {
      setDateError('');
    }
  };

  const handleToDate = (e) => {
    setToDate(e.target.value);
    if (fromDate && e.target.value < fromDate) {
      setDateError('Ngày kết thúc phải sau ngày bắt đầu');
    } else {
      setDateError('');
    }
  };

  // Lọc dữ liệu
  const filtered = useMemo(() => {
    return ALL_DATA.filter((d) => {
      const inRange = (!fromDate || d.date >= fromDate) && (!toDate || d.date <= toDate);
      const inType  = roomType === 'Tất cả' || d.roomType === roomType;
      return inRange && inType && !dateError;
    });
  }, [fromDate, toDate, roomType, dateError]);

  // KPI
  const kpi = useMemo(() => {
    const totalRoom    = filtered.reduce((s, d) => s + d.roomRevenue,    0);
    const totalService = filtered.reduce((s, d) => s + d.serviceRevenue, 0);
    const totalBooking = filtered.reduce((s, d) => s + d.bookings,       0);
    return {
      total:    totalRoom + totalService,
      room:     totalRoom,
      service:  totalService,
      bookings: totalBooking,
    };
  }, [filtered]);

  const sortedRooms = useMemo(() => {
    const map = {};
    filtered.forEach((d) => {
      if (!map[d.roomType]) map[d.roomType] = { type: d.roomType, bookings: 0, revenue: 0 };
      map[d.roomType].bookings += d.bookings;
      map[d.roomType].revenue  += d.roomRevenue + d.serviceRevenue;
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [filtered]);

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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Bộ lọc ── */}
        <section className="bg-surface rounded-2xl border border-border-custom shadow-sm p-5">
          <h2 className="font-headline text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-accent text-[20px]">filter_list</span>
            Bộ lọc thống kê
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Từ ngày */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-text-secondary font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-accent text-[15px]">calendar_today</span>
                Từ ngày
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={handleFromDate}
                className={`bg-white border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                  dateError ? 'border-danger-custom focus:border-danger-custom' : 'border-border-custom focus:border-accent'
                }`}
              />
            </div>

            {/* Đến ngày */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-text-secondary font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-accent text-[15px]">event</span>
                Đến ngày
              </label>
              <input
                type="date"
                value={toDate}
                onChange={handleToDate}
                className={`bg-white border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 ${
                  dateError ? 'border-danger-custom focus:border-danger-custom' : 'border-border-custom focus:border-accent'
                }`}
              />
            </div>

            {/* Loại phòng */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-text-secondary font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-accent text-[15px]">bed</span>
                Loại phòng
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="bg-white border border-border-custom rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Lỗi ngày */}
          {dateError && (
            <div className="mt-3 flex items-center gap-2 text-xs text-danger-custom font-semibold">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {dateError}
            </div>
          )}

          {!dateError && filtered.length > 0 && (
            <p className="mt-3 text-xs text-text-secondary">
              Hiển thị dữ liệu <strong className="text-primary">{filtered.length} ngày</strong>
              {roomType !== 'Tất cả' && <> · Loại phòng: <strong className="text-primary">{roomType}</strong></>}
            </p>
          )}
        </section>

        {/* ── 4 KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: 'payments',
              label: 'Tổng doanh thu',
              value: formatVND(kpi.total),
              sub: 'Phòng + Dịch vụ',
              color: 'text-primary',
              border: 'border-border-custom',
            },
            {
              icon: 'bed',
              label: 'Tiền phòng',
              value: formatVND(kpi.room),
              sub: `${filtered.length} ngày`,
              color: 'text-accent',
              border: 'border-accent/30',
            },
            {
              icon: 'room_service',
              label: 'Tiền dịch vụ',
              value: formatVND(kpi.service),
              sub: 'Dịch vụ phát sinh',
              color: 'text-success-custom',
              border: 'border-emerald-200',
            },
            {
              icon: 'calendar_month',
              label: 'Số lượt thuê',
              value: `${kpi.bookings} lượt`,
              sub: 'Trong kỳ lọc',
              color: 'text-primary',
              border: 'border-border-custom',
            },
          ].map(({ icon, label, value, sub, color, border }) => (
            <div key={label} className={`bg-surface rounded-2xl border ${border} shadow-sm p-5`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`material-symbols-outlined text-[20px] text-accent`}>{icon}</span>
                <p className="text-xs uppercase tracking-wider text-text-secondary">{label}</p>
              </div>
              <p className={`font-headline text-xl sm:text-2xl font-bold ${color} leading-tight`}>{value}</p>
              <p className="text-[11px] text-text-secondary mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Biểu đồ ── */}
        <section className="bg-surface rounded-2xl border border-border-custom shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-headline text-xl font-bold text-primary">Doanh Thu Theo Ngày</h2>
              <p className="text-sm text-text-secondary mt-1">Tiền phòng và dịch vụ theo thời gian đã lọc</p>
            </div>
            <div className="flex rounded-lg border border-border-custom overflow-hidden text-xs font-semibold shrink-0">
              {[
                { key: 'bar',  icon: 'bar_chart',  label: 'Cột' },
                { key: 'line', icon: 'show_chart', label: 'Đường' },
              ].map(({ key, icon, label }) => (
                <button
                  key={key}
                  onClick={() => setChartType(key)}
                  className={`px-3 py-2 transition-colors flex items-center gap-1 border-r border-border-custom last:border-r-0 ${
                    chartType === key ? 'bg-accent text-primary' : 'bg-surface text-text-secondary hover:bg-surface-alt'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3 text-center">
              <span className="material-symbols-outlined text-5xl text-text-secondary/30">bar_chart</span>
              <p className="font-headline text-lg font-bold text-primary">Không có dữ liệu</p>
              <p className="text-sm text-text-secondary max-w-xs">
                {dateError ? 'Vui lòng chỉnh lại khoảng ngày hợp lệ.' : 'Không có dữ liệu trong khoảng thời gian đã chọn.'}
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'bar' ? (
                <BarChart data={filtered} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDD6C9" vertical={false} />
                  <XAxis dataKey="dateLabel" tick={{ fontSize: 11, fill: '#667078' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={formatMillions} tick={{ fontSize: 11, fill: '#667078' }} axisLine={false} tickLine={false} width={48} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="roomRevenue"    name="roomRevenue"    fill="#C6A15B" radius={[4,4,0,0]} maxBarSize={36} stackId="a" />
                  <Bar dataKey="serviceRevenue" name="serviceRevenue" fill="#2F7D62" radius={[4,4,0,0]} maxBarSize={36} stackId="a" />
                </BarChart>
              ) : (
                <LineChart data={filtered} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDD6C9" vertical={false} />
                  <XAxis dataKey="dateLabel" tick={{ fontSize: 11, fill: '#667078' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={formatMillions} tick={{ fontSize: 11, fill: '#667078' }} axisLine={false} tickLine={false} width={48} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="roomRevenue"    name="roomRevenue"    stroke="#C6A15B" strokeWidth={2.5} dot={{ fill: '#C6A15B', r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="serviceRevenue" name="serviceRevenue" stroke="#2F7D62" strokeWidth={2.5} dot={{ fill: '#2F7D62', r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          )}

          {/* Legend */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-center gap-5 mt-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-accent inline-block" />Tiền phòng</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-success-custom inline-block" />Dịch vụ</span>
            </div>
          )}
        </section>

        {/* ── Bảng chi tiết theo loại phòng ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-headline text-2xl font-bold text-primary">Chi Tiết Theo Loại Phòng</h2>
              <p className="text-sm text-text-secondary mt-1">Doanh thu phân theo hạng phòng trong kỳ</p>
            </div>
            <Badge variant="gold" dot>{sortedRooms.length} loại phòng</Badge>
          </div>

          {sortedRooms.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-border-custom shadow-sm p-12 flex flex-col items-center text-center gap-3">
              <span className="material-symbols-outlined text-5xl text-text-secondary/30">bed</span>
              <h3 className="font-headline text-xl font-bold text-primary">Chưa có dữ liệu</h3>
              <p className="text-text-secondary text-sm">Điều chỉnh bộ lọc để xem dữ liệu chi tiết.</p>
            </div>
          ) : (
            <div className="bg-surface rounded-2xl border border-border-custom shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px]">
                  <thead className="bg-surface-alt/60">
                    <tr className="text-left">
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">Loại phòng</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary text-center">Lượt thuê</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary text-right">Doanh thu</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary text-right">Tỉ trọng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-custom">
                    {sortedRooms.map((r, idx) => {
                      const share = kpi.total > 0 ? ((r.revenue / kpi.total) * 100).toFixed(1) : '0.0';
                      return (
                        <tr key={r.type} className="hover:bg-background/70 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {idx === 0 && <span className="material-symbols-outlined text-[16px] text-accent">emoji_events</span>}
                              <span className="font-semibold text-primary">{r.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-text-secondary text-sm">{r.bookings}</td>
                          <td className="px-6 py-4 text-right font-bold text-success-custom">{formatVND(r.revenue)}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-sm font-semibold text-primary">{share}%</span>
                              <div className="w-16 h-1.5 rounded-full bg-border-custom overflow-hidden">
                                <div className="h-full rounded-full bg-accent" style={{ width: `${share}%` }} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="border-t-2 border-border-custom bg-surface-alt/40">
                    <tr>
                      <td className="px-6 py-4 font-bold text-primary text-sm" colSpan={2}>Tổng cộng</td>
                      <td className="px-6 py-4 text-right font-bold text-primary text-sm">{formatVND(kpi.total)}</td>
                      <td className="px-6 py-4 text-right font-bold text-primary text-sm">100%</td>
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
