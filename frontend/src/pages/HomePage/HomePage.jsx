import { useEffect } from 'react';
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

  useEffect(() => {
    const payment = searchParams.get('payment');
    const orderCode = searchParams.get('orderCode');

    // Nếu vừa thanh toán cọc PayOS, đồng bộ ngầm để CSDL đổi DA_DAT và gửi mail (không hiện pop-up/log)
    if (payment === 'success' && orderCode) {
      getPaymentStatus(orderCode).catch((err) =>
        console.warn('Lỗi đồng bộ trạng thái thanh toán từ PayOS:', err)
      );
    }

    if (payment) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  return (
    <div className="w-full bg-background min-h-[calc(100vh-20rem)]">
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
