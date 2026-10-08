import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ROOMS_DATA } from '../../data/roomsData';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Tooltip from '../../components/ui/Tooltip';
import DatePicker from '../../components/ui/DatePicker';
import { RoomDetailSkeleton } from '../../components/ui/SkeletonLoader';
import { ConnectionErrorState } from '../../components/Rooms/EmptyState';
import BookingConfirmModal from '../../components/Rooms/BookingConfirmModal';
import { useToast } from '../../components/ui/Toast';

const RoomDetailPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Find room data
  const currentRoom =
    ROOMS_DATA.find((r) => r.id === roomId || r.slug === roomId) || ROOMS_DATA[0];

  // Active image in gallery
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Dynamic booking state
  const [checkInDate, setCheckInDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    return tomorrow.toISOString().split('T')[0];
  });
  const [guestsCount, setGuestsCount] = useState(2);

  // Modals & Prototype Toggles
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasConnectionError, setHasConnectionError] = useState(false);

  // Calculate nights
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 1;
    const d1 = new Date(checkInDate);
    const d2 = new Date(checkOutDate);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const nights = calculateNights();
  const dateError = nights <= 0 ? 'Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 đêm' : '';

  // Financial calculations
  const pricePerNight = currentRoom?.pricing?.price || 1200000;
  const totalPrice = nights > 0 ? pricePerNight * nights : pricePerNight;
  const depositPercent = currentRoom?.pricing?.depositPercent || 30;
  const depositAmount = Math.round((totalPrice * depositPercent) / 100);

  const formatVND = (num) => new Intl.NumberFormat('vi-VN').format(num) + '₫';

  // Prototype toggle helper
  const handleSimulateReload = () => {
    setIsLoading(true);
    setHasConnectionError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  if (hasConnectionError) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 lg:px-8 py-12">
        <Breadcrumb
          items={[
            { label: 'Phòng & Bảng giá', to: '/rooms' },
            { label: 'Lỗi kết nối' },
          ]}
        />
        <ConnectionErrorState onRetry={() => setHasConnectionError(false)} />
      </div>
    );
  }

  if (isLoading) {
    return <RoomDetailSkeleton />;
  }

  return (
    <div className="w-full bg-background min-h-screen pb-24 pt-20">
      
      {/* Top Meta Bar: Breadcrumb & Prototype Toolbar */}
      <div className="bg-surface border-b border-border-custom shadow-sm sticky top-20 z-30">
        <div className="max-w-[1360px] mx-auto px-4 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
          <Breadcrumb
            items={[
              { label: 'Phòng & Bảng giá', to: '/rooms' },
              { label: currentRoom.name },
            ]}
          />

          {/* Prototype Controls: Reload / Test error */}
          <div className="flex items-center gap-2 text-xs py-1">
            <button
              type="button"
              onClick={handleSimulateReload}
              className="text-text-secondary hover:text-primary transition-colors flex items-center gap-1 font-medium bg-surface-alt px-2.5 py-1 rounded"
              title="Mô phỏng Skeleton Loading"
            >
              <span className="material-symbols-outlined text-[15px]">refresh</span>
              <span>Tải lại</span>
            </button>
            <button
              type="button"
              onClick={() => setHasConnectionError(true)}
              className="text-text-secondary hover:text-danger-custom transition-colors flex items-center gap-1 font-medium bg-surface-alt px-2.5 py-1 rounded"
              title="Mô phỏng Lỗi kết nối mạng"
            >
              <span className="material-symbols-outlined text-[15px]">wifi_off</span>
              <span>Test Lỗi kết nối</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 lg:px-8 pt-6">
        
        {/* Navigation Action Bar: Back button */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/rooms')}
            iconLeft="arrow_back"
          >
            Quay lại danh sách phòng
          </Button>

          <div className="flex items-center gap-2">
            <Tooltip content="Chia sẻ liên kết hạng phòng này">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  addToast({
                    title: 'Đã sao chép liên kết',
                    message: 'Đường dẫn phòng đã được lưu vào khay nhớ tạm.',
                    type: 'info',
                  });
                }}
                className="w-9 h-9 rounded-lg bg-surface border border-border-custom hover:border-accent text-text-secondary hover:text-primary flex items-center justify-center transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Room Header Strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="gold" size="sm" icon="hotel_class">
                Indochine Signature
              </Badge>
              <Badge variant="navy" size="sm">
                {currentRoom.status.text}
              </Badge>
              <span className="text-xs text-text-secondary font-medium">
                {currentRoom.floor}
              </span>
            </div>

            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
              {currentRoom.name}
            </h1>
            <p className="text-xs sm:text-sm uppercase tracking-wider text-text-secondary font-semibold mt-1">
              {currentRoom.nameEn}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span
                  className="material-symbols-outlined text-accent text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="font-headline text-xl font-bold text-primary">
                  {currentRoom.rating}
                </span>
                <span className="text-xs text-text-secondary font-semibold">/ 5.0</span>
              </div>
              <span className="text-xs text-text-secondary">
                Dựa trên {currentRoom.reviewsCount} đánh giá xác thực
              </span>
            </div>
          </div>
        </motion.div>

        {/* Photo Gallery Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-10"
        >
          {/* Main Hero Photo */}
          <div
            onClick={() => setIsLightboxOpen(true)}
            className="lg:col-span-8 relative aspect-[16/10] rounded-2xl overflow-hidden shadow-md border border-border-custom cursor-pointer group"
          >
            <img
              src={currentRoom.images[activeImageIndex]?.url}
              alt={currentRoom.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span className="font-medium bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                {currentRoom.images[activeImageIndex]?.caption}
              </span>
              <span className="bg-primary/90 text-accent font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10">
                <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                <span>Phóng to</span>
              </span>
            </div>
          </div>

          {/* Thumbnails Column */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3">
            {currentRoom.images.slice(0, 3).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer border transition-all ${
                  activeImageIndex === idx
                    ? 'border-accent ring-2 ring-accent shadow-md'
                    : 'border-border-custom hover:border-accent/60 opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Layout: 8 cols Details + 4 cols Sticky Booking Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left Column (8 cols): Story, Specs, Amenities, Policies, Reviews */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            
            {/* Core Specs Highlights Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-surface border border-border-custom shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">square_foot</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-secondary block">
                    Diện tích
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {currentRoom.specs.area} m²
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">bed</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-secondary block">
                    Giường ngủ
                  </span>
                  <span className="text-sm font-bold text-primary truncate max-w-[120px] block" title={currentRoom.specs.bed}>
                    {currentRoom.specs.bed.split('(')[0]}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">group</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-secondary block">
                    Sức chứa
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {currentRoom.specs.guestsLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">hot_tub</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-secondary block">
                    Tiện ích tắm
                  </span>
                  <span className="text-sm font-bold text-primary truncate max-w-[120px] block" title={currentRoom.specs.tub}>
                    {currentRoom.specs.tub.split('(')[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Narrative Story Description */}
            <div className="bg-surface rounded-2xl border border-border-custom p-6 sm:p-8 shadow-sm">
              <span className="text-[11px] uppercase tracking-widest text-accent font-bold block mb-2">
                Không Gian Di Sản
              </span>
              <h2 className="font-headline text-2xl font-bold text-primary mb-4">
                Hòa mình trong không gian kiến trúc Đông Dương quyến rũ
              </h2>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-4">
                {currentRoom.fullDescription}
              </p>
              
              <div className="p-4 rounded-xl bg-surface-alt/50 border border-border-custom/60 flex items-center gap-3 mt-4">
                <span className="material-symbols-outlined text-accent text-[22px] shrink-0">
                  auto_awesome
                </span>
                <span className="text-xs text-primary font-medium">
                  <strong>Đặc quyền khách lưu trú:</strong> {currentRoom.pricing.perks[0]}
                </span>
              </div>
            </div>

            {/* Amenities Section Categorized */}
            <div className="bg-surface rounded-2xl border border-border-custom p-6 sm:p-8 shadow-sm">
              <span className="text-[11px] uppercase tracking-widest text-accent font-bold block mb-2">
                Tiện Nghi Cao Cấp
              </span>
              <h2 className="font-headline text-2xl font-bold text-primary mb-6">
                Trang thiết bị chuẩn mực 5 sao
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bedroom */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border-custom/60">
                    <span className="material-symbols-outlined text-accent text-[20px]">
                      bed
                    </span>
                    <h3 className="font-headline text-base font-bold text-primary">
                      Phòng ngủ & Nghỉ ngơi
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {currentRoom.amenitiesCategorized.bedroom.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                        <span className="material-symbols-outlined text-accent text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bathroom */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border-custom/60">
                    <span className="material-symbols-outlined text-accent text-[20px]">
                      bathtub
                    </span>
                    <h3 className="font-headline text-base font-bold text-primary">
                      Phòng tắm & Thư giãn
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {currentRoom.amenitiesCategorized.bathroom.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                        <span className="material-symbols-outlined text-accent text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technology */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border-custom/60">
                    <span className="material-symbols-outlined text-accent text-[20px]">
                      tv
                    </span>
                    <h3 className="font-headline text-base font-bold text-primary">
                      Công nghệ & Tiện ích
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {currentRoom.amenitiesCategorized.technology.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                        <span className="material-symbols-outlined text-accent text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Services */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border-custom/60">
                    <span className="material-symbols-outlined text-accent text-[20px]">
                      room_service
                    </span>
                    <h3 className="font-headline text-base font-bold text-primary">
                      Dịch vụ & Ẩm thực
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {currentRoom.amenitiesCategorized.services.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                        <span className="material-symbols-outlined text-accent text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Room Policies Section */}
            <div className="bg-surface rounded-2xl border border-border-custom p-6 sm:p-8 shadow-sm">
              <span className="text-[11px] uppercase tracking-widest text-accent font-bold block mb-2">
                Quy Định & Chính Sách
              </span>
              <h2 className="font-headline text-2xl font-bold text-primary mb-6">
                Chính sách lưu trú minh bạch
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-text-secondary">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-alt/40 border border-border-custom/50">
                  <span className="material-symbols-outlined text-accent text-[22px] shrink-0">
                    schedule
                  </span>
                  <div>
                    <h4 className="font-bold text-primary uppercase tracking-wider mb-1">
                      Giờ nhận & trả phòng
                    </h4>
                    <p>Nhận phòng từ: <strong>{currentRoom.policies.checkIn}</strong></p>
                    <p>Trả phòng trước: <strong>{currentRoom.policies.checkOut}</strong></p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-alt/40 border border-border-custom/50">
                  <span className="material-symbols-outlined text-accent text-[22px] shrink-0">
                    event_repeat
                  </span>
                  <div>
                    <h4 className="font-bold text-primary uppercase tracking-wider mb-1">
                      Chính sách hủy phòng
                    </h4>
                    <p>{currentRoom.policies.cancellation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-alt/40 border border-border-custom/50">
                  <span className="material-symbols-outlined text-accent text-[22px] shrink-0">
                    payments
                  </span>
                  <div>
                    <h4 className="font-bold text-primary uppercase tracking-wider mb-1">
                      Chính sách đặt cọc
                    </h4>
                    <p>{currentRoom.policies.deposit}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-alt/40 border border-border-custom/50">
                  <span className="material-symbols-outlined text-accent text-[22px] shrink-0">
                    family_restroom
                  </span>
                  <div>
                    <h4 className="font-bold text-primary uppercase tracking-wider mb-1">
                      Trẻ em & Thú cưng
                    </h4>
                    <p>{currentRoom.policies.children}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Reviews */}
            <div className="bg-surface rounded-2xl border border-border-custom p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-accent font-bold block mb-1">
                    Đánh Giá Khách Hàng
                  </span>
                  <h2 className="font-headline text-2xl font-bold text-primary">
                    Trải nghiệm thực tế tại phòng
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-headline text-2xl font-bold text-primary">
                    {currentRoom.rating}
                  </span>
                  <div className="flex text-accent">
                    {Array.from({ length: 5 }, (_, idx) => (
                      <span
                        key={idx}
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-text-secondary">
                    ({currentRoom.reviewsCount} bài đánh giá)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {currentRoom.reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-surface-alt/30 border border-border-custom/60 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-primary">{rev.author}</span>
                      <span className="text-[11px] text-text-secondary">{rev.date}</span>
                    </div>
                    <p className="text-xs text-text-secondary italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Sticky Dynamic Booking Widget */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-surface rounded-2xl border border-border-custom shadow-xl p-6 flex flex-col gap-5">
              
              {/* Price Display */}
              <div className="flex items-baseline justify-between pb-4 border-b border-border-custom">
                <div>
                  <span className="text-[11px] text-text-secondary uppercase font-semibold block">
                    Giá tham khảo
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-headline text-3xl font-bold text-primary">
                      {formatVND(pricePerNight)}
                    </span>
                    <span className="text-xs text-text-secondary">/ đêm</span>
                  </div>
                </div>
                {currentRoom.pricing.originalPrice && (
                  <span className="text-xs text-text-secondary line-through">
                    {formatVND(currentRoom.pricing.originalPrice)}
                  </span>
                )}
              </div>

              {/* Date Pickers */}
              <div className="flex flex-col gap-3">
                <DatePicker
                  label="Ngày nhận phòng"
                  id="detail-check-in"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <DatePicker
                  label="Ngày trả phòng"
                  id="detail-check-out"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  min={checkInDate || new Date().toISOString().split('T')[0]}
                  error={dateError}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-text-secondary font-bold">
                    Số lượng khách lưu trú
                  </label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full bg-white border border-border-custom rounded-xl p-2.5 text-xs text-text-primary font-semibold focus:border-accent focus:ring-1 focus:ring-accent"
                  >
                    <option value={1}>1 Người lớn</option>
                    <option value={2}>2 Người lớn</option>
                    <option value={3}>2 Người lớn + 1 Trẻ em</option>
                    <option value={4}>Gia đình 4 khách</option>
                  </select>
                </div>
              </div>

              {/* Price Calculation Matrix */}
              <div className="bg-surface-alt/50 rounded-xl p-4 border border-border-custom flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between items-center text-text-secondary">
                  <span>
                    {formatVND(pricePerNight)} x {nights} đêm:
                  </span>
                  <span className="font-semibold text-text-primary">
                    {formatVND(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-emerald-800">
                  <span>Đặc quyền đặt trực tiếp:</span>
                  <span className="font-semibold">Tặng Voucher Spa 200k</span>
                </div>
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Thuế VAT 8% & Bữa sáng:</span>
                  <span className="font-semibold text-text-primary">Đã bao gồm</span>
                </div>
                <div className="pt-2 border-t border-border-custom flex justify-between items-baseline">
                  <span className="font-bold text-primary">Tổng tiền thanh toán:</span>
                  <span className="font-headline text-xl font-bold text-primary">
                    {formatVND(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-accent/15 p-2 rounded-lg text-primary font-bold">
                  <span>Tiền cọc giữ chỗ ({depositPercent}%):</span>
                  <span className="text-accent font-extrabold text-sm">
                    {formatVND(depositAmount)}
                  </span>
                </div>
              </div>

              {/* Prominent Primary CTA */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                isDisabled={Boolean(dateError) || currentRoom.status.availableCount === 0}
                onClick={() => setIsBookingModalOpen(true)}
                iconRight="arrow_forward"
              >
                {currentRoom.status.availableCount === 0
                  ? 'Hạng phòng đã hết chỗ'
                  : 'Tiến hành đặt phòng ngay'}
              </Button>

              {/* Trust & Guarantee Notes */}
              <div className="space-y-2 text-[11px] text-text-secondary pt-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent text-[17px]">
                    lock
                  </span>
                  <span>Khóa phòng 10 phút chống trùng lịch (Anti-Double Booking)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent text-[17px]">
                    event_available
                  </span>
                  <span>Miễn phí hủy phòng trước 48 giờ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent text-[17px]">
                    workspace_premium
                  </span>
                  <span>Cam kết giá tốt nhất khi đặt trực tiếp</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Lightbox Modal for Photo Gallery */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6">
            <div className="flex items-center justify-between text-white pb-4">
              <span className="text-sm font-semibold">
                {currentRoom.name} — Ảnh {activeImageIndex + 1}/{currentRoom.images.length}
              </span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center overflow-hidden">
              <img
                src={currentRoom.images[activeImageIndex]?.url}
                alt={currentRoom.images[activeImageIndex]?.caption}
                className="max-h-[75vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
              />

              {/* Prev / Next buttons */}
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev === 0 ? currentRoom.images.length - 1 : prev - 1
                  )
                }
                className="absolute left-4 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev === currentRoom.images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-4 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">chevron_right</span>
              </button>
            </div>

            <div className="text-center text-white text-xs pt-4">
              {currentRoom.images[activeImageIndex]?.caption}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Confirmation Modal */}
      <BookingConfirmModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        room={currentRoom}
        initialCheckIn={checkInDate}
        initialCheckOut={checkOutDate}
        initialGuests={guestsCount}
      />

    </div>
  );
};

export default RoomDetailPage;
