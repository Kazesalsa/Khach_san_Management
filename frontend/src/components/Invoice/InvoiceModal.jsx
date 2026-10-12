import { useRef, useState } from 'react';
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

const MOCK_SERVICES = [
  { id: 1, name: 'Buffet sáng (2 khách × 2 ngày)', quantity: 4, unitPrice: 0,      total: 0,       included: true },
  { id: 2, name: 'Dịch vụ giặt là',                quantity: 1, unitPrice: 150000, total: 150000,  included: false },
  { id: 3, name: 'Minibar - Nước suối & Snack',    quantity: 3, unitPrice: 45000,  total: 135000,  included: false },
  { id: 4, name: 'Dịch vụ Spa - Gói thư giãn 60p', quantity: 1, unitPrice: 450000, total: 450000, included: false },
];

// ─── InvoiceModal ─────────────────────────────────────────────────────────────
export default function InvoiceModal({ isOpen, onClose, room, onPaymentConfirmed }) {
  const printRef = useRef(null);

  // Tab: 'invoice' | 'payment'
  const [tab, setTab] = useState('invoice');

  // Payment state
  const [payMethod,   setPayMethod]   = useState('cash'); // 'cash' | 'transfer'
  const [cashInput,   setCashInput]   = useState('');
  const [payDone,     setPayDone]     = useState(false);

  if (!room) return null;

  const services      = MOCK_SERVICES;
  const extraServices = services.filter((s) => !s.included);
  const extraTotal    = extraServices.reduce((sum, s) => sum + s.total, 0);
  const roomTotal     = room.totalAmount;
  const grandTotal    = roomTotal + extraTotal;
  const alreadyPaid   = room.depositPaid;
  const remaining     = grandTotal - alreadyPaid;

  // Tiền thừa
  const cashAmount  = Number(cashInput.replace(/\D/g, '')) || 0;
  const changeBack  = cashAmount - remaining;

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
            .info-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #667078; font-weight: 600; }
            .info-value { font-weight: 600; color: #132A3A; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; }
            th { background: #132A3A; color: #F8F5EE; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
            td { padding: 9px 12px; border-bottom: 1px solid #DDD6C9; }
            tr:last-child td { border-bottom: none; }
            .total-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; }
            .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #667078; border-top: 1px solid #DDD6C9; padding-top: 16px; }
            @media print { body { padding: 16px; } }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 400);
  };

  const handleConfirmPayment = () => {
    setPayDone(true);
    setTimeout(() => {
      if (onPaymentConfirmed) onPaymentConfirmed(room.id);
      onClose();
    }, 2000);
  };

  const canConfirm = remaining <= 0 || (payMethod === 'cash' && cashAmount >= remaining);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary-dark/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-surface rounded-2xl border border-border-custom shadow-2xl z-10 my-8 overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-accent via-accent-hover to-accent" />

            {/* Header */}
            <div className="px-6 py-4 border-b border-border-custom flex items-start justify-between gap-4 bg-background/50">
              <div>
                <h3 className="font-headline text-xl font-bold text-primary">Hóa Đơn & Thanh Toán</h3>
                <p className="text-xs text-text-secondary mt-0.5">Phòng {room.roomNumber} · {room.bookingCode}</p>
              </div>
              <div className="flex items-center gap-2">
                {tab === 'invoice' && (
                  <Button variant="outline" size="sm" iconLeft="print" onClick={handlePrint}>
                    In hóa đơn
                  </Button>
                )}
                <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-alt hover:bg-border-custom flex items-center justify-center text-text-secondary hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-border-custom">
              {[
                { key: 'invoice', label: 'Bảng kê hóa đơn', icon: 'receipt_long' },
                { key: 'payment', label: 'Thanh toán',       icon: 'payments' },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors border-b-2 ${
                    tab === key
                      ? 'border-accent text-primary bg-background/50'
                      : 'border-transparent text-text-secondary hover:text-primary hover:bg-surface-alt'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  {label}
                  {key === 'payment' && remaining > 0 && !payDone && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">

              {/* ── TAB: HÓA ĐƠN ── */}
              {tab === 'invoice' && (
                <div ref={printRef}>
                  {/* Header in ấn */}
                  <div className="text-center mb-6 pb-5 border-b-2 border-accent">
                    <p className="font-headline text-2xl font-bold text-primary">Sương Mai Hotel</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mt-1">Indochine Elegance & Hospitality</p>
                    <p className="text-base font-semibold text-accent mt-2">HÓA ĐƠN THANH TOÁN</p>
                  </div>

                  {/* Thông tin booking */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 p-4 bg-surface-alt/40 rounded-xl border border-border-custom text-xs">
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
                      <div key={label} className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">{label}</span>
                        <span className="font-bold text-primary">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bảng dịch vụ */}
                  <table className="w-full text-sm mb-1">
                    <thead>
                      <tr className="bg-primary text-text-on-dark">
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-semibold">Dịch vụ / Hạng mục</th>
                        <th className="px-4 py-3 text-center text-[11px] uppercase tracking-wider font-semibold">SL</th>
                        <th className="px-4 py-3 text-right text-[11px] uppercase tracking-wider font-semibold">Đơn giá</th>
                        <th className="px-4 py-3 text-right text-[11px] uppercase tracking-wider font-semibold">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-custom">
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
                      {services.map((s) => (
                        <tr key={s.id} className="hover:bg-background/60 transition-colors">
                          <td className="px-4 py-3 text-text-primary">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-text-secondary text-[15px]">room_service</span>
                              {s.name}
                              {s.included && <Badge variant="success" size="sm">Đã bao gồm</Badge>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-text-secondary">{s.quantity}</td>
                          <td className="px-4 py-3 text-right text-text-secondary">
                            {s.included ? <span className="text-success-custom italic text-xs">Miễn phí</span> : formatVND(s.unitPrice)}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {s.included ? <span className="text-success-custom">—</span> : <span className="text-primary">{formatVND(s.total)}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Tổng kết */}
                  <div className="mt-4 pt-4 border-t-2 border-border-custom space-y-2">
                    <div className="flex justify-between text-sm text-text-secondary">
                      <span>Tiền phòng</span>
                      <span className="font-semibold text-primary">{formatVND(roomTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-text-secondary">
                      <span>Dịch vụ phát sinh</span>
                      <span className="font-semibold text-primary">{formatVND(extraTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-primary border-t border-border-custom pt-2 mt-1">
                      <span>Tổng cộng</span>
                      <span className="font-headline text-lg">{formatVND(grandTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-success-custom">
                      <span>Đã thanh toán trước (cọc)</span>
                      <span className="font-semibold">− {formatVND(alreadyPaid)}</span>
                    </div>
                    <div className={`flex justify-between items-center mt-3 p-4 rounded-xl border-2 ${remaining <= 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-accent/10 border-accent/40'}`}>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wide ${remaining <= 0 ? 'text-success-custom' : 'text-primary'}`}>
                          {remaining <= 0 ? '✓ Đã thanh toán đầy đủ' : 'Số tiền khách cần trả thêm'}
                        </p>
                        {remaining <= 0 && <p className="text-[11px] text-text-secondary mt-0.5">Khách không cần thanh toán thêm</p>}
                      </div>
                      <span className={`font-headline text-2xl font-bold ${remaining <= 0 ? 'text-success-custom' : 'text-accent'}`}>
                        {remaining <= 0 ? formatVND(0) : formatVND(remaining)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border-custom text-center text-[11px] text-text-secondary space-y-1">
                    <p className="font-semibold text-primary">Sương Mai Hotel — Indochine Elegance & Hospitality</p>
                    <p>Cảm ơn Quý khách đã lưu trú. Hẹn gặp lại!</p>
                    <p className="text-[10px]">In lúc: {new Date().toLocaleString('vi-VN')}</p>
                  </div>

                  {/* Nút chuyển sang thanh toán */}
                  {remaining > 0 && (
                    <div className="mt-5">
                      <Button variant="primary" fullWidth iconLeft="payments" onClick={() => setTab('payment')}>
                        Tiến hành thu tiền
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB: THANH TOÁN ── */}
              {tab === 'payment' && (
                <div className="space-y-5">
                  {payDone ? (
                    /* Success */
                    <div className="flex flex-col items-center text-center py-8 gap-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[36px] text-emerald-700">check_circle</span>
                      </div>
                      <h4 className="font-headline text-xl font-bold text-primary">Thu tiền thành công!</h4>
                      <p className="text-sm text-text-secondary">
                        Đã thu đủ tiền từ <strong className="text-primary">{room.guestName}</strong>.<br />
                        Nút trả phòng đã được mở khóa.
                      </p>
                      <Badge variant="success" dot>Thanh toán hoàn tất</Badge>
                    </div>
                  ) : (
                    <>
                      {/* Số tiền cần thu */}
                      <div className={`p-4 rounded-xl border-2 text-center ${remaining <= 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-accent/10 border-accent/40'}`}>
                        <p className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">
                          {remaining <= 0 ? 'Đã thanh toán đầy đủ' : 'Số tiền cần thu'}
                        </p>
                        <p className={`font-headline text-3xl font-bold ${remaining <= 0 ? 'text-success-custom' : 'text-accent'}`}>
                          {formatVND(Math.max(remaining, 0))}
                        </p>
                      </div>

                      {remaining > 0 && (
                        <>
                          {/* Chọn hình thức */}
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Hình thức thanh toán</p>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { key: 'cash',     icon: 'payments',      label: 'Tiền mặt' },
                                { key: 'transfer', icon: 'account_balance', label: 'Chuyển khoản' },
                              ].map(({ key, icon, label }) => (
                                <button
                                  key={key}
                                  onClick={() => setPayMethod(key)}
                                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                                    payMethod === key
                                      ? 'border-accent bg-accent/10 text-primary'
                                      : 'border-border-custom bg-surface text-text-secondary hover:border-accent/50'
                                  }`}
                                >
                                  <span className={`material-symbols-outlined text-[28px] ${payMethod === key ? 'text-accent' : ''}`}>{icon}</span>
                                  <span className="text-sm font-semibold">{label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Tiền mặt */}
                          {payMethod === 'cash' && (
                            <div className="space-y-3">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-accent text-[16px]">payments</span>
                                  Số tiền khách đưa
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Nhập số tiền..."
                                    value={cashInput ? Number(cashInput.replace(/\D/g, '')).toLocaleString('vi-VN') : ''}
                                    onChange={(e) => setCashInput(e.target.value.replace(/\D/g, ''))}
                                    className="w-full bg-white border border-border-custom rounded-xl px-4 py-3 text-base font-bold text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                                  />
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-secondary font-semibold">₫</span>
                                </div>
                                {/* Gợi ý nhanh */}
                                <div className="flex gap-2 flex-wrap">
                                  {[remaining, Math.ceil(remaining / 100000) * 100000, Math.ceil(remaining / 500000) * 500000].filter((v, i, a) => a.indexOf(v) === i).map((v) => (
                                    <button
                                      key={v}
                                      onClick={() => setCashInput(String(v))}
                                      className="text-[11px] px-2.5 py-1 rounded-lg bg-surface-alt border border-border-custom hover:border-accent hover:bg-accent/10 text-text-secondary hover:text-primary transition-colors font-semibold"
                                    >
                                      {formatVND(v)}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Tiền thừa */}
                              {cashAmount > 0 && (
                                <div className={`flex justify-between items-center p-3.5 rounded-xl border ${
                                  changeBack >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                                }`}>
                                  <span className="text-sm font-semibold text-text-secondary">
                                    {changeBack >= 0 ? 'Tiền thừa trả lại' : 'Còn thiếu'}
                                  </span>
                                  <span className={`font-headline text-xl font-bold ${changeBack >= 0 ? 'text-success-custom' : 'text-danger-custom'}`}>
                                    {formatVND(Math.abs(changeBack))}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Chuyển khoản */}
                          {payMethod === 'transfer' && (
                            <div className="flex flex-col items-center gap-3 p-5 bg-surface-alt/40 rounded-xl border border-border-custom">
                              <span className="material-symbols-outlined text-[48px] text-text-secondary/40">qr_code_2</span>
                              <p className="text-sm font-semibold text-primary">Mã QR chuyển khoản</p>
                              <p className="text-xs text-text-secondary text-center max-w-xs">
                                Tính năng quét mã QR ngân hàng đang được phát triển. Vui lòng kiểm tra thủ công hoặc dùng tiền mặt.
                              </p>
                              <Badge variant="warning">Chức năng sắp ra mắt</Badge>
                            </div>
                          )}
                        </>
                      )}

                      {/* Nút xác nhận */}
                      <div className="pt-2 space-y-2">
                        <Button
                          variant="secondary"
                          size="lg"
                          fullWidth
                          iconLeft="check_circle"
                          isDisabled={!canConfirm}
                          onClick={handleConfirmPayment}
                        >
                          Xác nhận đã thu đủ tiền & Mở khóa trả phòng
                        </Button>
                        {!canConfirm && payMethod === 'cash' && cashAmount > 0 && (
                          <p className="text-center text-[11px] text-danger-custom flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            Số tiền khách đưa chưa đủ
                          </p>
                        )}
                        {!canConfirm && !cashInput && payMethod === 'cash' && (
                          <p className="text-center text-[11px] text-text-secondary flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">info</span>
                            Nhập số tiền khách đưa để tiếp tục
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
