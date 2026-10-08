import React, { useState } from 'react';
import { ROOM_CATEGORIES, ROOM_VIEWS, TUB_TYPES, SORT_OPTIONS } from '../../data/roomsData';

const PRICE_RANGES = [
  { value: 'all', label: 'Tất cả mức giá' },
  { value: 'under-1500', label: 'Dưới 1.500.000₫' },
  { value: '1500-2500', label: '1.500.000₫ - 2.500.000₫' },
  { value: '2500-5000', label: '2.500.000₫ - 5.000.000₫' },
  { value: 'above-5000', label: 'Trên 5.000.000₫' },
];

const GUEST_OPTIONS = [
  { value: 'all', label: 'Mọi số khách' },
  { value: '1', label: '1 khách' },
  { value: '2', label: '2 khách' },
  { value: '3-4', label: '3 - 4 khách' },
  { value: '5+', label: '5 khách trở lên' },
];

const RoomFilterBar = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedPriceRange,
  onPriceRangeChange,
  selectedGuests,
  onGuestsChange,
  selectedView,
  onViewChange,
  selectedTub,
  onTubChange,
  selectedSort,
  onSortChange,
  onResetFilters,
  totalResults,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Check if any filter is active
  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    selectedPriceRange !== 'all' ||
    selectedGuests !== 'all' ||
    selectedView !== 'all' ||
    selectedTub !== 'all';

  return (
    <section className="sticky top-20 z-40 bg-surface/95 backdrop-blur-md border-b border-border-custom shadow-sm py-4 transition-all">
      <div className="max-w-[1360px] mx-auto px-4 lg:px-8 flex flex-col gap-4">
        
        {/* Row 1: Category Tabs and Search Input */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none" id="categoryTabs">
            {ROOM_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all select-none flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary text-text-on-dark shadow-sm'
                      : 'bg-surface-alt/70 text-text-secondary hover:text-text-primary hover:bg-surface-alt border border-border-custom/50'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-accent text-primary font-bold' : 'bg-white/80 text-text-secondary'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search and Filter Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm tên phòng, tiện nghi..."
                className="w-full bg-white border border-border-custom rounded-xl pl-9 pr-8 py-2 text-xs text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                showAdvancedFilters || hasActiveFilters
                  ? 'bg-primary text-text-on-dark border-primary'
                  : 'bg-white text-text-secondary border-border-custom hover:border-accent'
              }`}
              title="Bộ lọc nâng cao"
            >
              <span className="material-symbols-outlined text-[18px] text-accent">tune</span>
              <span className="hidden sm:inline">Bộ lọc</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              )}
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="p-2 rounded-xl bg-white border border-border-custom text-text-secondary hover:text-danger-custom hover:border-danger-custom/40 transition-colors text-xs"
                title="Đặt lại bộ lọc"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Secondary / Advanced Filters Bar (Collapsible or always visible on desktop) */}
        <div
          className={`${
            showAdvancedFilters ? 'flex' : 'hidden xl:flex'
          } flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-custom/50 bg-background/50 p-3 rounded-xl`}
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* Price Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-border-custom px-3 py-1.5 rounded-lg text-xs">
              <span className="material-symbols-outlined text-[16px] text-accent">payments</span>
              <span className="text-text-secondary font-medium">Mức giá:</span>
              <select
                value={selectedPriceRange}
                onChange={(e) => onPriceRangeChange(e.target.value)}
                className="bg-transparent text-text-primary font-semibold text-xs border-0 p-0 focus:ring-0 cursor-pointer outline-none"
              >
                {PRICE_RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Guests Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-border-custom px-3 py-1.5 rounded-lg text-xs">
              <span className="material-symbols-outlined text-[16px] text-accent">group</span>
              <span className="text-text-secondary font-medium">Số người:</span>
              <select
                value={selectedGuests}
                onChange={(e) => onGuestsChange(e.target.value)}
                className="bg-transparent text-text-primary font-semibold text-xs border-0 p-0 focus:ring-0 cursor-pointer outline-none"
              >
                {GUEST_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-border-custom px-3 py-1.5 rounded-lg text-xs">
              <span className="material-symbols-outlined text-[16px] text-accent">visibility</span>
              <span className="text-text-secondary font-medium">Hướng nhìn:</span>
              <select
                value={selectedView}
                onChange={(e) => onViewChange(e.target.value)}
                className="bg-transparent text-text-primary font-semibold text-xs border-0 p-0 focus:ring-0 cursor-pointer outline-none"
              >
                {ROOM_VIEWS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tub Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-border-custom px-3 py-1.5 rounded-lg text-xs">
              <span className="material-symbols-outlined text-[16px] text-accent">bathtub</span>
              <span className="text-text-secondary font-medium">Bồn tắm:</span>
              <select
                value={selectedTub}
                onChange={(e) => onTubChange(e.target.value)}
                className="bg-transparent text-text-primary font-semibold text-xs border-0 p-0 focus:ring-0 cursor-pointer outline-none"
              >
                {TUB_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Dropdown & Result Count */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-text-secondary">
              Tìm thấy <strong className="text-primary font-bold">{totalResults}</strong> phòng
            </span>

            <div className="flex items-center gap-1.5 bg-white border border-border-custom px-3 py-1.5 rounded-lg text-xs">
              <span className="material-symbols-outlined text-[16px] text-accent">sort</span>
              <span className="text-text-secondary font-medium">Sắp xếp:</span>
              <select
                value={selectedSort}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-text-primary font-semibold text-xs border-0 p-0 focus:ring-0 cursor-pointer outline-none"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default RoomFilterBar;
