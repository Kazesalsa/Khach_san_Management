import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const FeaturesSection = () => {
  const features = [
    {
      icon: "support_agent",
      title: "Lễ tân hỗ trợ 24/7",
      desc: "Đội ngũ túc trực & giải đáp tức thì mọi yêu cầu nhận phòng, vận chuyển hành lý và tư vấn trải nghiệm."
    },
    {
      icon: "wifi",
      title: "Wi-Fi tốc độ cao",
      desc: "Đường truyền băng thông rộng chuẩn doanh nghiệp, phủ sóng toàn bộ khuôn viên, sảnh và phòng nghỉ."
    },
    {
      icon: "verified_user",
      title: "Thanh toán & Cọc an toàn",
      desc: "Bảo mật chuẩn quốc tế SSL, xác nhận mã đặt chỗ tự động qua SMS và email chỉ trong vòng 5 phút."
    },
    {
      icon: "near_me",
      title: "Vị trí trung tâm",
      desc: "Cách bờ hồ Hoàn Kiếm, phố cổ và các điểm di tích danh tiếng chỉ 5 phút đi bộ thảnh thơi."
    },
    {
      icon: "sanitizer",
      title: "Buồng phòng vô trùng",
      desc: "Quy trình vệ sinh khử khuẩn nghiêm ngặt mỗi ngày, ga gối chuẩn sợi bông Ai Cập êm dịu tuyệt đối."
    }
  ];

  return (
    <section className="max-w-[1360px] mx-auto px-4 lg:px-8 py-14 w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center mb-10"
      >
        <span className="text-[11px] uppercase tracking-widest text-accent font-bold">Giá Trị Cốt Lõi</span>
        <h2 className="font-headline text-3xl text-primary font-bold mt-1">5 Cam kết phục vụ đẳng cấp Sương Mai</h2>
        <p className="text-sm text-text-secondary max-w-xl mt-1.5">Mỗi khoảnh khắc tại Sương Mai được chăm chút tỉ mỉ mang lại trải nghiệm bình an và tiện nghi vô song.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {features.map((item, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            className="bg-surface p-5 rounded-xl border border-border-custom shadow-sm hover:shadow-md hover:border-accent/40 transition-all flex flex-col items-start gap-3 group"
          >
            <div className="w-12 h-12 rounded-xl bg-surface-alt border border-border-custom flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
            </div>
            <h3 className="text-sm font-bold text-text-primary">{item.title}</h3>
            <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex justify-center mt-10"
      >
        <button className="bg-transparent hover:bg-surface-alt border border-accent text-accent hover:text-accent-hover transition-colors text-sm font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2" type="button">
          <span>Xem thêm tất cả tiện ích</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
