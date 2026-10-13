import React from 'react';
import Button from '../ui/Button';

export const EmptyState = ({ onReset }) => {
  return (
    <div className="w-full bg-surface rounded-2xl border border-border-custom p-8 sm:p-14 text-center flex flex-col items-center justify-center my-6">
      <div className="w-16 h-16 rounded-full bg-surface-alt flex items-center justify-center text-text-secondary mb-4 border border-border-custom">
        <span className="material-symbols-outlined text-[32px] text-accent">
          search_off
        </span>
      </div>
      <h3 className="font-headline text-xl sm:text-2xl font-bold text-primary mb-2">
        Không tìm thấy phòng phù hợp
      </h3>
      <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto mb-6 leading-relaxed">
        Rất tiếc, không có hạng phòng nào khớp với các tiêu chí tìm kiếm hoặc bộ lọc hiện tại của quý khách. Quý khách vui lòng điều chỉnh khoảng giá, số người hoặc xóa các bộ lọc.
      </p>
      {onReset && (
        <Button variant="outlineGold" size="md" onClick={onReset} iconLeft="restart_alt">
          Xóa tất cả bộ lọc
        </Button>
      )}
    </div>
  );
};

export const ConnectionErrorState = ({ onRetry }) => {
  return (
    <div className="w-full bg-rose-50/60 rounded-2xl border border-rose-200 p-8 sm:p-14 text-center flex flex-col items-center justify-center my-6">
      <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-danger-custom mb-4 border border-rose-300">
        <span className="material-symbols-outlined text-[32px]">
          cloud_off
        </span>
      </div>
      <h3 className="font-headline text-xl sm:text-2xl font-bold text-danger-custom mb-2">
        Gián đoạn kết nối máy chủ
      </h3>
      <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto mb-6 leading-relaxed">
        Không thể tải dữ liệu danh mục phòng nghỉ vào thời điểm này. Vui lòng kiểm tra lại kết nối Internet của quý khách hoặc thử lại.
      </p>
      {onRetry && (
        <Button variant="danger" size="md" onClick={onRetry} iconLeft="refresh">
          Thử kết nối lại
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
