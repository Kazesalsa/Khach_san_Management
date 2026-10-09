import React from 'react';
import { motion } from 'framer-motion';

const LocationSection = () => {
  return (
    <section className="max-w-[1360px] mx-auto px-4 lg:px-8 py-14 w-full" id="vi-tri-khach-san">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Thông tin kết nối & Di chuyển */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex flex-col gap-4"
        >
          <div>
            <span className="text-[11px] uppercase tracking-widest text-accent font-bold">Tâm Điểm Phố Hội</span>
            <h2 className="font-headline text-3xl font-bold text-primary mt-1">Vị trí đắc địa giữa lòng Hà Nội</h2>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              Tọa lạc tại số 18 Phố Hàng Bè, Khách sạn Sương Mai đem lại sự thuận tiện trọn vẹn cho việc tản bộ khám phá 36 phố phường, thưởng ngoạn mặt nước Hồ Gươm và tiếp cận những phong vị ẩm thực lâu đời.
            </p>
          </div>

          {/* Mốc thời gian di chuyển */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-3 bg-surface border border-border-custom rounded-lg shadow-sm">
              <div className="w-10 h-10 rounded-full bg-surface-alt border border-border-custom flex items-center justify-center text-accent shrink-0">
                <span className="material-symbols-outlined text-[20px]">directions_walk</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-primary">Hồ Hoàn Kiếm & Đền Ngọc Sơn</span>
                <span className="text-xs text-text-secondary">Chỉ 5 phút đi bộ thảnh thơi (khoảng 350m)</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface border border-border-custom rounded-lg shadow-sm">
              <div className="w-10 h-10 rounded-full bg-surface-alt border border-border-custom flex items-center justify-center text-accent shrink-0">
                <span className="material-symbols-outlined text-[20px]">storefront</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-primary">Phố đi bộ & Chợ đêm Hàng Đào</span>
                <span className="text-xs text-text-secondary">3 phút di chuyển, dễ dàng hòa mình vào văn hóa đêm</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface border border-border-custom rounded-lg shadow-sm">
              <div className="w-10 h-10 rounded-full bg-surface-alt border border-border-custom flex items-center justify-center text-accent shrink-0">
                <span className="material-symbols-outlined text-[20px]">flight</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-primary">Sân bay Quốc tế Nội Bài</span>
                <span className="text-xs text-text-secondary">35 phút xe đưa đón riêng của khách sạn</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-alt border border-border-custom p-3.5 rounded-lg flex items-center gap-2 text-text-secondary">
            <span className="material-symbols-outlined text-accent text-[22px]">local_parking</span>
            <span className="text-xs font-medium">Có bãi đỗ ô tô miễn phí và hệ thống camera an ninh bảo vệ túc trực 24/7.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a className="bg-primary text-text-on-dark hover:bg-primary-dark transition-colors text-xs font-semibold px-4 py-3 rounded-lg flex items-center gap-2 shadow-sm" href="https://maps.google.com/?q=18+Hang+Be+Hoan+Kiem+Hanoi" rel="noopener noreferrer" target="_blank">
              <span className="material-symbols-outlined text-[18px] text-accent">navigation</span>
              <span>Mở Google Maps chỉ đường</span>
            </a>
            <button className="bg-surface hover:bg-surface-alt text-primary border border-border-custom text-xs font-semibold px-4 py-3 rounded-lg transition-colors" type="button">
              Gửi chỉ đường qua SMS
            </button>
          </div>
        </motion.div>

        {/* Bản đồ tương tác & Ghim vị trí */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-7"
        >
          <div className="relative rounded-2xl overflow-hidden border border-border-custom shadow-xl bg-surface-alt h-[440px]">
            <div 
              className="w-full h-full bg-cover bg-center" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop')" }}
            ></div>
            
            {/* Custom Pin Card Overlay */}
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-md bg-surface/95 border border-border-custom backdrop-blur-md p-4 rounded-xl shadow-2xl flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-accent shrink-0 shadow-md">
                <span className="material-symbols-outlined text-[22px]">hotel</span>
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-primary">Sương Mai Hotel Hanoi</h4>
                <p className="text-xs text-text-secondary mt-0.5">Số 18 Phố Hàng Bè, Phường Hàng Bạc, Hoàn Kiếm, Hà Nội</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-[11px] text-success-custom font-semibold">
                    <span className="w-2 h-2 rounded-full bg-success-custom"></span>
                    Đang mở cửa tiếp đón
                  </span>
                  <span className="text-border-custom">•</span>
                  <span className="text-[11px] text-accent font-bold">Hotline: 024.3828.xxxx</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LocationSection;
