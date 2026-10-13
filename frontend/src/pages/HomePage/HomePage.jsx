import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPaymentStatus } from '../../services/paymentService';
import HeroSection from '../../components/HeroSection/HeroSection';
import RoomSearchBar from '../../components/RoomSearchBar/RoomSearchBar';
import FeaturesSection from '../../components/FeaturesSection/FeaturesSection';
import FeaturedRooms from '../../components/FeaturedRooms/FeaturedRooms';
import PromotionsSection from '../../components/PromotionsSection/PromotionsSection';
import LocationSection from '../../components/LocationSection/LocationSection';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const [paymentNotice, setPaymentNotice] = useState(null);

  useEffect(() => {
    const payment = searchParams.get('payment');
    const bookingCode = searchParams.get('bookingCode');
    const orderCode = searchParams.get('orderCode');

    if (payment === 'success') {
      setPaymentNotice({
        type: 'success',
        bookingCode: bookingCode || '',
        message: 'Đặt phòng và thanh toán cọc thành công! Email xác nhận chi tiết đã được gửi tới hộp thư của quý khách.',
      });

      // Kích hoạt đồng bộ ngầm trạng thái thanh toán từ PayOS & gửi email xác nhận
      if (orderCode) {
        getPaymentStatus(orderCode).catch((err) =>
          console.warn('Lỗi đồng bộ trạng thái thanh toán từ PayOS:', err)
        );
      }

      window.history.replaceState({}, '', window.location.pathname);
    } else if (payment === 'cancel') {
      setPaymentNotice({
        type: 'cancel',
        bookingCode: bookingCode || '',
        message: 'Giao dịch thanh toán cọc đã bị hủy. Quý khách có thể chọn lại phòng và thử lại.',
      });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  return (
    <div className="w-full bg-background min-h-[calc(100vh-20rem)] relative">
      {paymentNotice && (
        <div
          className={`fixed top-20 right-4 z-50 max-w-md p-4 rounded-xl shadow-2xl border flex items-start gap-3 backdrop-blur-md transition-all ${
            paymentNotice.type === 'success'
              ? 'bg-[#1C3328]/95 text-white border-[#C5A059]/50 shadow-emerald-950/20'
              : 'bg-amber-900/95 text-white border-amber-500/40'
          }`}
        >
          <span className="material-symbols-outlined text-2xl mt-0.5 text-[#C5A059]">
            {paymentNotice.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <div className="flex-1 text-sm">
            <h4 className="font-bold text-[#C5A059] mb-1 font-headline">
              {paymentNotice.type === 'success' ? 'Đặt Phòng Thành Công' : 'Thanh Toán Chưa Hoàn Tất'}
            </h4>
            <p className="text-xs text-white/90 leading-relaxed">
              {paymentNotice.message}
            </p>
            {paymentNotice.bookingCode && (
              <p className="text-[11px] text-[#C5A059] mt-1.5 font-semibold">
                Mã đặt phòng: {paymentNotice.bookingCode}
              </p>
            )}
          </div>
          <button
            onClick={() => setPaymentNotice(null)}
            className="text-white/60 hover:text-white text-lg font-bold ml-1 leading-none"
            aria-label="Đóng thông báo"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-col w-full relative">
        <HeroSection />
        <RoomSearchBar />
        <FeaturesSection />
        <FeaturedRooms />
        <PromotionsSection />
        <LocationSection />
      </div>
    </div>
  );
};

export default HomePage;
