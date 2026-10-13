import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { createCheckoutPayment, redirectToPayOS } from '../../services/paymentService';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

const formatDate = (s) => {
  if (!s) return '—';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// ─── InvoiceModal ─────────────────────────────────────────────────────────────
export default function InvoiceModal({ isOpen, onClose, room, onPaymentConfirmed }) {
  const printRef = useRef(null);

  // Tab: 'invoice' | 'payment'
  const [tab, setTab] = useState('invoice');

  // Backend preview data
  const [invoiceData, setInvoiceData] = useState(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  // Payment state
  const [payMethod,      setPayMethod]      = useState('transfer');
  const [cashInput,      setCashInput]      = useState('');
  const [payDone,        setPayDone]        = useState(false);
  const [isPayOSLoading, setIsPayOSLoading] = useState(false);
  const [isCashLoading,  setIsCashLoading]  = useState(false);
  const [payOSError,     setPayOSError]     = useState('');

  useEffect(() => {
    let isMounted = true;
    if (!room?.bookingCode) return;
    setLoadingInvoice(true);
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    axios.get(`/api/bookings/${room.bookingCode}/invoice/preview`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    .then((res) => {
      if (isMounted) setInvoiceData(res.data);
    })
    .catch((err) => {
      console.warn('Không tải được invoice preview từ server:', err);
    })
    .finally(() => {
      if (isMounted) setLoadingInvoice(false);
    });
    return () => { isMounted = false; };
  }, [room?.bookingCode]);

  if (!room) return null;

  const roomTotal   = Number(invoiceData?.roomFee ?? room.roomFee ?? room.totalAmount ?? 0);
  const extraTotal  = Number(invoiceData?.serviceFee ?? room.serviceFee ?? 0);
  const grandTotal  = Number(invoiceData?.subtotal ?? (roomTotal + extraTotal));
  const alreadyPaid = Number(invoiceData?.depositDeducted ?? room.depositPaid ?? 0);
  const remaining   = Math.max(Number(invoiceData?.remainingAmount ?? (grandTotal - alreadyPaid)), 0);
  const services    = invoiceData?.serviceCharges || [];

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

  const handleConfirmPayment = async () => {
    setIsCashLoading(true);
    setPayOSError('');
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      await axios.post(
        `/api/bookings/${room.bookingCode}/invoice/pay`,
        { paymentMethod: 'TIEN_MAT' },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setPayDone(true);
      setTimeout(() => {
        if (onPaymentConfirmed) onPaymentConfirmed(room.id);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Lỗi thanh toán hóa đơn tiền mặt:', err);
      setPayOSError(err.response?.data?.message || err.message || 'Lỗi xử lý thanh toán tiền mặt');
      setIsCashLoading(false);
    }
  };

  const handlePayOSCheckout = async () => {
    setIsPayOSLoading(true);
    setPayOSError('');
    try {
      const res = await createCheckoutPayment({
        bookingCode: room.bookingCode,
        amount: remaining,
      });
      if (res?.checkoutUrl) {
        redirectToPayOS(res.checkoutUrl);
        return;
      }
      throw new Error('Không nhận được liên kết thanh toán từ cổng PayOS');
    } catch (err) {
      console.error('Lỗi PayOS checkout:', err);
      setPayOSError(err.response?.data?.message || err.message || 'Lỗi kết nối tới cổng thanh toán PayOS');
      setIsPayOSLoading(false);
    }
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
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    In hóa đơn
                  </Button>
                )}
                <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-alt hover:bg-border-custom flex items-center justify-center text-text-secondary hover:text-primary transition-colors">
                  <span className="font-bold text-base leading-none">✕</span>
                </button>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-border-custom">
              {[
                { key: 'invoice', label: 'Bảng kê hóa đơn' },
                { key: 'payment', label: 'Thanh toán' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors border-b-2 ${
                    tab === key
                      ? 'border-accent text-primary bg-background/50'
                      : 'border-transparent text-text-secondary hover:text-primary hover:bg-surface-alt'
                  }`}
                >
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
                          Tiền phòng {room.roomType} ({room.nights} đêm)
                        </td>
                        <td className="px-4 py-3 text-center text-text-secondary">{room.nights}</td>
                        <td className="px-4 py-3 text-right text-text-secondary">{formatVND(roomTotal / Math.max(room.nights, 1))}</td>
                        <td className="px-4 py-3 text-right font-bold text-primary">{formatVND(roomTotal)}</td>
                      </tr>
                      {services.length > 0 ? (
                        services.map((s, idx) => (
                          <tr key={idx} className="hover:bg-background/60 transition-colors">
                            <td className="px-4 py-3 text-text-primary">
                              {s.serviceName}
                            </td>
                            <td className="px-4 py-3 text-center text-text-secondary">{s.quantity}</td>
                            <td className="px-4 py-3 text-right text-text-secondary">
                              {formatVND(s.unitPrice)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-primary">
                              {formatVND(s.amount)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-center text-xs text-text-secondary italic">
                            Không có dịch vụ phát sinh thêm
                          </td>
                        </tr>
                      )}
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
                      <Button variant="primary" fullWidth onClick={() => setTab('payment')}>
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
                      <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-2xl text-emerald-700">
                        ✓
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
                                { key: 'cash',     label: 'Tiền mặt' },
                                { key: 'transfer', label: 'Chuyển khoản (VietQR / PayOS)' },
                              ].map(({ key, label }) => (
                                <button
                                  key={key}
                                  onClick={() => setPayMethod(key)}
                                  className={`flex flex-col items-center justify-center gap-1 p-4 rounded-xl border-2 transition-all ${
                                    payMethod === key
                                      ? 'border-accent bg-accent/10 text-primary'
                                      : 'border-border-custom bg-surface text-text-secondary hover:border-accent/50'
                                  }`}
                                >
                                  <span className="text-sm font-semibold">{label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Tiền mặt */}
                          {payMethod === 'cash' && (
                            <div className="space-y-3">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
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

                          {/* Chuyển khoản qua Cổng PayOS */}
                          {payMethod === 'transfer' && (
                            <div className="flex flex-col items-center gap-3.5 p-5 bg-surface-alt/50 rounded-2xl border border-border-custom text-center">
                              <div>
                                <p className="text-base font-bold text-primary">Cổng Thanh Toán Trực Tuyến PayOS (Dynamic VietQR)</p>
                                <p className="text-xs text-text-secondary mt-1 max-w-sm">
                                  Hệ thống chuyển hướng trực tiếp sang trang PayOS. Khách quét mã VietQR tự động qua ứng dụng bất kỳ ngân hàng nào, hoàn tất sẽ tự chuyển về lại hệ thống.
                                </p>
                              </div>

                              <div className="w-full bg-background rounded-xl p-3 border border-border-custom text-xs flex justify-between items-center">
                                <span className="text-text-secondary">Số tiền cần thanh toán:</span>
                                <span className="font-headline text-base font-bold text-accent">{formatVND(remaining)}</span>
                              </div>

                              {payOSError && (
                                <div className="w-full p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-danger-custom text-left">
                                  {payOSError}
                                </div>
                              )}

                              <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                isLoading={isPayOSLoading}
                                onClick={handlePayOSCheckout}
                              >
                                {isPayOSLoading ? 'Đang chuyển hướng sang PayOS…' : `Thanh toán qua Cổng PayOS (${formatVND(remaining)})`}
                              </Button>
                            </div>
                          )}
                        </>
                      )}

                      {/* Nút xác nhận cho tiền mặt hoặc xác nhận thủ công */}
                      <div className="pt-2 space-y-2">
                        {payMethod === 'cash' ? (
                          <>
                            {payOSError && (
                              <div className="w-full p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-danger-custom text-left mb-2">
                                {payOSError}
                              </div>
                            )}
                            <Button
                              variant="secondary"
                              size="lg"
                              fullWidth
                              isLoading={isCashLoading}
                              isDisabled={!canConfirm || isCashLoading}
                              onClick={handleConfirmPayment}
                            >
                              {isCashLoading ? 'Đang ghi nhận thanh toán…' : 'Xác nhận đã thu đủ tiền & Mở khóa trả phòng'}
                            </Button>
                            {!canConfirm && cashAmount > 0 && (
                              <p className="text-center text-[11px] text-danger-custom">
                                Số tiền khách đưa chưa đủ
                              </p>
                            )}
                            {!canConfirm && !cashInput && (
                              <p className="text-center text-[11px] text-text-secondary">
                                Nhập số tiền khách đưa để tiếp tục
                              </p>
                            )}
                          </>
                        ) : (
                          <div className="text-center pt-1">
                            <button
                              type="button"
                              onClick={handleConfirmPayment}
                              className="text-xs text-text-secondary hover:text-primary underline transition-colors"
                            >
                              Hoặc xác nhận đã nhận tiền chuyển khoản thủ công (không qua PayOS)
                            </button>
                          </div>
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
