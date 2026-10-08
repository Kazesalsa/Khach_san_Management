import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RoomSearchBar = () => {
  const navigate = useNavigate();

  const handleSearchRoom = (e) => {
    e.preventDefault();
    navigate('/rooms');
  };

  return (
    <motion.section 
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="relative z-30 max-w-[1360px] mx-auto px-4 lg:px-8 -mt-16 w-full"
    >
      <div className="bg-surface rounded-2xl border border-border-custom shadow-[0_16px_40px_-8px_rgba(19,42,58,0.12)] p-5 lg:p-7 backdrop-blur-md">
        <form className="flex flex-col gap-4" id="booking-search-form" onSubmit={handleSearchRoom}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            
            {/* Check-in */}
            <div className="lg:col-span-3 flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-wider text-text-secondary font-bold flex items-center gap-1.5" htmlFor="check-in-date">
                <span className="material-symbols-outlined text-accent text-[18px]">calendar_today</span>
                Ngày nhận phòng
              </label>
              <div className="bg-background border border-border-custom rounded-xl p-3 flex flex-col hover:border-accent/50 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all">
                <input className="bg-transparent text-text-primary text-sm font-semibold focus:outline-none focus:ring-0 border-0 p-0 w-full cursor-pointer" id="check-in-date" required type="date" />
                <span className="text-[10px] text-text-secondary mt-1">Tối thiểu từ hôm nay</span>
              </div>
            </div>

            {/* Check-out */}
            <div className="lg:col-span-3 flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-wider text-text-secondary font-bold flex items-center gap-1.5" htmlFor="check-out-date">
                <span className="material-symbols-outlined text-accent text-[18px]">event</span>
                Ngày trả phòng
              </label>
              <div className="bg-background border border-border-custom rounded-xl p-3 flex flex-col hover:border-accent/50 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all">
                <input className="bg-transparent text-text-primary text-sm font-semibold focus:outline-none focus:ring-0 border-0 p-0 w-full cursor-pointer" id="check-out-date" required type="date" />
                <span className="text-[10px] text-text-secondary mt-1">Sau ngày nhận phòng</span>
              </div>
            </div>

            {/* Guests */}
            <div className="lg:col-span-2 flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-wider text-text-secondary font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-accent text-[18px]">group</span>
                Số khách
              </label>
              <div className="grid grid-cols-2 gap-2 bg-background border border-border-custom rounded-xl p-2.5">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase text-text-secondary font-bold px-1">Lớn</span>
                  <select className="bg-transparent text-text-primary text-xs font-semibold focus:outline-none focus:ring-0 border-0 p-1 cursor-pointer" id="adults-count" defaultValue="2">
                    <option value="1">1 khách</option>
                    <option value="2">2 khách</option>
                    <option value="3">3 khách</option>
                    <option value="4">4 khách</option>
                  </select>
                </div>
                <div className="flex flex-col border-l border-border-custom pl-2">
                  <span className="text-[9px] uppercase text-text-secondary font-bold px-1">Trẻ em</span>
                  <select className="bg-transparent text-text-primary text-xs font-semibold focus:outline-none focus:ring-0 border-0 p-1 cursor-pointer" id="children-count" defaultValue="0">
                    <option value="0">0 bé</option>
                    <option value="1">1 bé</option>
                    <option value="2">2 bé</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Room Category */}
            <div className="lg:col-span-2 flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-wider text-text-secondary font-bold flex items-center gap-1.5" htmlFor="room-type-select">
                <span className="material-symbols-outlined text-accent text-[18px]">bed</span>
                Hạng phòng
              </label>
              <div className="bg-background border border-border-custom rounded-xl p-3.5 hover:border-accent/50 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all flex items-center h-[62px]">
                <select className="w-full bg-transparent text-text-primary text-sm font-semibold focus:outline-none focus:ring-0 border-0 p-0 cursor-pointer" id="room-type-select" defaultValue="all">
                  <option value="all">Tất cả hạng phòng</option>
                  <option value="deluxe">Deluxe Ban công</option>
                  <option value="premier">Premier Suite</option>
                  <option value="executive">Executive King</option>
                  <option value="family">Family Duplex</option>
                </select>
              </div>
            </div>

            {/* CTA Button */}
            <div className="lg:col-span-2 flex flex-col justify-end h-full">
              <button className="w-full h-[62px] bg-accent text-primary hover:bg-accent-hover hover:-translate-y-0.5 active:translate-y-0 font-bold transition-all text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-accent/20 cursor-pointer" type="submit">
                <span className="material-symbols-outlined text-[20px]">search</span>
                <span>Tìm phòng</span>
              </button>
            </div>
          </div>

          {/* Validation & Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3 border-t border-border-custom/50 mt-1 text-text-secondary text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-custom opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success-custom"></span>
              </span>
              <span className="font-semibold text-primary tracking-wide">Kiểm tra phòng theo thời gian thực</span>
              <span className="text-border-custom">•</span>
              <span className="text-text-secondary">Không phát sinh phụ phí ẩn</span>
            </div>
          </div>
        </form>
      </div>
    </motion.section>
  );
};

export default RoomSearchBar;
