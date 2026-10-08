import HeroSection from '../../components/HeroSection/HeroSection';
import RoomSearchBar from '../../components/RoomSearchBar/RoomSearchBar';
import FeaturesSection from '../../components/FeaturesSection/FeaturesSection';
import FeaturedRooms from '../../components/FeaturedRooms/FeaturedRooms';
import PromotionsSection from '../../components/PromotionsSection/PromotionsSection';
import LocationSection from '../../components/LocationSection/LocationSection';

const HomePage = () => {
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
