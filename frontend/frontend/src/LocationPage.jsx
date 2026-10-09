import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { animate } from 'motion';
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
    const latitude = 10.8672;
    const longitude = 106.7725;

    useEffect(() => {
        // Tạo hiệu ứng mượt mà khi vào trang theo chuẩn Framer Motion
        animate("#banner", { opacity: 1, y: [-20, 0] }, { duration: 0.8 });
        animate("#info-panel", { opacity: 1, x: [-50, 0] }, { duration: 0.6, delay: 0.2 });
        animate("#map-container", { opacity: 1, scale: [0.95, 1] }, { duration: 0.6, delay: 0.4 });
    }, []);

    return (
        <div className="bg-gray-50 font-sans text-gray-800 min-h-screen">
            {/* BANNER TRANG VỊ TRÍ */}
            <div id="banner" className="w-full h-48 md:h-64 bg-cover bg-center relative flex items-center justify-center"
                 style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://unsplash.com')` }}>
                <div className="text-center text-white px-4">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-wide">Vị Trí & Bản Đồ</h1>
                    <p className="text-sm md:text-base text-gray-200">Hân hạnh được chào đón quý khách đến với Sương Mai Hotel</p>
                </div>
            </div>

            {/* BỐ CỤC CHÍNH */}
            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* KHỐI THÔNG TIN BÊN TRÁI */}
                <div id="info-panel" className="space-y-6">
                    {/* KHỐI THÔNG TIN LIÊN HỆ */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-2xl font-bold text-blue-900 mb-4">Khách Sạn Sương Mai</h2>
                        <div className="space-y-4 text-sm md:text-base">
                            <p className="flex items-start">
                                <span className="mr-3 text-lg mt-0.5">📍</span>
                                <span><b>Địa chỉ:</b> 123 Đường Số 1, Phường Linh Xuân, Thủ Đức, TP. HCM</span>
                            </p>
                            <p className="flex items-center">
                                <span className="mr-3 text-lg">📞</span>
                                <span><b>Số điện thoại:</b> +84 28 1234 5678</span>
                            </p>
                            <p className="flex items-center">
                                <span className="mr-3 text-lg">✉️</span>
                                <span><b>Email:</b> contact@suongmaihotel.com</span>
                            </p>
                            <p className="flex items-center">
                                <span className="mr-3 text-lg">⏰</span>
                                <span><b>Giờ làm việc:</b> Mở cửa cả ngày (24/7)</span>
                            </p>
                        </div>

                        {/* NÚT XEM ĐƯỜNG ĐI */}
                        <div className="mt-6">
                            <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg block text-center transition shadow-sm">
                                Xem đường đi trên Google Maps ↗
                            </a>
                        </div>
                    </div>

                    {/* KHU VỰC ĐỊA ĐIỂM NỔI BẬT */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <span className="mr-2">🗺️</span> Địa điểm lân cận nổi bật
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
                                <span className="font-medium text-gray-700">🛒 Chợ Linh Xuân</span>
                                <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-semibold">Cách 500m</span>
                            </div>
                            <div className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
                                <span className="font-medium text-gray-700">🎓 Đại học Quốc Gia TP.HCM</span>
                                <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-semibold">Cách 2.0km</span>
                            </div>
                            <div className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
                                <span className="font-medium text-gray-700">🚌 Bến xe Miền Đông Mới</span>
                                <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-semibold">Cách 4.5km</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KHU VỰC HIỂN THỊ BẢN ĐỒ */}
                <div id="map-container" className="lg:col-span-2 h-[400px] md:h-[600px] bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden relative">
                    <MapContainer center={[latitude, longitude]} zoom={15} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[latitude, longitude]}>
                            <Popup>
                                <div className="text-center">
                                    <b className="text-blue-900 text-sm block mb-1">Khách Sạn Sương Mai</b>
                                    <span className="text-gray-600 text-xs">Rất hân hạnh được phục vụ!</span>
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>

            </div>
        </div>
    );
}
