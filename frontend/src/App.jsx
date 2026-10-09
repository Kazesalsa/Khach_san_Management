import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';
import HomePage from './pages/HomePage/HomePage';
import RoomsPage from './pages/RoomsPage/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage/RoomDetailPage';
import ServicesPage from './pages/ServicesPage/ServicesPage';
import LocationPage from './pages/LocationPage/LocationPage';
import { ToastProvider } from './components/ui/Toast';
import PriceListPage from './pages/PriceListPage/PriceListPage';

import AuthPage from './auth/AuthPage';
import SystemCheckPage from './pages/SystemCheckPage/SystemCheckPage';
import HousekeepingDashboardPage from './pages/HousekeepingDashboardPage/HousekeepingDashboardPage';
import RoomAvailabilityPage from './pages/RoomAvailabilityPage/RoomAvailabilityPage';
import './auth/auth.css';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/system-check" element={<SystemCheckPage />} />
          <Route path="/admin/price-lists" element={<PriceListPage />} />
          <Route path="/admin/housekeeping" element={<HousekeepingDashboardPage />} />
          <Route path="/rooms/available" element={<RoomAvailabilityPage />} />
          <Route path="/dang-nhap" element={<AuthPage key="login" mode="login" />} />
          <Route path="/dang-ky" element={<AuthPage key="register" mode="register" />} />
          <Route path="/quen-mat-khau" element={<AuthPage key="forgot" mode="forgot" />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            {/* Rooms and Booking routes */}
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
            
            {/* Other routes */}
            <Route path="/services" element={<ServicesPage />} />
            <Route
              path="/promotions"
              element={
                <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                  <h1 className="font-headline text-3xl font-bold text-primary mb-2">Ưu Đãi Đặc Quyền</h1>
                  <p className="text-text-secondary">Trang ưu đãi đang được cập nhật...</p>
                </div>
              }
            />
            <Route
              path="/location"
              element={<LocationPage />}
            />
            <Route
              path="/contact"
              element={
                <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                  <h1 className="font-headline text-3xl font-bold text-primary mb-2">Liên Hệ Concierge</h1>
                  <p className="text-text-secondary">Trang liên hệ đang được cập nhật...</p>
                </div>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
