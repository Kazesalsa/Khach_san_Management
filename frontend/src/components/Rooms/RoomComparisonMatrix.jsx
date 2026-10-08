import React, { useState } from 'react';
import { COMPARISON_MATRIX } from '../../data/roomsData';

const RoomComparisonMatrix = () => {
  const [mobileViewMode, setMobileViewMode] = useState('scroll'); // 'scroll' | 'cards'
  const [activeMobileRoom, setActiveMobileRoom] = useState('deluxe');

  return (
    <section className="w-full bg-surface-alt/40 py-16 border-t border-b border-border-custom">
      <div className="max-w-[1360px] mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-widest text-accent font-bold block mb-2">
            Bảng Đối Chiếu Tiện Ích
          </span>
          <h2 className="font-headline text-3xl lg:text-4xl text-primary font-bold">
            So Sánh Nhanh Các Hạng Phòng
          </h2>
          <p className="text-sm text-text-secondary mt-2">
            Dễ dàng lựa chọn không gian nghỉ dưỡng phù hợp nhất với phong vị chuyến đi của quý khách.
          </p>

          {/* Mobile View Switcher (Visible only on mobile/tablet) */}
          <div className="lg:hidden flex items-center justify-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => setMobileViewMode('scroll')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mobileViewMode === 'scroll'
                  ? 'bg-primary text-text-on-dark shadow-sm'
                  : 'bg-white border border-border-custom text-text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] align-middle mr-1">table_chart</span>
              Cuộn ngang
            </button>
            <button
              type="button"
              onClick={() => setMobileViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mobileViewMode === 'cards'
                  ? 'bg-primary text-text-on-dark shadow-sm'
                  : 'bg-white border border-border-custom text-text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] align-middle mr-1">view_agenda</span>
              Dạng thẻ
            </button>
          </div>
        </div>

        {/* Desktop View & Mobile Controlled Horizontal Scroll */}
        {mobileViewMode === 'scroll' ? (
          <div className="w-full overflow-x-auto rounded-2xl bg-surface border border-border-custom shadow-sm scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-surface-alt text-primary border-b border-border-custom">
                  <th className="p-4 font-headline text-sm lg:text-base font-bold sticky left-0 bg-surface-alt z-10 w-52 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                    Hạng Phòng / Tiêu Chuẩn
                  </th>
                  {COMPARISON_MATRIX.columns.map((col) => (
                    <th
                      key={col.key}
                      className={`p-4 text-center font-bold text-xs uppercase tracking-wider ${
                        col.highlight
                          ? 'text-accent bg-primary text-text-on-dark font-extrabold shadow-sm'
                          : 'text-primary'
                      }`}
                    >
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/60 text-xs text-text-primary">
                {COMPARISON_MATRIX.rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors hover:bg-surface-alt/40 ${
                      idx % 2 === 1 ? 'bg-surface-alt/20' : 'bg-surface'
                    }`}
                  >
                    <td className="p-4 font-bold text-primary sticky left-0 bg-inherit z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                      {row.feature}
                    </td>
                    <td className="p-4 text-center text-text-secondary">
                      {row.values.deluxe}
                    </td>
                    <td className="p-4 text-center text-text-secondary">
                      {row.values.premier}
                    </td>
                    <td className="p-4 text-center text-text-secondary">
                      {row.values.suite}
                    </td>
                    <td className="p-4 text-center text-text-secondary">
                      {row.values.family}
                    </td>
                    <td className="p-4 text-center font-bold text-primary bg-accent/5">
                      {row.values.president}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Mobile Card-based Alternative View */
          <div className="lg:hidden flex flex-col gap-4">
            {/* Room Selector Tab */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {COMPARISON_MATRIX.columns.map((col) => (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => setActiveMobileRoom(col.key)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeMobileRoom === col.key
                      ? 'bg-primary text-text-on-dark shadow-sm'
                      : 'bg-white border border-border-custom text-text-secondary'
                  }`}
                >
                  {col.name}
                </button>
              ))}
            </div>

            {/* Feature List for selected room */}
            <div className="bg-surface rounded-2xl border border-border-custom p-5 shadow-sm divide-y divide-border-custom/60">
              <div className="pb-3 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-accent">
                  Hạng phòng
                </span>
                <span className="font-headline text-base font-bold text-primary">
                  {COMPARISON_MATRIX.columns.find((c) => c.key === activeMobileRoom)?.name}
                </span>
              </div>
              {COMPARISON_MATRIX.rows.map((row, idx) => (
                <div key={idx} className="py-3 flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                    {row.feature}
                  </span>
                  <span className="text-xs font-bold text-primary">
                    {row.values[activeMobileRoom]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default RoomComparisonMatrix;
