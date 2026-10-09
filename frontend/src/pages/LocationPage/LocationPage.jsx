import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { animate } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

// Sửa lỗi hiển thị icon marker mặc định của Leaflet trong React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

export default function LocationPage() {
    // Tọa độ Khách sạn Sương Mai - 18 Hàng Bè, Hoàn Kiếm, Hà Nội
    const latitude = 21.0326;
    const longitude = 105.8523;

    useEffect(() => {
        // Tạo hiệu ứng mượt mà khi vào trang theo chuẩn Framer Motion
        animate("#banner", { opacity: 1, y: [-20, 0] }, { duration: 0.8 });
        animate("#info-panel", { opacity: 1, x: [-50, 0] }, { duration: 0.6, delay: 0.2 });
        animate("#map-container", { opacity: 1, scale: [0.95, 1] }, { duration: 0.6, delay: 0.4 });
    }, []);

    return (
        <div className="bg-background font-sans text-text-primary min-h-screen">
            {/* BANNER TRANG VỊ TRÍ */}
            <div id="banner" className="w-full h-48 md:h-64 bg-cover bg-center relative flex items-center justify-center opacity-0"
                 style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=2000&auto=format&fit=crop')` }}>
                <div className="text-center text-white px-4">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-wide font-headline">Vị Trí & Bản Đồ</h1>
                    <p className="text-sm md:text-base text-gray-200">Hân hạnh được chào đón quý khách đến với Sương Mai Hotel</p>
                </div>
            </div>

            {/* BỐ CỤC CHÍNH */}
            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* KHỐI THÔNG TIN BÊN TRÁI */}
                <div id="info-panel" className="space-y-6 opacity-0">
                    {/* KHỐI THÔNG TIN LIÊN HỆ */}
                    <div className="bg-surface rounded-xl shadow-sm p-6 border border-border-custom">
                        <h2 className="text-2xl font-bold text-primary mb-4 font-headline">Khách Sạn Sương Mai</h2>
                        <div className="space-y-4 text-sm md:text-base text-text-secondary">
                            <p className="flex items-start">
                                <span className="mr-3 text-lg mt-0.5">📍</span>
                                <span><b>Địa chỉ:</b> Số 18 Phố Hàng Bè, Phường Hàng Bạc, Hoàn Kiếm, Hà Nội</span>
                            </p>
                            <p className="flex items-center">
                                <span className="mr-3 text-lg">📞</span>
                                <span><b>Số điện thoại:</b> 024.3828.1234</span>
                            </p>
                            <p className="flex items-center">
                                <span className="mr-3 text-lg">✉️</span>
                                <span><b>Email:</b> contact@suongmaihotel.com</span>
                            </p>
                            <p className="flex items-center">
                                <span className="mr-3 text-lg">⏰</span>
                                <span><b>Giờ làm việc:</b> Lễ tân 24/7</span>
                            </p>
                        </div>

                        {/* NÚT XEM ĐƯỜNG ĐI */}
                        <div className="mt-6">
                            <a href="https://maps.google.com/?q=18+Hang+Be+Hoan+Kiem+Hanoi" target="_blank" rel="noopener noreferrer" className="w-full bg-primary hover:bg-primary-dark text-text-on-dark font-medium py-3 px-4 rounded-lg block text-center transition shadow-sm">
                                Xem đường đi trên Google Maps ↗
                            </a>
                        </div>
                    </div>

                    {/* KHU VỰC ĐỊA ĐIỂM NỔI BẬT */}
                    <div className="bg-surface rounded-xl shadow-sm p-6 border border-border-custom">
                        <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
                            <span className="mr-2">🗺️</span> Điểm đến lân cận
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm bg-surface-alt p-3 rounded-lg">
                                <span className="font-medium text-text-primary">🌊 Hồ Hoàn Kiếm</span>
                                <span className="text-accent bg-accent/10 px-2.5 py-1 rounded-full text-xs font-semibold">Cách 350m</span>
                            </div>
                            <div className="flex justify-between items-center text-sm bg-surface-alt p-3 rounded-lg">
                                <span className="font-medium text-text-primary">🏮 Chợ đêm Hàng Đào</span>
                                <span className="text-accent bg-accent/10 px-2.5 py-1 rounded-full text-xs font-semibold">Cách 200m</span>
                            </div>
                            <div className="flex justify-between items-center text-sm bg-surface-alt p-3 rounded-lg">
                                <span className="font-medium text-text-primary">🎭 Nhà hát Lớn Hà Nội</span>
                                <span className="text-accent bg-accent/10 px-2.5 py-1 rounded-full text-xs font-semibold">Cách 1.2km</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KHU VỰC HIỂN THỊ BẢN ĐỒ */}
                <div id="map-container" className="lg:col-span-2 h-[400px] md:h-[600px] bg-surface rounded-xl shadow-sm border border-border-custom overflow-hidden relative opacity-0">
                    <MapContainer center={[latitude, longitude]} zoom={16} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[latitude, longitude]}>
                            <Popup>
                                <div className="text-center">
                                    <b className="text-primary text-sm block mb-1">Khách Sạn Sương Mai</b>
                                    <span className="text-text-secondary text-xs">Số 18 Hàng Bè, Hoàn Kiếm</span>
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>

            </div>
        </div>
    );
}
