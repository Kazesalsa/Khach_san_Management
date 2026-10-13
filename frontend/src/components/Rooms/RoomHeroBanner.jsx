import React from 'react';
import { motion } from 'framer-motion';

const RoomHeroBanner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-primary text-text-on-dark pt-28 pb-16 lg:pt-36 lg:pb-24 border-b border-border-custom/20">
      {/* Decorative Indochine subtle background pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: 'radial-gradient(#C6A15B 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
      <div className="absolute left-1/4 -bottom-32 w-80 h-80 rounded-full bg-primary-dark/40 blur-3xl pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Banner Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/20 text-accent text-[11px] font-bold uppercase tracking-widest backdrop-blur-sm w-fit border border-accent/30">
              <span className="material-symbols-outlined text-[15px]">spa</span>
              <span>Bộ Sưu Tập Nghỉ Dưỡng Di Sản 2024</span>
            </div>

            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-white leading-tight font-bold tracking-tight">
              Nơi hồn xưa Pháp - Việt <br />
              <span className="italic text-accent font-normal">ngưng đọng thời gian</span>
            </h1>

            <p className="text-sm sm:text-base text-text-on-dark/85 max-w-2xl leading-relaxed">
              Hơn cả một chốn nghỉ, mỗi gian phòng tại Khách sạn Sương Mai là một tác phẩm Indochine sống động giữa lòng 36 phố phường. Sự giao thoa tinh mỹ giữa gạch bông hoa văn cổ, gỗ mun trầm mặc và chuẩn mực phục vụ hiếu khách tinh hoa quốc tế.
            </p>

            {/* Trust points */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-text-on-dark/90 font-medium">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-[18px]">verified</span>
                <span>100% Nội Thất Thủ Công Hà Thành</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-[18px]">concierge</span>
                <span>Quản Gia Tận Tâm 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-[18px]">pin_drop</span>
                <span>Trọng Tâm Phố Cổ Hoàn Kiếm</span>
              </div>
            </div>
          </motion.div>

          {/* Banner Hero Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-5 relative mt-4 lg:mt-0"
          >
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOGmz0wSNBwJYmWIXDDd7EnYXe_vZaQ91LEcn9ozTHPtN8jK-zaiCYXDQe10G16X-lw1C4D8eyAYuJ7B5Ep6gbREHtwbOPpYIkq38gtfSAbkti4iMUWHQk-vk8hSXAuBil5kPWZy4Dff2Qz-sfZt6TSO0YL0O-aS9la10xPPCeI0-SPyxA1YbYq5dkj2HGCRCT4x1gTg8N5QRHmfZQy9KK4OhOjH9m0By4gkcKFv9xucV2jQujEg_T"
                alt="Phòng Suite Khách sạn Sương Mai"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/85 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-primary/85 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-accent block uppercase tracking-wider font-semibold">
                    Chứng nhận xuất sắc
                  </span>
                  <span className="font-headline text-base sm:text-lg text-white font-bold">
                    Boutique Suite of the Year
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-accent px-3 py-1.5 rounded-lg text-primary font-bold text-xs shadow-md">
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span>4.9 / 5.0</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default RoomHeroBanner;
