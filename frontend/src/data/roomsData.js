/**
 * Cấu hình danh mục và bộ lọc cho Hệ thống Khách sạn Sương Mai
 * Dữ liệu phòng và hình ảnh hiện tại được tải 100% động từ Database qua API /api/rooms/public
 */

export const ROOM_CATEGORIES = [
  { id: 'all', label: 'Tất cả hạng phòng' },
  { id: 'standard', label: 'Tiêu Chuẩn (Standard)' },
  { id: 'superior', label: 'Cao Cấp (Superior)' },
  { id: 'deluxe', label: 'Phòng Deluxe' },
  { id: 'suite', label: 'Suite Tổng Thống' },
];

export const ROOM_VIEWS = [
  { value: 'all', label: 'Mọi hướng nhìn' },
  { value: 'pho-co', label: 'Phố Cổ Hoàn Kiếm' },
  { value: 'ho-guom', label: 'Hồ Hoàn Kiếm (Panorama)' },
  { value: 'san-vuon', label: 'Vườn Trong Yên Tĩnh' },
];

export const TUB_TYPES = [
  { value: 'all', label: 'Mọi tiện ích tắm' },
  { value: 'french', label: 'Bồn tắm sứ Pháp cổ' },
  { value: 'jacuzzi', label: 'Bồn sục Jacuzzi massage' },
  { value: 'wood', label: 'Bồn gỗ sồi ngâm thảo dược' },
];

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Được gợi ý nhiều nhất' },
  { value: 'price-asc', label: 'Giá: Thấp đến Cao' },
  { value: 'price-desc', label: 'Giá: Cao đến Thấp' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
  { value: 'area', label: 'Diện tích lớn nhất' },
];



export const COMPARISON_MATRIX = {
  columns: [
    { key: 'deluxe', name: 'Deluxe Ban Công', highlight: false },
    { key: 'premier', name: 'Premier Indochine', highlight: false },
    { key: 'suite', name: 'Suite Đông Dương', highlight: false },
    { key: 'family', name: 'Grand Family', highlight: false },
    { key: 'president', name: 'Grand Suite Tổng Thống', highlight: true }
  ],
  rows: [
    {
      feature: 'Diện tích sử dụng',
      values: {
        deluxe: '32 m²',
        premier: '38 m²',
        suite: '48 m²',
        family: '75 m²',
        president: '110 m²'
      }
    },
    {
      feature: 'Hướng nhìn chính (View)',
      values: {
        deluxe: 'Phố Hàng Bè',
        premier: 'Vườn sen tĩnh',
        suite: 'Phố cổ trên cao',
        family: 'Phố cổ',
        president: 'Toàn cảnh Hồ Gươm 360°'
      }
    },
    {
      feature: 'Bồn tắm & Thư giãn',
      values: {
        deluxe: 'Bồn sứ chân rồng Pháp',
        premier: 'Bồn gỗ sồi thảo mộc',
        suite: 'Jacuzzi massage đôi',
        family: 'Bồn nằm + Buồng đứng',
        president: 'Jacuzzi panorama + Sauna đá muối'
      }
    },
    {
      feature: 'Dịch vụ quản gia riêng',
      values: {
        deluxe: '—',
        premier: '—',
        suite: 'Hỗ trợ theo yêu cầu',
        family: 'Hỗ trợ riêng gia đình',
        president: '24/7 Riêng biệt (Butler)'
      }
    },
    {
      feature: 'Đưa đón sân bay Nội Bài',
      values: {
        deluxe: 'Phí ưu đãi 350.000₫',
        premier: 'Phí ưu đãi 350.000₫',
        suite: 'Miễn phí 1 chiều',
        family: 'Xe 7 chỗ 2 chiều',
        president: 'Xe Maybach VIP 2 chiều'
      }
    },
    {
      feature: 'Mỹ phẩm phòng tắm cao cấp',
      values: {
        deluxe: 'Organic Herb tự nhiên',
        premier: 'Organic Herb thảo mộc',
        suite: 'L’Occitane en Provence',
        family: 'L’Occitane + Set cho bé',
        president: 'Diptyque Paris Luxury'
      }
    },
    {
      feature: 'Buffet sáng & Trà chiều',
      values: {
        deluxe: 'Buffet sáng',
        premier: 'Buffet sáng + Set trà chiều',
        suite: 'Buffet sáng + Trà chiều tại phòng',
        family: 'Buffet sáng cả gia đình',
        president: 'Buffet/Alacarte + Champagne'
      }
    }
  ]
};

export const DIRECT_BOOKING_PRIVILEGES = [
  {
    icon: 'verified',
    title: 'Cam Kết Giá Tốt Nhất',
    description: 'Đảm bảo mức giá ưu đãi nhất so với tất cả các kênh đại lý du lịch trực tuyến. Tặng ngay voucher 200.000₫ cho dịch vụ Spa khi đặt online trực tiếp.'
  },
  {
    icon: 'event_repeat',
    title: 'Miễn Phí Hủy Phòng 48 Giờ',
    description: 'Linh hoạt kế hoạch di chuyển. Hoàn tiền 100% hoặc đổi ngày lưu trú miễn phí khi thông báo trước 48 tiếng so với giờ nhận phòng tiêu chuẩn.'
  },
  {
    icon: 'upgrade',
    title: 'Ưu Tiên Nâng Hạng Phòng',
    description: 'Tự động ưu tiên nâng hạng lên Suite kế tiếp khi có phòng trống lúc nhận phòng, đồng thời hỗ trợ thủ tục nhận phòng sớm hoặc trả phòng muộn tới 14:00.'
  }
];

export const TESTIMONIALS_DATA = [
  {
    initials: 'TL',
    name: 'Trần Minh Long',
    stayDate: 'Khách lưu trú Suite Đông Dương • Tháng 10/2024',
    rating: 5,
    quote: '"Căn Suite Đông Dương đem lại cảm giác bình yên đến ngỡ ngàng giữa phố cổ tấp nập. Bồn Jacuzzi sảng khoái và ấm trà sen chiều thật sự chạm tới trái tim người mê văn hóa xưa."'
  },
  {
    initials: 'AP',
    name: 'Gia đình Bác sĩ An Phương',
    stayDate: 'Khách lưu trú Grand Family Suite • Tháng 11/2024',
    rating: 5,
    quote: '"Gia đình tôi gồm 4 người ở Grand Family Suite. Cực kỳ rộng rãi, sạch bóng không tì vết, các bé mê mẩn góc trà bánh và chiếc máy sấy Dyson tiện dụng vô cùng."'
  },
  {
    initials: 'HL',
    name: 'Henri Laurent',
    stayDate: 'Lưu trú Suite Tổng Thống • Paris, Pháp',
    rating: 5,
    quote: '"Suite Tổng Thống áp mái đem lại tầm nhìn Hồ Gươm không đâu sánh bằng. Quản gia Hoàng cực kỳ chu đáo, chuẩn bị từng tách cà phê trứng buổi sáng đúng điệu Hà Thành."'
  }
];
