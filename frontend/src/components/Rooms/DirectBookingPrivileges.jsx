import React from 'react';
import { DIRECT_BOOKING_PRIVILEGES } from '../../data/roomsData';

const DirectBookingPrivileges = () => {
  return (
    <section className="max-w-[1360px] mx-auto px-4 lg:px-8 py-14 w-full">
      <div className="rounded-3xl bg-primary text-text-on-dark p-8 lg:p-12 relative overflow-hidden shadow-2xl border border-white/10">
        
        {/* Decorative elements */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-20 w-60 h-60 rounded-full bg-accent/10 blur-2xl pointer-events-none" />

        {/* Section Heading */}
        <div className="max-w-3xl mb-10 relative z-10">
          <span className="text-[11px] uppercase tracking-widest text-accent font-bold block mb-2">
            Lời Cam Kết Từ Sương Mai Retreat
          </span>
          <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl text-white font-bold leading-tight">
            Đặc Quyền Dành Riêng Khi Đặt Phòng Trực Tiếp
          </h2>
          <p className="text-xs sm:text-sm text-text-on-dark/85 mt-2 leading-relaxed">
            Chúng tôi luôn trân trọng từng phút giây nghỉ ngơi của quý khách bằng những đặc quyền minh bạch, tiện nghi hoàn hảo và dịch vụ thấu hiểu nhất.
          </p>
        </div>

        {/* 3 Guarantee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {DIRECT_BOOKING_PRIVILEGES.map((privilege, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex flex-col gap-3 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center shrink-0 shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">
                  {privilege.icon}
                </span>
              </div>
              <h3 className="font-headline text-lg sm:text-xl text-white font-bold">
                {privilege.title}
              </h3>
              <p className="text-xs text-text-on-dark/80 leading-relaxed">
                {privilege.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default DirectBookingPrivileges;
