import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

const formatDate = (s) => {
  if (!s) return '—';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Dịch vụ mẫu — thực tế lấy từ API theo bookingCode
const MOCK_SERVICES = [
  { id: 1, name: 'Buffet sáng (2 khách × 2 ngày)', quantity: 4, unitPrice: 0,      total: 0,       included: true },
  { id: 2, name: 'Dịch vụ giặt là',                quantity: 1, unitPrice: 150000, total: 150000,  included: false },
  { id: 3, name: 'Minibar - Nước suối & Snack',    quantity: 3, unitPrice: 45000,  total: 135000,  included: false },
  { id: 4, name: 'Dịch vụ Spa - Gói thư giãn 60p', quantity: 1, unitPrice: 450000, total: 450000, included: false },
];

// ─── InvoiceModal ─────────────────────────────────────────────────────────────
export default function InvoiceModal({ isOpen, onClose, room }) {
  const printRef = useRef(null);

  if (!room) return null;

  const services       = MOCK_SERVICES;
  const extraServices  = services.filter((s) => !s.included);
  const extraTotal     = extraServices.reduce((sum, s) => sum + s.total, 0);
  const roomTotal      = room.totalAmount;
  const depositPaid    = room.depositPaid;
  const grandTotal     = roomTotal + extraTotal;
  const alreadyPaid    = depositPaid;
  const remaining      = grandTotal - alreadyPaid;

  const handlePrint = () => {
    const content = printRef.current;
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="vi">
        <head>
          <meta charset="UTF-8" />
          <title>Hóa đơn ${room.bookingCode} | Sương Mai Hotel</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Segoe UI', sans-serif; color: #20262B; padding: 32px; font-size: 13px; }
            .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #C6A15B; padding-bottom: 16px; }
            .hotel-name { font-size: 22px; font-weight: 700; color: #132A3A; }
            .hotel-sub { font-size: 11px; color: #667078; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
            .invoice-title { font-size: 16px; font-weight: 600; margin-top: 8px; color: #C6A15B; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; margin: 20px 0; padding: 16px; background: #F8F5EE; border-radius: 8px; }
            .info-item { display: flex; flex-direction: column; gap: 2px; }
            .info-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #667078; font-weight: 600; }
            .info-value { font-weight: 600; color: #132A3A; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; }
            th { background: #132A3A; color: #F8F5EE; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
            td { padding: 9px 12px; border-bottom: 1px solid #DDD6C9; }
            tr:last-child td { border-bottom: none; }
            .included { color: #2F7D62; font-style: italic; }
            .total-section { margin-top: 16px; border-top: 2px solid #DDD6C9; padding-top: 12px; }
            .total-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; }
            .total-row.highlight { font-weight: 700; font-size: 15px; color: #132A3A; border-top: 1px solid #DDD6C9; padding-top: 10px; margin-top: 4px; }
            .total-row.paid { color: #2F7D62; }
            .total-row.remaining { color: ${remaining <= 0 ? '#2F7D62' : '#B54747'}; font-weight: 700; font-size: 18px; }
            .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #667078; border-top: 1px solid #DDD6C9; padding-top: 16px; }
            @media print { body { padding: 16px; } }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary-dark/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-surface rounded-2xl border border-border-custom shadow-2xl z-10 my-8 overflow-hidden"
          >
            {/* Top accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-accent via-accent-hover to-accent" />

            {/* Header */}
            <div className="px-6 py-4 border-b border-border-custom flex items-start justify-between gap-4 bg-background/50">
              <div>
                <h3 className="font-headline text-xl font-bold text-primary">Bảng Kê Hóa Đơn</h3>
                <p className="text-xs text-text-secondary mt-0.5">Phòng {room.roomNumber} · {room.bookingCode}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" iconLeft="print" onClick={handlePrint}>
                  In hóa đơn
                </Button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-surface-alt hover:bg-border-custom flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Nội dung có thể scroll */}
            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">

              {/* Phần in ấn */}
              <div ref={printRef}>
                {/* Header hóa đơn */}
                <div className="header text-center mb-6 pb-5 border-b-2 border-accent">
                  <p className="hotel-name font-headline text-2xl font-bold text-primary">Sương Mai Hotel</p>
                  <p className="hotel-sub text-[10px] uppercase tracking-[0.2em] text-text-secondary mt-1">Indochine Elegance & Hospitality</p>
                  <p className="invoice-title text-base font-semibold text-accent mt-2">HÓA ĐƠN THANH TOÁN</p>
                </div>

                {/* Thông tin booking */}
                <div className="info-grid grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 p-4 bg-surface-alt/40 rounded-xl border border-border-custom text-xs">
                  {[
                    { label: 'Mã đặt phòng', value: room.bookingCode },
                    { label: 'Khách lưu trú', value: room.guestName },
                    { label: 'Số phòng',      value: `${room.roomNumber} - ${room.roomType}` },
                    { label: 'Số điện thoại', value: room.phone },
                    { label: 'Nhận phòng',    value: formatDate(room.checkIn) },
                    { label: 'Trả phòng',     value: formatDate(room.checkOut) },
                    { label: 'Số đêm',        value: `${room.nights} đêm` },
                    { label: 'Số khách',      value: `${room.adults} NL${room.children > 0 ? ` · ${room.children} TE` : ''}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="info-item flex flex-col gap-0.5">
                      <span className="info-label text-[10px] uppercase tracking-wider text-text-secondary font-semibold">{label}</span>
                      <span className="info-value font-bold text-primary">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Bảng dịch vụ */}
                <table className="w-full text-sm mb-1">
                  <thead>
                    <tr className="bg-primary text-text-on-dark">
                      <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-semibold rounded-tl-xl">Dịch vụ / Hạng mục</th>
                      <th className="px-4 py-3 text-center text-[11px] uppercase tracking-wider font-semibold">SL</th>
                      <th className="px-4 py-3 text-right text-[11px] uppercase tracking-wider font-semibold">Đơn giá</th>
                      <th className="px-4 py-3 text-right text-[11px] uppercase tracking-wider font-semibold rounded-tr-xl">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-custom">
                    {/* Tiền phòng */}
                    <tr className="bg-accent/5">
                      <td className="px-4 py-3 font-bold text-primary">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-accent text-[16px]">bed</span>
                          Tiền phòng {room.roomType} ({room.nights} đêm)
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-text-secondary">{room.nights}</td>
                      <td className="px-4 py-3 text-right text-text-secondary">{formatVND(roomTotal / room.nights)}</td>
                      <td className="px-4 py-3 text-right font-bold text-primary">{formatVND(roomTotal)}</td>
                    </tr>

                    {/* Dịch vụ */}
                    {services.map((s) => (
                      <tr key={s.id} className="hover:bg-background/60 transition-colors">
                        <td className="px-4 py-3 text-text-primary">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-text-secondary text-[15px]">room_service</span>
                            {s.name}
                            {s.included && (
                              <Badge variant="success" size="sm">Đã bao gồm</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-text-secondary">{s.quantity}</td>
                        <td className="px-4 py-3 text-right text-text-secondary">
                          {s.included ? <span className="included text-success-custom italic text-xs">Miễn phí</span> : formatVND(s.unitPrice)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {s.included
                            ? <span className="text-success-custom">—</span>
                            : <span className="text-primary">{formatVND(s.total)}</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Tổng kết */}
                <div className="total-section mt-4 pt-4 border-t-2 border-border-custom space-y-2">
                  <div className="total-row flex justify-between text-sm text-text-secondary">
                    <span>Tiền phòng</span>
                    <span className="font-semibold text-primary">{formatVND(roomTotal)}</span>
                  </div>
                  <div className="total-row flex justify-between text-sm text-text-secondary">
                    <span>Dịch vụ phát sinh</span>
                    <span className="font-semibold text-primary">{formatVND(extraTotal)}</span>
                  </div>
                  <div className="total-row highlight flex justify-between text-sm font-bold text-primary border-t border-border-custom pt-2 mt-1">
                    <span>Tổng cộng</span>
                    <span className="font-headline text-lg">{formatVND(grandTotal)}</span>
                  </div>
                  <div className="total-row paid flex justify-between text-sm text-success-custom">
                    <span>Đã thanh toán trước (cọc)</span>
                    <span className="font-semibold">− {formatVND(alreadyPaid)}</span>
                  </div>

                  {/* Số tiền cuối cùng */}
                  <div className={`flex justify-between items-center mt-3 p-4 rounded-xl border-2 ${
                    remaining <= 0
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-accent/10 border-accent/40'
                  }`}>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wide ${remaining <= 0 ? 'text-success-custom' : 'text-primary'}`}>
                        {remaining <= 0 ? '✓ Đã thanh toán đầy đủ' : 'Số tiền khách cần trả thêm'}
                      </p>
                      {remaining <= 0 && (
                        <p className="text-[11px] text-text-secondary mt-0.5">Khách không cần thanh toán thêm</p>
                      )}
                    </div>
                    <span className={`font-headline text-2xl font-bold ${remaining <= 0 ? 'text-success-custom' : 'text-accent'}`}>
                      {remaining <= 0 ? formatVND(0) : formatVND(remaining)}
                    </span>
                  </div>
                </div>

                {/* Footer hóa đơn */}
                <div className="footer mt-6 pt-4 border-t border-border-custom text-center text-[11px] text-text-secondary space-y-1">
                  <p className="font-semibold text-primary">Sương Mai Hotel — Indochine Elegance & Hospitality</p>
                  <p>Cảm ơn Quý khách đã lưu trú. Hẹn gặp lại!</p>
                  <p className="text-[10px]">In lúc: {new Date().toLocaleString('vi-VN')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
