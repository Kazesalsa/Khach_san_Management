import React from 'react';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 5,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border-custom text-xs">
      <div className="text-text-secondary">
        Hiển thị <strong className="text-primary font-bold">{startItem} - {endItem}</strong> trong tổng số <strong className="text-primary font-bold">{totalItems}</strong> hạng phòng
      </div>

      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`px-3 py-2 rounded-lg border flex items-center gap-1 transition-all ${
            currentPage === 1
              ? 'opacity-40 border-border-custom cursor-not-allowed text-text-secondary'
              : 'border-border-custom hover:border-accent text-text-primary hover:bg-surface-alt'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          <span>Trước</span>
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={`w-9 h-9 rounded-lg font-bold transition-all ${
              currentPage === pageNum
                ? 'bg-primary text-text-on-dark shadow-sm'
                : 'bg-white border border-border-custom text-text-secondary hover:border-accent hover:text-primary hover:bg-surface-alt'
            }`}
          >
            {pageNum}
          </button>
        ))}

        {/* Next Button */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`px-3 py-2 rounded-lg border flex items-center gap-1 transition-all ${
            currentPage === totalPages
              ? 'opacity-40 border-border-custom cursor-not-allowed text-text-secondary'
              : 'border-border-custom hover:border-accent text-text-primary hover:bg-surface-alt'
          }`}
        >
          <span>Sau</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
