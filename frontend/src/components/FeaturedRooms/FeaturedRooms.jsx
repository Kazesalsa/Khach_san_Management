import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicRooms, DEFAULT_ROOM_IMAGE } from '../../services/roomService';

const FeaturedRooms = () => {
  const [filter, setFilter] = useState("all");
  const [roomList, setRoomList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPublicRooms().then((dbRooms) => {
      if (active && Array.isArray(dbRooms) && dbRooms.length > 0) {
        // Lấy đại diện các phòng tiêu biểu từ Database kèm theo ảnh từ phong_hinh_anh
        const mapped = dbRooms.slice(0, 6).map((r) => {
          const cat = r.categoryId === 'cat-4' ? 'vip' :
                      r.categoryId === 'cat-3' ? 'couple' :
                      r.categoryId === 'cat-2' ? 'family' : 'couple';
          const formatVND = (num) => new Intl.NumberFormat('vi-VN').format(num) + ' đ';

          return {
            id: r.id,
            category: cat,
            name: r.name,
            nameEn: `${r.categoryName} Room ${r.roomNumber}`,
            // Lấy ảnh trực tiếp từ bảng phong_hinh_anh
            image: r.primaryImageUrl || (r.images && r.images[0]?.url) || DEFAULT_ROOM_IMAGE,
            status: {
              text: r.usageStatus === 'TRONG' ? 'Còn phòng trống' : 'Đang có khách',
              color: r.usageStatus === 'TRONG' ? 'bg-success-custom' : 'bg-danger-custom',
              type: r.usageStatus === 'TRONG' ? 'available' : 'last-room'
            },
            specs: `${r.maxCapacity * 15}m² • Tầng ${r.floor} view thoáng`,
            bed: r.maxCapacity >= 3 ? 'Giường King lớn' : '1 King hoặc 2 Twin',
            guests: `${r.maxCapacity} Người lớn`,
            amenities: r.amenities?.slice(0, 4) || ['Bồn tắm nằm', 'Smart TV 55"', 'Wifi miễn phí', 'Buffet sáng'],
            vipLabel: { icon: "verified", text: `Phòng ${r.roomNumber} - Hạng ${r.categoryName}` },
            priceOld: r.originalPrice ? formatVND(r.originalPrice) : null,
            priceNew: formatVND(r.price || 1200000),
            discount: `-${r.discountPercent || 20}%`
          };
        });
        setRoomList(mapped);
      }
    }).catch((err) => {
      console.warn('Lỗi lấy danh sách phòng nổi bật:', err);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const filteredRooms = roomList.filter(room => filter === "all" || room.category === filter || (filter === 'couple' && room.category === 'vip'));

  return (
    <section className="max-w-[1360px] mx-auto px-4 lg:px-8 py-10 w-full" id="danh-sach-phong">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col"
        >
          <span className="text-[11px] uppercase tracking-widest text-accent font-bold">Bộ Sưu Tập Phòng & Suites</span>
          <h2 className="font-headline text-3xl lg:text-4xl text-primary font-bold mt-1">Không gian nghỉ dưỡng dành riêng cho bạn</h2>
          <p className="text-sm text-text-secondary mt-1">Thông tin diện tích, sức chứa và chính sách giữ phòng minh bạch theo chuẩn hệ thống.</p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2"
        >
          <button 
            onClick={() => setFilter('all')} 
            className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-all ${filter === 'all' ? 'bg-primary text-text-on-dark border-primary' : 'bg-surface text-text-secondary hover:text-text-primary border-border-custom'}`}
          >Tất cả phòng</button>
          <button 
            onClick={() => setFilter('couple')}
            className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-all ${filter === 'couple' ? 'bg-primary text-text-on-dark border-primary' : 'bg-surface text-text-secondary hover:text-text-primary border-border-custom'}`}
          >Dành cho cặp đôi</button>
          <button 
            onClick={() => setFilter('family')}
            className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-all ${filter === 'family' ? 'bg-primary text-text-on-dark border-primary' : 'bg-surface text-text-secondary hover:text-text-primary border-border-custom'}`}
          >Gia đình</button>
          <button 
            onClick={() => setFilter('vip')}
            className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-all ${filter === 'vip' ? 'bg-primary text-text-on-dark border-primary' : 'bg-surface text-text-secondary hover:text-text-primary border-border-custom'}`}
          >Doanh nhân VIP</button>
        </motion.div>
      </div>

      {loading && roomList.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-surface rounded-xl overflow-hidden border border-border-custom p-4 animate-pulse">
              <div className="w-full h-64 bg-surface-alt rounded-lg mb-4" />
              <div className="h-6 bg-surface-alt rounded w-3/4 mb-2" />
              <div className="h-4 bg-surface-alt rounded w-1/2 mb-4" />
              <div className="h-10 bg-surface-alt rounded" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRooms.map((room) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              key={room.id}
              className="bg-surface rounded-xl overflow-hidden border border-border-custom shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative w-full h-64 overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" 
                    style={{ backgroundImage: `url('${room.image}')` }}
                  ></div>
                  <div className={`absolute top-4 left-4 ${room.status.color} text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    {room.status.text}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-primary-dark/85 backdrop-blur-sm text-text-on-dark text-[11px] font-medium px-2.5 py-1 rounded">
                    {room.specs}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col gap-3">
                  <div>
                    <h3 className="font-headline text-lg font-bold text-primary group-hover:text-accent transition-colors">{room.name}</h3>
                    <span className="text-[11px] text-text-secondary uppercase tracking-wider font-semibold">{room.nameEn}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-text-secondary text-xs py-1">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px] text-accent">bed</span>
                      <span>{room.bed}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px] text-accent">group</span>
                      <span>{room.guests}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {room.amenities.map((item, i) => (
                      <span key={i} className="bg-surface-alt/70 border border-border-custom px-2 py-0.5 rounded text-text-secondary text-[11px]">{item}</span>
                    ))}
                  </div>

                  <div className="bg-surface-alt/60 border border-border-custom p-2.5 rounded-lg flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-accent text-[18px]">{room.vipLabel.icon}</span>
                    <span className="text-xs text-primary font-semibold">{room.vipLabel.text}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-border-custom flex items-baseline justify-between mb-3">
                  <div className="flex flex-col">
                    {room.priceOld ? (
                      <span className="line-through text-text-secondary/60 text-xs">{room.priceOld}</span>
                    ) : (
                      <span className="text-xs text-transparent select-none">-</span>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="font-headline text-xl text-primary font-bold">{room.priceNew}</span>
                      <span className="text-text-secondary text-xs">/ đêm</span>
                    </div>
                  </div>
                  {room.discount ? (
                    <span className="bg-accent/15 text-primary border border-accent/30 text-xs font-bold px-2 py-0.5 rounded">{room.discount}</span>
                  ) : (
                    <span className="text-text-secondary text-xs font-medium">{room.priceNote}</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/rooms" className="bg-background hover:bg-surface-alt text-primary border border-border-custom text-xs font-semibold py-2.5 rounded-lg transition-colors text-center inline-flex items-center justify-center">Xem chi tiết</Link>
                  <Link to="/rooms" className="bg-accent text-primary hover:bg-accent-hover text-xs font-semibold py-2.5 rounded-lg transition-all shadow-sm text-center inline-flex items-center justify-center">Đặt phòng</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex justify-center mt-10"
      >
        <Link to="/rooms" className="bg-transparent hover:bg-surface border border-accent text-accent hover:text-accent-hover transition-colors text-sm font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-sm">
          <span>Xem tất cả bộ sưu tập phòng</span>
          <span className="material-symbols-outlined text-[18px]">meeting_room</span>
        </Link>
      </motion.div>

    </section>
  );
};

export default FeaturedRooms;
