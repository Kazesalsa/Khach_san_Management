import React from 'react';
import { TESTIMONIALS_DATA } from '../../data/roomsData';

const RoomTestimonials = () => {
  return (
    <section className="max-w-[1360px] mx-auto px-4 lg:px-8 pb-16 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-accent font-bold block mb-1">
            Cảm Nhận Lữ Khách
          </span>
          <h3 className="font-headline text-2xl sm:text-3xl text-primary font-bold">
            Trải Nghiệm Tại Các Hạng Suite
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-secondary font-medium bg-surface px-3 py-1.5 rounded-lg border border-border-custom w-fit">
          <span
            className="material-symbols-outlined text-accent text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span>
            Điểm tin cậy <strong className="text-primary font-bold">4.96/5</strong> từ hơn 1,200 đánh giá được xác thực
          </span>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS_DATA.map((t, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-surface border border-border-custom shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-6"
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-accent mb-3">
                {Array.from({ length: 5 }, (_, starIdx) => (
                  <span
                    key={starIdx}
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="font-headline text-xs sm:text-sm text-text-primary italic leading-relaxed">
                {t.quote}
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 pt-3 border-t border-border-custom/50">
              <div className="w-10 h-10 rounded-full bg-accent/20 text-primary border border-accent/30 flex items-center justify-center font-bold text-xs">
                {t.initials}
              </div>
              <div>
                <h4 className="font-headline text-sm font-bold text-primary">
                  {t.name}
                </h4>
                <span className="text-[11px] text-text-secondary block">
                  {t.stayDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoomTestimonials;
