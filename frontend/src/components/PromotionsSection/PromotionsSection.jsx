import React from 'react';
import { motion } from 'framer-motion';

const PromotionsSection = () => {
  return (
    <section className="bg-surface-alt/50 border-y border-border-custom py-14 w-full">
      <div className="max-w-[1360px] mx-auto px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-10"
        >
          <span className="text-[11px] uppercase tracking-widest text-accent font-bold">Đặc Quyền Kỳ Nghỉ</span>
          <h2 className="font-headline text-3xl lg:text-4xl text-primary font-bold mt-1">Ưu đãi dành riêng cho kỳ nghỉ của bạn</h2>
          <p className="text-sm text-text-secondary max-w-xl mt-1">Cơ hội tận hưởng không gian Indochine thượng hạng với mức chi phí tối ưu nhất trong năm.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Banner 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-surface rounded-xl overflow-hidden border border-border-custom shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="relative h-56 overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZ9H3HBAGcdekMrh_6RMbWRTVRKYFxOjEMeNtySKj9RHPpxFtupBDZV7gMdCn2xE1pGj8J8ql6Bd8-B0ZRoMXVzcOIli8mW3hK_TjMDjZ03HfChtJ1YYdmfIKdktxOKu_kgFJHH553drXqN_qXCz9f8zyYNoiOXz5kufWlkow49kaUanRHIuu9VQ4LgZAZG89NdlfALKPIDReQamvBpJvxVDV7tcYyoeF7JRYce3Y')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-transparent"></div>
              <span className="absolute top-4 left-4 bg-accent text-primary font-bold text-[10px] px-2.5 py-1 rounded shadow-sm uppercase tracking-wider">
                Ưu Đãi Đặt Sớm • Early Bird
              </span>
            </div>
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
              <div>
                <h3 className="font-headline text-lg font-bold text-primary mb-2">Đặt phòng trước 14 ngày - Giảm ngay 15%</h3>
                <p className="text-xs text-text-secondary leading-relaxed">Lên kế hoạch sớm cho chuyến du ngoạn Hà Nội để nhận chiết khấu 15% tổng hóa đơn phòng cùng quyền ưu tiên chọn tầng cao view đẹp.</p>
              </div>
              <div className="pt-2 border-t border-border-custom flex items-center justify-between">
                <span className="text-[11px] text-text-secondary">Hạn dùng: Đến 30/12/2025</span>
                <button className="text-accent hover:text-accent-hover text-xs font-bold flex items-center gap-1 group/btn" type="button">
                  <span>Nhận ưu đãi</span>
                  <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Banner 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-primary text-text-on-dark rounded-xl overflow-hidden border border-primary-dark shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="relative h-56 overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700 opacity-80" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAPJllSDeBWNkWLI-f6z47bQ0oEKnC9bbHnDH6xJezB5kxVhdaFmsxt43hcoV4fAWwkYosob3mAyE-5Ys1OzuavO2JGzyZsCXPcCaHdx4LmUPWRC_fZVn1MSzVP2lBlbTiZXl9Ua8GxWLhAAhNDc64e7L3jjgzrM8lEAvapJwK7gV5nZqr3qli73rBvaWN4ujyMG8cyIADsHlb-NW8zgx6hOvuCbbPe2Ii8EDytkmg')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent"></div>
              <span className="absolute top-4 left-4 bg-accent text-primary font-bold text-[10px] px-2.5 py-1 rounded shadow-sm uppercase tracking-wider">
                Đặc Quyền Khách Hàng VIP
              </span>
            </div>
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
              <div>
                <h3 className="font-headline text-lg font-bold text-text-on-dark mb-2">Nâng hạng thẻ Sương Mai Club</h3>
                <p className="text-xs text-[#E8ECEE]/80 leading-relaxed">Tích điểm hoàn tiền 5% cho mỗi đêm lưu trú, miễn phí nâng hạng phòng khi còn trống và thưởng thức Buffet sáng không giới hạn.</p>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-accent">Dành cho khách thân thiết</span>
                <button className="bg-accent text-primary hover:bg-accent-hover text-xs font-bold px-3 py-1.5 rounded-lg transition-colors" type="button">
                  Xem ưu đãi
                </button>
              </div>
            </div>
          </motion.div>

          {/* Banner 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-surface rounded-xl overflow-hidden border border-border-custom shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="relative h-56 overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAM1O-bBE6ZCJDp02nA0ggVDO5k3hncP7SSkaimhQUvJf8tR4RdeD9H6gMw8JFitTsLpDgkT3M-nyulYsMDyMrmYdvKka8vZlEVlWiYxbxrXGBe9v2Qq4MD7u9SS32ozkR7bMP0tAlmwJC16NmC8t5nzb0cd201Y_XFT2S5unmGqqQK-d6NTfLcI2lWelROZtVttI-0qbn1Pnr4foBKicS-3GuRWrv46ejbb0oGCB4')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-transparent"></div>
              <span className="absolute top-4 left-4 bg-primary text-text-on-dark border border-accent/40 font-bold text-[10px] px-2.5 py-1 rounded shadow-sm uppercase tracking-wider">
                Gói Nghỉ Dưỡng Cuối Tuần
              </span>
            </div>
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
              <div>
                <h3 className="font-headline text-lg font-bold text-primary mb-2">Trọn gói Weekend Getaway 2N1Đ</h3>
                <p className="text-xs text-text-secondary leading-relaxed">Tận hưởng 01 đêm nghỉ hạng Premier Suite kèm bữa tối lãng mạn set menu Á-Âu 5 món tại Nhà hàng Mai Lounge danh tiếng.</p>
              </div>
              <div className="pt-2 border-t border-border-custom flex items-center justify-between">
                <span className="text-[11px] text-text-secondary">Chỉ từ 3.250.000 đ / cặp đôi</span>
                <button className="text-accent hover:text-accent-hover text-xs font-bold flex items-center gap-1 group/btn" type="button">
                  <span>Nhận ưu đãi</span>
                  <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mt-10"
        >
          <button className="bg-transparent hover:bg-surface border border-accent text-accent hover:text-accent-hover transition-colors text-sm font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-sm" type="button">
            <span>Xem tất cả ưu đãi</span>
            <span className="material-symbols-outlined text-[18px]">local_activity</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PromotionsSection;
