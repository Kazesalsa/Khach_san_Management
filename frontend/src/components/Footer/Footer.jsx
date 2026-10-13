import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-primary-dark text-text-on-dark pt-14 pb-8 border-t border-white/10 shadow-[0_-1px_16px_rgba(11,31,42,0.1)]">
      <div className="max-w-[1360px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10">
          
          {/* Info */}
          <div className="lg:col-span-4 flex flex-col items-start gap-3">
            <div className="flex items-center gap-2">
              <span className="font-headline text-2xl font-bold text-white">Khách sạn Sương Mai</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">Không gian nghỉ dưỡng mang hơi thở Indochine hoài niệm kết hợp cùng tiêu chuẩn hiếu khách thượng lưu giữa lòng phố cổ thanh bình.</p>
            <div className="flex flex-col gap-2 mt-2 text-text-secondary">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-accent shrink-0 mt-0.5">location_on</span>
                <span className="text-xs">Số 18 Phố Hàng Bè, Phường Hàng Bạc, Quận Hoàn Kiếm, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-accent shrink-0">mail</span>
                <span className="text-xs">reservation@suongmaihotel.vn</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-accent shrink-0">support_agent</span>
                <span className="text-xs font-semibold text-text-on-dark">Hotline Lễ tân 24/7: 024.3828.xxxx - 0912.xxx.xxx</span>
              </div>
            </div>
          </div>

          {/* Quy định */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-wider text-accent font-bold">Quy định & Chính sách</h4>
            <ul className="flex flex-col gap-2">
              <li className="text-xs text-text-secondary hover:text-accent cursor-pointer transition-colors">Quy chế nhận phòng & trả phòng</li>
              <li className="text-xs text-text-secondary hover:text-accent cursor-pointer transition-colors">Chính sách hủy phòng & hoàn cọc</li>
              <li className="text-xs text-text-secondary hover:text-accent cursor-pointer transition-colors">Điều khoản bảo lưu kỳ nghỉ</li>
              <li className="text-xs text-text-secondary hover:text-accent cursor-pointer transition-colors">Chính sách bảo mật thông tin khách hàng</li>
              <li className="text-xs text-text-secondary hover:text-accent cursor-pointer transition-colors">Quy tắc không gian riêng tư & an ninh</li>
            </ul>
          </div>

          {/* Đặc quyền */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-wider text-accent font-bold">Đặc quyền Sương Mai</h4>
            <ul className="flex flex-col gap-2">
              <li className="text-xs text-text-secondary hover:text-accent cursor-pointer transition-colors">Hội viên VIP Mai Club</li>
              <li className="text-xs text-text-secondary hover:text-accent cursor-pointer transition-colors">Trà chiều & Điểm tâm</li>
              <li className="text-xs text-text-secondary hover:text-accent cursor-pointer transition-colors">Xe đưa đón sân bay cao cấp</li>
              <li className="text-xs text-text-secondary hover:text-accent cursor-pointer transition-colors">Tour trải nghiệm phố cổ</li>
              <li className="text-xs text-text-secondary hover:text-accent cursor-pointer transition-colors">Gói nghỉ dưỡng trăng mật</li>
            </ul>
          </div>

          {/* Thanh toán */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-wider text-accent font-bold">Thanh toán & Chứng nhận</h4>
            <p className="text-xs text-text-secondary">Cổng giao dịch mã hóa chuẩn quốc tế SSL/TLS an toàn tuyệt đối 100%.</p>
            <div className="flex flex-wrap gap-2 items-center mt-1">
              <span className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/15 text-[10px] font-bold tracking-wider">VISA</span>
              <span className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/15 text-[10px] font-bold tracking-wider">MASTERCARD</span>
              <span className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/15 text-[10px] font-bold tracking-wider">VNPAY-QR</span>
              <span className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/15 text-[10px] font-bold tracking-wider">MOMO</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-accent text-[20px]">verified</span>
              <span className="text-xs text-text-secondary">Chứng nhận Tiêu chuẩn Du lịch</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-text-secondary text-xs">
          <p>© 2024 Sương Mai Hotel. Bảo lưu mọi quyền thương hiệu và kiến trúc Indochine.</p>
          <div className="flex items-center gap-5">
            <span className="hover:text-accent cursor-pointer">Điều khoản sử dụng</span>
            <span className="hover:text-accent cursor-pointer">Chính sách cookie</span>
            <span className="hover:text-accent cursor-pointer">Sơ đồ trang</span>
          </div>
        </div>
      </div>

      {/* Floating Chat Widget */}
      <aside className="fixed bottom-6 right-6 z-40">
        <button className="bg-primary text-text-on-dark border border-accent/30 hover:bg-primary-dark shadow-[0_14px_34px_-4px_rgba(11,31,42,0.4)] rounded-full px-4 py-2.5 flex items-center gap-2 transition-all duration-300 group cursor-pointer" type="button">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-hover opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
          <span className="material-symbols-outlined text-[20px] text-accent">forum</span>
          <span className="text-xs font-semibold tracking-wide">Trò chuyện với Lễ tân</span>
        </button>
      </aside>
    </footer>
  );
};

export default Footer;
