import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SERVICES_DATA } from '../../data/servicesData';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const highlights = [
  { icon: 'support_agent', title: 'Lễ tân hỗ trợ 24/7', description: 'Luôn sẵn sàng tiếp nhận mọi yêu cầu của Quý khách.' },
  { icon: 'touch_app', title: 'Đăng ký thuận tiện', description: 'Yêu cầu dịch vụ nhanh chóng ngay tại quầy lễ tân.' },
  { icon: 'verified', title: 'Tiêu chuẩn tuyển chọn', description: 'Mỗi trải nghiệm đều được chăm chút đến từng chi tiết.' },
  { icon: 'chat', title: 'Phản hồi nhanh chóng', description: 'Kết nối với đội ngũ Sương Mai trong ít phút.' },
];

const ServiceCard = ({ service, index, onViewDetail }) => (
  <motion.article
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.18 }}
    transition={{ duration: 0.55, delay: (index % 4) * 0.08 }}
    whileHover={{ y: -8 }}
    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-custom/80 bg-surface shadow-[0_8px_30px_rgba(19,42,58,0.07)] transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(19,42,58,0.15)]"
  >
    <div className="relative h-60 overflow-hidden bg-surface-alt">
      <img src={service.image} alt={service.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />
      <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-primary/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
        {service.category}
      </span>
      <div className="absolute bottom-4 left-5 flex items-center gap-2 text-xs font-semibold text-white">
        <span className="material-symbols-outlined text-[18px] text-accent-hover">schedule</span>
        {service.hours}
      </div>
    </div>

    <div className="flex flex-1 flex-col p-6">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-primary">
          <span className="material-symbols-outlined text-[23px]">{service.icon}</span>
        </div>
        <div>
          <h3 className="font-headline text-xl font-bold leading-snug text-primary">{service.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            <span className="material-symbols-outlined text-[15px]">location_on</span>
            {service.location}
          </p>
        </div>
      </div>
      <p className="mb-6 flex-1 text-sm leading-6 text-text-secondary">{service.description}</p>
      <button
        type="button"
        onClick={() => onViewDetail(service)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary transition-all duration-300 hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        Xem chi tiết
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </button>
    </div>
  </motion.article>
);

const ServiceDetailModal = ({ service, onClose }) => {
  useEffect(() => {
    if (!service) return undefined;
    const handleEscape = (event) => event.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [service, onClose]);

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-primary-dark/75 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => event.target === event.currentTarget && onClose()}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-detail-title"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface shadow-2xl"
          >
            <div className="relative h-56 overflow-hidden sm:h-72">
              <img src={service.image} alt={service.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <button type="button" onClick={onClose} aria-label="Đóng cửa sổ chi tiết" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition-transform hover:scale-105">
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-7 sm:left-7">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-hover">{service.category}</span>
                <h2 id="service-detail-title" className="mt-1 font-headline text-2xl font-bold sm:text-3xl">{service.name}</h2>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-surface-alt/70 p-4">
                  <span className="material-symbols-outlined text-accent">schedule</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Hoạt động</p>
                    <p className="mt-0.5 text-sm font-semibold text-primary">{service.hours}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-surface-alt/70 p-4">
                  <span className="material-symbols-outlined text-accent">location_on</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Địa điểm</p>
                    <p className="mt-0.5 text-sm font-semibold text-primary">{service.location}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm leading-7 text-text-secondary">{service.detail}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="tel:02438280000" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-primary transition-colors hover:bg-accent-hover">
                  <span className="material-symbols-outlined text-[19px]">call</span>
                  Liên hệ lễ tân
                </a>
                <button type="button" onClick={onClose} className="inline-flex items-center justify-center rounded-xl border border-border-custom px-5 py-3 text-sm font-semibold text-text-secondary transition-colors hover:bg-surface-alt hover:text-primary">Đóng</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div className="min-h-screen w-full bg-background">
      <section className="relative min-h-[610px] overflow-hidden bg-primary pt-20">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqq-YQdF3XuZS2FXLsewZJ4_k-UUxJySk6EgxwQscO1d2MM7ahr43W1vv5wzn8ecOL6twQlfxsV1VL65bWbRXIbaOFMqaNyPZ1dyrRjqcNsG34iO2qATzAfDxr_p1Gy4uABhAiRQc-hAjdtyLy7OE3XFbvACqEMH8dNf1dr0xZNJzZSfeyMM7Yj_tooo3Ix1rmKwGsCstS2RfcM22X5dioRvEjQIoOcYEQD9R7Wefk7f86ALQVHD_W')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/85 to-primary/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-primary/20" />
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.75 }} className="relative mx-auto flex min-h-[530px] max-w-[1360px] flex-col justify-center px-4 py-16 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/65">
            <Link to="/" className="transition-colors hover:text-accent-hover">Trang chủ</Link><span>/</span><span className="text-accent-hover">Dịch vụ</span>
          </nav>
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-hover" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-hover">Trải nghiệm tại Sương Mai</span>
          </div>
          <h1 className="max-w-4xl font-headline text-4xl font-bold leading-[1.12] text-white sm:text-5xl lg:text-6xl">
            Chăm chút cho từng <span className="font-normal italic text-accent-hover">khoảnh khắc</span> lưu trú
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">Từ ẩm thực tinh tế đến những phút giây thư giãn, mỗi dịch vụ đều được thiết kế để hành trình của Quý khách trở nên trọn vẹn.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#services-list" className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:bg-accent-hover">
              <span className="material-symbols-outlined text-[20px]">explore</span>Khám phá dịch vụ
            </a>
            <a href="tel:02438280000" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20">
              <span className="material-symbols-outlined text-[20px]">support_agent</span>Liên hệ lễ tân
            </a>
          </div>
        </motion.div>
      </section>

      <div className="relative z-10 mx-auto -mt-12 max-w-[1360px] px-4 lg:px-8">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.55 }} className="grid overflow-hidden rounded-2xl border border-border-custom/70 bg-surface p-3 shadow-xl sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <div key={item.title} className="flex gap-3 rounded-xl p-4 transition-colors hover:bg-surface-alt/60">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent"><span className="material-symbols-outlined text-[24px]">{item.icon}</span></div>
              <div><h2 className="text-sm font-bold text-primary">{item.title}</h2><p className="mt-1 text-xs leading-5 text-text-secondary">{item.description}</p></div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mx-auto max-w-4xl px-4 pb-14 pt-20 text-center lg:px-8">
        <div className="mb-3 flex items-center justify-center gap-3"><span className="h-px w-8 bg-accent" /><span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Dịch vụ nổi bật</span><span className="h-px w-8 bg-accent" /></div>
        <h2 className="font-headline text-3xl font-bold text-primary sm:text-4xl">Tận hưởng mọi tiện nghi theo cách riêng của bạn</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">Tám trải nghiệm được tuyển chọn để đáp ứng mọi nhu cầu nghỉ dưỡng, làm việc và kết nối trong suốt thời gian lưu trú.</p>
      </motion.section>

      <section id="services-list" className="scroll-mt-24 px-4 pb-24 lg:px-8">
        <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES_DATA.map((service, index) => <ServiceCard key={service.id} service={service} index={index} onViewDetail={setSelectedService} />)}
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary px-4 py-20 text-center lg:px-8">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" /><div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative mx-auto max-w-3xl">
          <span className="material-symbols-outlined mb-4 text-4xl text-accent">concierge</span>
          <h2 className="font-headline text-3xl font-bold text-white sm:text-4xl">Bạn cần một trải nghiệm riêng?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">Đội ngũ Concierge Sương Mai luôn sẵn sàng lắng nghe và thiết kế dịch vụ phù hợp với lịch trình của Quý khách.</p>
          <a href="tel:02438280000" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-primary transition-all hover:-translate-y-0.5 hover:bg-accent-hover"><span className="material-symbols-outlined text-[20px]">call</span>Gọi lễ tân 24/7</a>
        </motion.div>
      </section>

      <ServiceDetailModal service={selectedService} onClose={() => setSelectedService(null)} />
    </div>
  );
};

export default ServicesPage;
