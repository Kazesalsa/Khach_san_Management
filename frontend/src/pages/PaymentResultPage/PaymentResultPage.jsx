import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { getPaymentStatus } from '../../services/paymentService';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const orderCode = searchParams.get('orderCode');
  const bookingCodeParam = searchParams.get('bookingCode');
  const typeParam = searchParams.get('type') || 'DEPOSIT'; // 'DEPOSIT' | 'CHECKOUT'
  const isCancelled = searchParams.get('cancel') === 'true' || searchParams.get('status') === 'CANCELLED';
  const paramStatus = searchParams.get('status');
  const paramCode = searchParams.get('code');

  useEffect(() => {
    document.title = 'Kết Quả Thanh Toán PayOS | Sương Mai Hotel';

    const verifyStatus = async () => {
      if (isCancelled) {
        setLoading(false);
        addToast({
          title: 'Đã hủy thanh toán',
          message: 'Quý khách đã hủy giao dịch trên cổng thanh toán PayOS.',
          type: 'warning',
          duration: 4000,
        });
        return;
      }

      if (orderCode) {
        try {
          const res = await getPaymentStatus(orderCode);
          setPaymentInfo(res);
          if (res.status === 'PAID') {
            addToast({
              title: 'Thanh toán thành công!',
              message: `Đã xác nhận giao dịch qua PayOS cho mã đặt phòng ${res.bookingCode || bookingCodeParam}.`,
              type: 'success',
              duration: 5000,
            });
          }
        } catch (err) {
          console.warn('Lỗi kiểm tra trạng thái thanh toán từ backend:', err);
          // Fallback dựa trên params từ PayOS
          if (paramStatus === 'PAID' || paramCode === '00') {
            setPaymentInfo({
              status: 'PAID',
              orderCode: orderCode,
              bookingCode: bookingCodeParam,
              message: 'Thanh toán thành công qua PayOS',
            });
            addToast({
              title: 'Thanh toán thành công!',
              message: 'Giao dịch qua PayOS đã hoàn tất thành công.',
              type: 'success',
              duration: 5000,
            });
          }
        }
      } else if (paramStatus === 'PAID' || paramCode === '00') {
        setPaymentInfo({
          status: 'PAID',
          bookingCode: bookingCodeParam,
          message: 'Thanh toán thành công qua PayOS',
        });
      }
      setLoading(false);
    };

    verifyStatus();
  }, [orderCode, bookingCodeParam, isCancelled, paramStatus, paramCode]);

  const isSuccess = !isCancelled && (paymentInfo?.status === 'PAID' || paramStatus === 'PAID' || paramCode === '00');
  const bookingCode = paymentInfo?.bookingCode || bookingCodeParam || '—';
  const amount = paymentInfo?.amount;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      {/* Top Header Breadcrumb */}
      <div className="border-b border-border-custom bg-surface">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-text-secondary">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="font-semibold text-primary">Kết quả thanh toán PayOS</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-4 py-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-surface rounded-3xl border border-border-custom shadow-xl overflow-hidden"
        >
          {/* Top colored accent line */}
          <div
            className={`h-2 w-full ${
              isSuccess
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600'
                : 'bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500'
            }`}
          />

          <div className="p-8 sm:p-10 flex flex-col items-center text-center">
            {loading ? (
              <div className="py-12 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                <p className="text-sm font-semibold text-text-secondary">Đang kiểm tra và đồng bộ trạng thái thanh toán từ PayOS...</p>
              </div>
            ) : isSuccess ? (
              /* Success Card */
              <>
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 border-2 border-emerald-300 shadow-inner">
                  <span className="material-symbols-outlined text-[44px]">verified</span>
                </div>

                <Badge variant="success" className="mb-3 px-3 py-1 text-xs">
                  Giao dịch hoàn tất qua PayOS
                </Badge>

                <h1 className="font-headline text-2xl sm:text-3xl font-bold text-primary mb-2">
                  {typeParam === 'CHECKOUT' ? 'Quyết Toán Hóa Đơn Thành Công!' : 'Xác Nhận Giữ Phòng Thành Công!'}
                </h1>

                <p className="text-sm text-text-secondary leading-relaxed max-w-md mb-6">
                  {typeParam === 'CHECKOUT'
                    ? 'Hệ thống đã ghi nhận khoản thanh toán hóa đơn trả phòng. Thủ tục check-out đã sẵn sàng hoàn tất.'
                    : 'Khoản tiền đặt cọc giữ phòng của quý khách đã được ghi nhận qua cổng ngân hàng PayOS. Kính chúc quý khách kỳ nghỉ tuyệt vời!'}
                </p>

                {/* Ticket Receipt Info */}
                <div className="w-full bg-surface-alt/60 rounded-2xl border border-border-custom p-5 mb-6 text-left text-xs space-y-3">
                  <div className="flex justify-between items-center pb-2.5 border-b border-border-custom/50">
                    <span className="text-text-secondary uppercase font-semibold">Mã đặt phòng:</span>
                    <span className="font-headline text-base font-bold text-accent">{bookingCode}</span>
                  </div>

                  {orderCode && (
                    <div className="flex justify-between items-center pb-2.5 border-b border-border-custom/50">
                      <span className="text-text-secondary uppercase font-semibold">Mã giao dịch PayOS:</span>
                      <span className="font-mono font-bold text-primary">#{orderCode}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pb-2.5 border-b border-border-custom/50">
                    <span className="text-text-secondary uppercase font-semibold">Phương thức:</span>
                    <span className="font-semibold text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-accent">qr_code_scanner</span>
                      Chuyển khoản VietQR (PayOS Gateway)
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-2.5 border-b border-border-custom/50">
                    <span className="text-text-secondary uppercase font-semibold">Trạng thái:</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">check_circle</span>
                      Đã thanh toán (PAID)
                    </span>
                  </div>

                  {amount && (
                    <div className="flex justify-between items-center pt-1 text-sm">
                      <span className="text-primary font-bold uppercase">Số tiền thanh toán:</span>
                      <span className="font-headline text-xl font-bold text-accent">{formatVND(amount)}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  {typeParam === 'CHECKOUT' ? (
                    <>
                      <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => navigate('/admin/checkout')}
                        iconLeft="logout"
                      >
                        Quay lại Danh sách Trả phòng
                      </Button>
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => navigate('/')}
                        iconLeft="home"
                      >
                        Về trang chủ
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => navigate('/rooms')}
                        iconLeft="bed"
                      >
                        Xem thêm phòng khác
                      </Button>
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => navigate('/')}
                        iconLeft="home"
                      >
                        Về trang chủ
                      </Button>
                    </>
                  )}
                </div>
              </>
            ) : (
              /* Cancelled or Error State */
              <>
                <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-5 border-2 border-amber-300">
                  <span className="material-symbols-outlined text-[44px]">pending_actions</span>
                </div>

                <Badge variant="warning" className="mb-3 px-3 py-1 text-xs">
                  Giao dịch chưa hoàn tất
                </Badge>

                <h1 className="font-headline text-2xl font-bold text-primary mb-2">
                  Bạn Đã Hủy Hoặc Chưa Thanh Toán
                </h1>

                <p className="text-sm text-text-secondary leading-relaxed max-w-md mb-6">
                  Giao dịch trên cổng PayOS đã bị hủy hoặc chưa nhận được tiền. Nếu quý khách đã chuyển khoản, hệ thống sẽ tự động cập nhật sau vài giây.
                </p>

                {bookingCode && bookingCode !== '—' && (
                  <div className="w-full bg-surface-alt/60 rounded-xl border border-border-custom p-4 mb-6 text-left text-xs flex justify-between items-center">
                    <span className="text-text-secondary">Mã đặt phòng liên kết:</span>
                    <strong className="font-headline text-sm font-bold text-primary">{bookingCode}</strong>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate(-1)}
                    iconLeft="arrow_back"
                  >
                    Quay lại thử lại
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/')}
                    iconLeft="home"
                  >
                    Về trang chủ
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer copyright */}
      <footer className="text-center py-6 text-xs text-text-secondary border-t border-border-custom/50">
        Khách sạn Sương Mai · Tích hợp cổng thanh toán trực tuyến bảo mật bởi PayOS
      </footer>
    </div>
  );
}
