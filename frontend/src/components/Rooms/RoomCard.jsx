import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const RoomCard = ({
  room,
  onViewDetail,
  onBookNow,
  index = 0,
}) => {
  const isSoldOut = room.status.type === 'sold-out' || room.status.availableCount === 0;

  // Format price in VND
  const formatPrice = (val) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="room-card group bg-surface rounded-2xl overflow-hidden border border-border-custom shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0 relative"
      data-category={room.category}
    >
      {/* Media Column (Desktop 5 cols, Mobile 12 cols) */}
      <div className="lg:col-span-5 relative overflow-hidden h-72 sm:h-80 lg:h-auto min-h-[280px]">
        <img
          src={room.images[0]?.url}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Room Status Badge */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          <Badge
            variant={
              room.status.type === 'available'
                ? 'navy'
                : room.status.type === 'popular'
                ? 'goldSolid'
                : room.status.type === 'signature'
                ? 'primary'
                : room.status.type === 'president'
                ? 'goldSolid'
                : 'danger'
            }
            size="sm"
            className="backdrop-blur-md shadow-sm"
          >
            {room.status.text}
          </Badge>
        </div>

        {/* Photo Gallery Counter */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-surface/90 backdrop-blur-md text-primary flex items-center gap-1.5 text-xs font-semibold shadow-sm z-10">
          <span className="material-symbols-outlined text-accent text-[18px]">
            photo_camera
          </span>
          <span>{room.images.length} ảnh thực tế</span>
        </div>

        {/* Mobile Gradient Overlay */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Details Column (Desktop 7 cols, Mobile 12 cols) */}
      <div className="lg:col-span-7 p-6 lg:p-8 flex flex-col justify-between">
        <div>
          {/* Header Row: Floor & Rating */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-accent text-xs uppercase tracking-widest font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">apartment</span>
              {room.floor}
            </span>
            <div className="flex items-center gap-1 text-text-primary bg-surface-alt/60 px-2.5 py-1 rounded-md border border-border-custom/60">
              <span
                className="material-symbols-outlined text-accent text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="text-xs font-bold">{room.rating}</span>
              <span className="text-[11px] text-text-secondary">
                ({room.reviewsCount} đánh giá)
              </span>
            </div>
          </div>

          {/* Room Name */}
          <h3
            onClick={() => onViewDetail(room)}
            className="font-headline text-xl sm:text-2xl text-primary font-bold mb-2 group-hover:text-accent transition-colors cursor-pointer"
          >
            {room.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-text-secondary mb-6 line-clamp-2 leading-relaxed">
            {room.shortDescription}
          </p>

          {/* Room Specs Matrix (4 boxes) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-alt/50 border border-border-custom/50 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-accent text-[22px] shrink-0">
                square_foot
              </span>
              <div>
                <span className="text-[10px] text-text-secondary uppercase font-semibold block">
                  Diện tích
                </span>
                <span className="text-xs sm:text-sm text-primary font-bold">
                  {room.specs.area} m²
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-accent text-[22px] shrink-0">
                bed
              </span>
              <div>
                <span className="text-[10px] text-text-secondary uppercase font-semibold block">
                  Loại giường
                </span>
                <span className="text-xs sm:text-sm text-primary font-bold truncate block max-w-[100px]" title={room.specs.bed}>
                  {room.specs.bed.split('(')[0]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-accent text-[22px] shrink-0">
                group
              </span>
              <div>
                <span className="text-[10px] text-text-secondary uppercase font-semibold block">
                  Sức chứa
                </span>
                <span className="text-xs sm:text-sm text-primary font-bold">
                  {room.specs.guestsLabel}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-accent text-[22px] shrink-0">
                hot_tub
              </span>
              <div>
                <span className="text-[10px] text-text-secondary uppercase font-semibold block">
                  Tiện ích tắm
                </span>
                <span className="text-xs sm:text-sm text-primary font-bold truncate block max-w-[100px]" title={room.specs.tub}>
                  {room.specs.tub.split('(')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Amenity Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {room.amenities.slice(0, 4).map((amenity, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md bg-surface-alt text-text-secondary text-[11px] font-medium border border-border-custom/50"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 4 && (
              <span className="px-2 py-1 text-[11px] text-text-secondary font-medium">
                +{room.amenities.length - 4} tiện ích khác
              </span>
            )}
          </div>
        </div>

        {/* Price & Actions Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border-custom">
          <div>
            {room.pricing.originalPrice && (
              <span className="text-xs text-text-secondary line-through block">
                {formatPrice(room.pricing.originalPrice)}
              </span>
            )}
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline text-2xl font-bold text-primary">
                {formatPrice(room.pricing.price)}
              </span>
              <span className="text-xs text-text-secondary font-medium">
                {room.pricing.priceUnit}
              </span>
              {room.pricing.discountPercent && (
                <span className="bg-accent/20 text-primary border border-accent/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  -{room.pricing.discountPercent}%
                </span>
              )}
            </div>
            <span className="text-[11px] text-accent font-semibold block mt-0.5">
              {room.pricing.includedNote}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 sm:shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={() => onViewDetail(room)}
              className="flex-1 sm:flex-initial"
            >
              Xem chi tiết
            </Button>
            <Button
              variant="primary"
              size="md"
              isDisabled={isSoldOut}
              onClick={() => onBookNow(room)}
              iconRight="arrow_forward"
              className="flex-1 sm:flex-initial"
            >
              {isSoldOut ? 'Hết phòng' : 'Đặt phòng ngay'}
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default RoomCard;
