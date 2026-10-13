import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const backgroundImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCV5ZT4JT4LpdJ-4T-1mK1__7kEA-1P_dFfjQbiE62IN8X_HZmyczfJMMEg2OzuRQlkg-mwSUGcSAEFodYhgwvQk1BPSP2Cd-JPEOQoyP-x9nGAneZ4h4pBfQJ410A7nZs4ahaQrCeEF8dOspnA3F2E-hZh_kZU7VoP052sZrnDElZFVc8lVY6nNltb3Ku6k8YtmYxFCSQK012QjEgZIx9gM02cWfJIIB8FPwHzII8",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAPJllSDeBWNkWLI-f6z47bQ0oEKnC9bbHnDH6xJezB5kxVhdaFmsxt43hcoV4fAWwkYosob3mAyE-5Ys1OzuavO2JGzyZsCXPcCaHdx4LmUPWRC_fZVn1MSzVP2lBlbTiZXl9Ua8GxWLhAAhNDc64e7L3jjgzrM8lEAvapJwK7gV5nZqr3qli73rBvaWN4ujyMG8cyIADsHlb-NW8zgx6hOvuCbbPe2Ii8EDytkmg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAM1O-bBE6ZCJDp02nA0ggVDO5k3hncP7SSkaimhQUvJf8tR4RdeD9H6gMw8JFitTsLpDgkT3M-nyulYsMDyMrmYdvKka8vZlEVlWiYxbxrXGBe9v2Qq4MD7u9SS32ozkR7bMP0tAlmwJC16NmC8t5nzb0cd201Y_XFT2S5unmGqqQK-d6NTfLcI2lWelROZtVttI-0qbn1Pnr4foBKicS-3GuRWrv46ejbb0oGCB4",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCEO5ivCIEf-os9sfCPlGBzMjkZNT89sgg58WLF7qARLAyS0AT5S_flgcwWgkC30N2CqOeXNO0YcVIVABCfPdONoCPzZmtS3U0MfmQJ_PgV-3LNi9JdaZv6lX0AUYMRoWkXeN6_zVi2_y9GtFlS2vloerqGgnDdGd-xvR4MfNMGXo0TFEz9lYrJT20O4nDjc38gkQ_pw0WunZXT34gGjySmoWWKElVaSqODxKnpoOQ"
];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Đổi ảnh mỗi 5 giây

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-primary-dark -mt-20 pt-28 pb-32 lg:pb-36">
      <div className="absolute inset-0 z-0 bg-primary-dark">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${backgroundImages[currentImageIndex]}')` }}
          />
        </AnimatePresence>
        
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(11, 31, 42, 0.90) 0%, rgba(11, 31, 42, 0.68) 55%, rgba(11, 31, 42, 0.40) 100%)" }}></div>
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-4 lg:px-8 pt-12 lg:pt-16 flex flex-col items-center text-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.12] border border-white/20 backdrop-blur-md mb-4 shadow-sm"
        >
          <span className="material-symbols-outlined text-accent text-[18px]">hotel_class</span>
          <span className="text-[11px] text-text-on-dark tracking-widest uppercase font-semibold">Khách sạn phong cách Indochine Thượng Lưu</span>
        </motion.div>

        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-headline text-4xl lg:text-5xl text-white max-w-4xl tracking-tight leading-tight font-bold"
        >
          Tận hưởng kỳ nghỉ trọn vẹn tại <span className="italic font-normal text-accent-hover font-headline">Khách sạn Sương Mai</span>
        </motion.h1>

        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-body text-base lg:text-lg text-[#E8ECEE] max-w-2xl mt-4 leading-relaxed font-normal"
        >
          Không gian tiện nghi, phục vụ tận tâm và đặt phòng nhanh chóng. Chốn dừng chân giao hòa giữa nét hoài niệm phố hội và chuẩn mực nghỉ dưỡng đương đại.
        </motion.p>

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          <a className="bg-accent text-primary hover:bg-accent-hover transition-all text-sm font-semibold px-6 py-3.5 rounded-lg shadow-xl hover:shadow-2xl flex items-center gap-2" href="#danh-sach-phong">
            <span>Khám phá phòng nghỉ</span>
            <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
          </a>
          <a className="bg-transparent hover:bg-white/10 text-white border border-white transition-all text-sm font-medium px-6 py-3.5 rounded-lg backdrop-blur-md flex items-center gap-2" href="#vi-tri-khach-san">
            <span className="material-symbols-outlined text-accent text-[20px]">explore</span>
            <span>Xem vị trí & Chỉ đường</span>
          </a>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-y-3 gap-x-6 mt-12 pt-4 text-text-on-dark text-xs font-medium"
        >
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-accent text-[18px]">verified</span>
            <span>Đảm bảo giá tốt nhất khi đặt trực tiếp</span>
          </div>
          <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-accent/60"></span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-accent text-[18px]">event_repeat</span>
            <span>Hủy phòng linh hoạt 48h</span>
          </div>
          <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-accent/60"></span>
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 px-3 py-1 rounded-full backdrop-blur-sm">
            <div className="flex text-accent">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
            <span className="font-semibold text-white ml-1">4.9/5</span>
            <span className="text-white/70 text-[11px]">(1.200+ lượt khách)</span>
          </div>
        </motion.div>
        
        {/* Slideshow Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-16 flex items-center justify-center gap-2"
        >
          {backgroundImages.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === idx ? 'bg-accent w-6' : 'bg-white/50 hover:bg-white/80'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
