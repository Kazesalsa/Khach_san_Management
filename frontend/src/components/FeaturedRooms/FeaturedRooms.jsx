import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const rooms = [
  {
    id: "deluxe",
    category: "couple",
    name: "Deluxe Ban Công Sương Mai",
    nameEn: "Deluxe Balcony Room",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEO5ivCIEf-os9sfCPlGBzMjkZNT89sgg58WLF7qARLAyS0AT5S_flgcwWgkC30N2CqOeXNO0YcVIVABCfPdONoCPzZmtS3U0MfmQJ_PgV-3LNi9JdaZv6lX0AUYMRoWkXeN6_zVi2_y9GtFlS2vloerqGgnDdGd-xvR4MfNMGXo0TFEz9lYrJT20O4nDjc38gkQ_pw0WunZXT34gGjySmoWWKElVaSqODxKnpoOQ",
    status: { text: "Còn 3 phòng trống", color: "bg-success-custom", type: "available" },
    specs: "35m² • View Ban công phố",
    bed: "1 King hoặc 2 Twin",
    guests: "2 Người lớn + 1 Trẻ em",
    amenities: ["Bồn tắm nằm", "Smart TV 55\"", "Máy pha cafe", "Buffet sáng free"],
    vipLabel: { icon: "card_membership", text: "Tặng voucher Spa 200k cho khách hội viên VIP" },
    policy: { icon: "info", text: "Đặt cọc 30% giữ phòng ngay • Hủy linh hoạt trước 48h" },
    priceOld: "2.100.000 đ",
    priceNew: "1.650.000 đ",
    discount: "-21%"
  },
  {
    id: "premier",
    category: "vip",
    name: "Premier Indochine Suite",
    nameEn: "Premier Garden View Suite",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAbvJIFrIXJ7BDwtSOnPlFAwTQQkpQC8PqtrpgxC3r0V7yyyhAzd9b_F1ejWXg0TID039eth_tchPdqDVEd6724AzBOFWVPsTyEmmzqwqv4IENlb1PqBVAarULYr6m6tT56fZI_lgE6_fdUVzwExyCHQwEyZB5SSj3jS2YkucPt36FB2KjhBerbRcs7borvtte8GFtuJmwRyUYPl5gwyTSDLZkLCQOg6CMW0sMqOc",
    status: { text: "Sắp hết phòng (Chỉ còn 1 phòng)", color: "bg-danger-custom", type: "last-room" },
    specs: "52m² • View Nhìn vườn sương",
    bed: "1 Super King Bed",
    guests: "2 Người lớn",
    amenities: ["Phòng khách riêng", "Minibar miễn phí", "Trà chiều tặng kèm", "Bồn sục Jacuzzi"],
    vipLabel: { icon: "verified", text: "VIP: Miễn phí Check-in sớm 2h & Đón sân bay" },
    policy: { icon: "credit_card", text: "Giữ phòng tức thì với thanh toán 50% hoặc thẻ tín dụng" },
    priceOld: "3.500.000 đ",
    priceNew: "2.850.000 đ",
    discount: "-18%"
  },
  {
    id: "family",
    category: "family",
    name: "Grand Family Luxury Suite",
    nameEn: "Grand Family 2-Bedroom Suite",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuACK-BH4l5SAj8en0qY40JKF9YVUtEbIsZ_mdnLPpl2W4SNh74HVQG5fCj-1t8IpKEbM0DnZy1nXZia5v4RNvgtq2rVl0bTpZlpGHYHTH0I5voMLHq9aoQ-EalzxVagmu2RETt-oMcr5rTTA34QMPu2SFVER8LwBEMWhqTeVxaLgkGwwzxEJJRduG9JjJDx8lK-b2DCNqlcC-s8gNoBP6vzZMex2hN99mmafcyx2mY",
    status: { text: "Còn phòng", color: "bg-success-custom", type: "available" },
    specs: "75m² • Căn hộ 2 phòng ngủ",
    bed: "2 Giường King lớn",
    guests: "4 Người lớn + 2 Trẻ em",
    amenities: ["2 Phòng ngủ riêng", "Bếp phụ tiện ích", "Máy sấy Dyson", "2 Phòng tắm"],
    vipLabel: { icon: "restaurant", text: "Ưu đãi đoàn: Giảm 10% ẩm thực tại Nhà hàng Mai Lounge" },
    policy: { icon: "mark_email_read", text: "Đặt cọc 30% • Xác nhận mã đặt chỗ tự động qua SMS/Email" },
    priceOld: null,
    priceNew: "4.200.000 đ",
    discount: null,
    priceNote: "Giá tiêu chuẩn"
  }
];

const FeaturedRooms = () => {
  const [filter, setFilter] = useState("all");

  const filteredRooms = rooms.filter(room => filter === "all" || room.category === filter || (filter === 'couple' && room.category === 'vip'));

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

                  <div className="text-text-secondary text-[11px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-accent">{room.policy.icon}</span>
                    <span>{room.policy.text}</span>
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

      {/* Banner cảnh báo chống Double-Booking */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-surface-alt border border-border-custom p-5 rounded-xl flex flex-col md:flex-row items-center gap-4 shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-border-custom flex items-center justify-center shrink-0 text-primary">
          <span className="material-symbols-outlined text-[26px] text-primary">lock_clock</span>
        </div>
        <div className="flex flex-col flex-1">
          <h4 className="text-sm font-bold text-text-primary">Cơ chế Khóa phòng tự động ngăn trùng lịch (Anti-Double Booking)</h4>
          <p className="text-xs text-text-secondary mt-0.5">
            Hệ thống sẽ khóa phòng tạm thời <strong>10 phút</strong> ngay khi quý khách chuyển sang bước nhập thông tin để đảm bảo phòng giữ đúng chỗ của bạn, tránh xung đột lịch với các khách lưu trú khác trong cùng thời điểm.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 text-accent font-semibold text-xs bg-surface border border-border-custom px-3 py-1.5 rounded-lg">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>Công nghệ SRS V1.4</span>
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturedRooms;
