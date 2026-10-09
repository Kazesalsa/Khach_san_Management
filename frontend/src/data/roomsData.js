/**
 * Dữ liệu mẫu hoàn chỉnh cho Hệ thống Khách sạn Sương Mai
 * Phong cách: Indochine Heritage Luxury (Hà Nội Phố Cổ)
 */

export const ROOM_CATEGORIES = [
  { id: 'all', label: 'Tất cả hạng phòng', count: 5 },
  { id: 'deluxe', label: 'Phòng Deluxe Ban Công', count: 1 },
  { id: 'indochine-suite', label: 'Suite Đông Dương', count: 2 },
  { id: 'family', label: 'Căn Hộ Gia Đình', count: 1 },
  { id: 'president', label: 'Grand Suite Tổng Thống', count: 1 },
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

export const ROOMS_DATA = [
  {
    id: 'deluxe-co-dien-ban-cong',
    slug: 'deluxe-co-dien-ban-cong',
    name: 'Deluxe Cổ Điển Ban Công',
    nameEn: 'Classic Deluxe Balcony Room',
    category: 'deluxe',
    view: 'pho-co',
    viewLabel: 'Phố Hàng Bè - Phố Cổ',
    tub: 'french',
    tubLabel: 'Bồn Sứ Chân Rồng Pháp',
    floor: 'Tầng 2 - Tầng 4',
    rating: 4.9,
    reviewsCount: 128,
    status: {
      type: 'available',
      text: 'Còn 3 phòng trống',
      badgeColor: 'bg-emerald-800 text-white',
      availableCount: 3,
    },
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCckT64eh-Cvn7RknxHHBSFG4cKKZ_82-eXZShYNY3QMKV2rdqF2qC3CD9F960_i4vxBzMYCQQXUQESDzF6PFUA40JHngcXdut0MTF_KRDv5DLD73Kml8i-eayJNG86vMnb1GegpjRYf3YyxCVEiBRUfM9AgiT0TrHFZ6ihZlMr49bdy5j3DDqYoRpRF4RnnmP6Q2wFXVzdRMr7GjajaLlaHeoKZkIJGi6A4Zyvap8rEXU6BUN_IHPr',
        caption: 'Phòng ngủ phong cách Indochine với ban công vòm sắt mở ra phố Hàng Bè',
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEO5ivCIEf-os9sfCPlGBzMjkZNT89sgg58WLF7qARLAyS0AT5S_flgcwWgkC30N2CqOeXNO0YcVIVABCfPdONoCPzZmtS3U0MfmQJ_PgV-3LNi9JdaZv6lX0AUYMRoWkXeN6_zVi2_y9GtFlS2vloerqGgnDdGd-xvR4MfNMGXo0TFEz9lYrJT20O4nDjc38gkQ_pw0WunZXT34gGjySmoWWKElVaSqODxKnpoOQ',
        caption: 'Không gian giường King ấm cúng với chi tiết gạch bông cổ điển',
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAbvJIFrIXJ7BDwtSOnPlFAwTQQkpQC8PqtrpgxC3r0V7yyyhAzd9b_F1ejWXg0TID039eth_tchPdqDVEd6724AzBOFWVPsTyEmmzqwqv4IENlb1PqBVAarULYr6m6tT56fZI_lgE6_fdUVzwExyCHQwEyZB5SSj3jS2YkucPt36FB2KjhBerbRcs7borvtte8GFtuJmwRyUYPl5gwyTSDLZkLCQOg6CMW0sMqOc',
        caption: 'Bồn tắm sứ Pháp cổ điển view cửa chớp gỗ tếch đón nắng',
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOGmz0wSNBwJYmWIXDDd7EnYXe_vZaQ91LEcn9ozTHPtN8jK-zaiCYXDQe10G16X-lw1C4D8eyAYuJ7B5Ep6gbREHtwbOPpYIkq38gtfSAbkti4iMUWHQk-vk8hSXAuBil5kPWZy4Dff2Qz-sfZt6TSO0YL0O-aS9la10xPPCeI0-SPyxA1YbYq5dkj2HGCRCT4x1gTg8N5QRHmfZQy9KK4OhOjH9m0By4gkcKFv9xucV2jQujEg_T',
        caption: 'Góc đọc sách thư thái và bàn trà thủ công Hà Thành',
      }
    ],
    specs: {
      area: 32,
      bed: '1 King Lớn (1.8m x 2m)',
      guests: 2,
      guestsLabel: '2 Người lớn',
      maxGuests: 3,
      tub: 'Bồn Sứ Pháp Chân Rồng',
      bathroomCount: 1,
      smoking: 'Không hút thuốc',
    },
    shortDescription: 'Thiết kế tinh xảo với ban công vòm sắt hoa văn Pháp mở thẳng ra phố Hàng Bè rực rỡ sắc màu di sản, ngập tràn ánh nắng ban mai cùng hương ngọc lan dịu nhẹ.',
    fullDescription: 'Căn phòng Deluxe Ban Công Sương Mai tái hiện trọn vẹn nét lãng mạn của những căn biệt thự Pháp cổ tại Hà Nội đầu thế kỷ 20. Từ sàn gạch bông hoa văn thủ công, cửa chớp gỗ tếch màu trầm đến chiếc ban công sắt uốn nghệ thuật nhìn xuống nhịp sống thanh bình phố Hàng Bè. Phòng được trang bị nệm lò xo túi độc lập cao cấp, bồn tắm sứ chân rồng đúc nguyên khối và bộ sản phẩm chăm sóc da thảo mộc hữu cơ Tây Hồ.',
    amenities: [
      'Ban công vòm sắt ngắm phố cổ',
      'Miễn phí trà sen Tây Hồ & Cà phê Nespresso',
      'Bồn tắm sứ chân rồng kiểu Pháp',
      'Wifi 6 phủ sóng tốc độ cao',
      'Bữa sáng Buffet di sản Việt - Pháp',
      'Smart TV 55 inch chuẩn 4K',
      'Áo choàng lụa tơ tằm thủ công',
      'Két sắt an toàn & Minibar cao cấp'
    ],
    amenitiesCategorized: {
      bedroom: [
        'Nệm lò xo túi 7 vùng cao cấp',
        'Ga trải giường cotton satin 400 sợi',
        'Gối lông vũ êm ái chống dị ứng',
        'Bàn làm việc gỗ tếch thủ công',
        'Rèm cửa 2 lớp cản sáng 100%'
      ],
      bathroom: [
        'Bồn tắm sứ chân rồng Pháp',
        'Vòi sen đứng mưa nhiệt độ ổn định',
        'Bộ đồ dùng vệ sinh hữu cơ thảo dược',
        'Gương trang điểm có đèn LED nghệ thuật',
        'Máy sấy tóc công suất 2000W'
      ],
      technology: [
        'Smart TV Sony 55" kết nối Netflix, YouTube',
        'Hệ thống điều hòa 2 chiều lọc ion âm',
        'Wifi 6 tốc độ cao riêng từng phòng',
        'Cổng sạc đa năng USB & Type-C đầu giường'
      ],
      services: [
        'Miễn phí trà sen ướp hoa tươi mỗi chiều',
        'Bữa sáng buffet phong vị Pháp - Việt',
        'Dọn phòng 2 lần/ngày (Turn-down service)',
        'Dịch vụ giặt là lấy ngay trong ngày'
      ]
    },
    pricing: {
      originalPrice: 1500000,
      price: 1200000,
      discountPercent: 20,
      priceUnit: '/ đêm',
      includedNote: 'Đã bao gồm bữa sáng Buffet & Thuế phí VAT',
      depositPercent: 30,
      depositAmount: 360000,
      weekendSurcharge: 150000,
      cleaningFee: 0,
      perks: [
        'Tặng 01 voucher đồ uống tại Quán Trà Mai Lounge',
        'Miễn phí nhận phòng sớm từ 11:00 AM (tùy tình trạng phòng)',
        'Hỗ trợ giữ hành lý 24/7 trước và sau khi lưu trú'
      ]
    },
    policies: {
      checkIn: '14:00',
      checkOut: '12:00',
      cancellation: 'Miễn phí hủy phòng trước 48 giờ so với giờ nhận phòng tiêu chuẩn. Hủy sau thời gian này phí là 100% tiền cọc đêm đầu tiên.',
      deposit: 'Cần đặt cọc trước 30% giá trị đặt phòng để khóa phòng trên hệ thống. 70% còn lại thanh toán khi làm thủ tục nhận phòng.',
      children: 'Trẻ em dưới 6 tuổi ở chung giường với bố mẹ miễn phí bữa sáng. Trẻ em từ 6-11 tuổi phụ thu bữa sáng 150.000₫/ngày.',
      pets: 'Không cho phép mang thú cưng nhằm đảm bảo môi trường thanh tịnh và tiêu chuẩn dị ứng cho mọi khách lưu trú.'
    },
    reviews: [
      {
        author: 'Nguyễn Hải Đăng',
        date: 'Tháng 8, 2024',
        rating: 5,
        comment: 'Phòng sạch sẽ tinh tươm, chiếc ban công nhìn xuống phố Hàng Bè rất thơ. Bữa sáng phở gà phố cổ và bánh sừng bò thơm phức.'
      },
      {
        author: 'Claire Dufresne',
        date: 'Tháng 7, 2024',
        rating: 4.8,
        comment: 'A lovely Indochine sanctuary in Hanoi Old Quarter. The French cast iron bathtub is marvelous after a long walk.'
      }
    ]
  },
  {
    id: 'premier-indochine-garden-view',
    slug: 'premier-indochine-garden-view',
    name: 'Premier Indochine Garden View',
    nameEn: 'Premier Indochine Garden View Suite',
    category: 'indochine-suite',
    view: 'san-vuon',
    viewLabel: 'Vườn Sen Tĩnh & Giếng Trời',
    tub: 'wood',
    tubLabel: 'Bồn Gỗ Sồi Thảo Dược Bắc Bộ',
    floor: 'Tầng 2 - Tầng 5 • Khu Yên Tĩnh',
    rating: 4.95,
    reviewsCount: 210,
    status: {
      type: 'popular',
      text: 'Được đặt nhiều nhất',
      badgeColor: 'bg-amber-700 text-white',
      availableCount: 2,
    },
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSZuMo5x1HHrn6SeKf_ZSYwCt2RNKMusywocmGyuPEtnaCX15-vsn2GLEk3AsA2ctaFLBzSTvt6ioRizV9KvXCyoP_8O2m0aDZgs3MiKWzqcWRx32QaOeZ5RYzZ78ZMFU6hOStxs1g1pPPmVACnvLQkugjYEIWtoYmSvVPwlaTm2j2wYeoSrsNmo9GF0QWtWfQWBiu0fb1OvGaF3YvBUSbzw-uJV-f6F2oQkD5bc_nrEb5eokFq1XT',
        caption: 'Không gian tĩnh lặng nhìn ra vườn sen nội khu với bồn tắm gỗ sồi tự nhiên',
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAbvJIFrIXJ7BDwtSOnPlFAwTQQkpQC8PqtrpgxC3r0V7yyyhAzd9b_F1ejWXg0TID039eth_tchPdqDVEd6724AzBOFWVPsTyEmmzqwqv4IENlb1PqBVAarULYr6m6tT56fZI_lgE6_fdUVzwExyCHQwEyZB5SSj3jS2YkucPt36FB2KjhBerbRcs7borvtte8GFtuJmwRyUYPl5gwyTSDLZkLCQOg6CMW0sMqOc',
        caption: 'Giường King rộng rãi kết hợp nội thất mây tre đan thủ công',
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOGmz0wSNBwJYmWIXDDd7EnYXe_vZaQ91LEcn9ozTHPtN8jK-zaiCYXDQe10G16X-lw1C4D8eyAYuJ7B5Ep6gbREHtwbOPpYIkq38gtfSAbkti4iMUWHQk-vk8hSXAuBil5kPWZy4Dff2Qz-sfZt6TSO0YL0O-aS9la10xPPCeI0-SPyxA1YbYq5dkj2HGCRCT4x1gTg8N5QRHmfZQy9KK4OhOjH9m0By4gkcKFv9xucV2jQujEg_T',
        caption: 'Góc ban công ngập tràn ánh hoàng hôn ấm áp',
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEO5ivCIEf-os9sfCPlGBzMjkZNT89sgg58WLF7qARLAyS0AT5S_flgcwWgkC30N2CqOeXNO0YcVIVABCfPdONoCPzZmtS3U0MfmQJ_PgV-3LNi9JdaZv6lX0AUYMRoWkXeN6_zVi2_y9GtFlS2vloerqGgnDdGd-xvR4MfNMGXo0TFEz9lYrJT20O4nDjc38gkQ_pw0WunZXT34gGjySmoWWKElVaSqODxKnpoOQ',
        caption: 'Bàn trà cung đình đón tiếp chu đáo',
      }
    ],
    specs: {
      area: 38,
      bed: 'King Lớn hoặc 2 Giường Đơn Twin',
      guests: 3,
      guestsLabel: '2 Lớn + 1 Bé',
      maxGuests: 3,
      tub: 'Bồn Gỗ Sồi Tự Nhiên',
      bathroomCount: 1,
      smoking: 'Không hút thuốc',
    },
    shortDescription: 'Khoảng trời riêng biệt nhìn xuống vườn thiền hoa sen và giếng trời cổ kính. Nổi bật với bồn tắm gỗ sồi ngâm thảo dược cổ truyền mang lại sự tĩnh tại tuyệt đối.',
    fullDescription: 'Premier Indochine Garden View là sự lựa chọn ưu tiên của những ai tìm kiếm sự tĩnh tại thanh khiết. Nằm ở cánh nam của khách sạn, phòng hướng trọn vẹn ra khu vườn giếng trời với tiểu cảnh hồ sen và rặng trúc xanh. Điểm nhấn đặc sắc là bồn tắm tròn gỗ sồi tự nhiên được chuẩn bị sẵn gói thảo mộc ngâm chân thư giãn tinh chế từ lá ngải, quế chi và muối hầm cổ truyền.',
    amenities: [
      'View Sân Vườn Giếng Trời Thanh Tịnh',
      'Bồn tắm gỗ sồi ngâm thảo dược',
      'Hệ thống âm thanh Bluetooth Marshall cao cấp',
      'Ban công ghế mây ngắm cảnh riêng biệt',
      'Tặng 01 set trà chiều Indochine',
      'Bộ mỹ phẩm Organic Herb nguồn gốc tự nhiên',
      'Nệm lò xo nhập khẩu êm ái chống ồn',
      'Minibar miễn phí đồ uống không cồn'
    ],
    amenitiesCategorized: {
      bedroom: [
        'Giường ngủ gỗ mun bọc nệm lông ngỗng',
        'Ga trải giường lụa Tencel mềm mịn',
        'Loa bluetooth Marshall Acton III',
        'Gương đứng toàn thân viền đồng'
      ],
      bathroom: [
        'Bồn tắm gỗ sồi ngâm thảo dược',
        'Muối tắm biển tự nhiên & Tinh dầu sả chanh',
        'Buồng tắm kính cường lực riêng biệt',
        'Áo choàng waffle dệt tổ ong thoáng mát'
      ],
      technology: [
        'TV thông minh 55" sắc nét',
        'Đèn cảm ứng ban đêm thông minh',
        'Khóa cửa thẻ từ kết nối bảo mật'
      ],
      services: [
        'Liệu trình ngâm chân thảo mộc chuẩn bị sẵn',
        '01 ấm trà cung đình đón khách',
        'Ưu tiên đặt bàn tại Nhà Hàng Maison'
      ]
    },
    pricing: {
      originalPrice: 1900000,
      price: 1550000,
      discountPercent: 18,
      priceUnit: '/ đêm',
      includedNote: 'Tặng 01 set trà cung đình chiều & Ăn sáng Buffet',
      depositPercent: 30,
      depositAmount: 465000,
      weekendSurcharge: 200000,
      cleaningFee: 0,
      perks: [
        'Tặng 01 set trà cung đình chiều thưởng ngoạn tại ban công',
        'Giảm 15% tất cả dịch vụ trị liệu tại Sương Mai Lotus Spa',
        'Check-in linh hoạt sớm 1 tiếng'
      ]
    },
    policies: {
      checkIn: '14:00',
      checkOut: '12:00',
      cancellation: 'Miễn phí hủy phòng trước 48 giờ so với giờ nhận phòng tiêu chuẩn.',
      deposit: 'Đặt cọc 30% khi xác nhận lịch giữ phòng.',
      children: 'Phù hợp tối đa 2 người lớn và 1 trẻ em dưới 12 tuổi.',
      pets: 'Không áp dụng cho thú cưng.'
    },
    reviews: [
      {
        author: 'Đặng Thảo My',
        date: 'Tháng 9, 2024',
        rating: 5,
        comment: 'Bồn gỗ sồi thơm ngát mùi thảo dược ngâm xong người nhẹ bẫng. Giường êm ngủ sâu giấc đến tận trưa.'
      }
    ]
  },
  {
    id: 'suite-cao-cap-dong-duong',
    slug: 'suite-cao-cap-dong-duong',
    name: 'Suite Cao Cấp Đông Dương',
    nameEn: 'Signature Indochine Junior Suite',
    category: 'indochine-suite',
    view: 'pho-co',
    viewLabel: 'Phố Cổ Trên Cao',
    tub: 'jacuzzi',
    tubLabel: 'Bồn Sục Jacuzzi Đôi Thủy Lực',
    floor: 'Tầng 5 - Tầng 7 • Phòng Khách Riêng',
    rating: 4.98,
    reviewsCount: 185,
    status: {
      type: 'signature',
      text: 'Signature Suite',
      badgeColor: 'bg-primary text-secondary-fixed',
      availableCount: 2,
    },
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0ggCRilcMt-cOMY--I3Podg1JFH9qrQ8db6xcIeMFJyHvQ-Rl9bKROnDs_hFs1_aaENFFM4xexQm2wshc4xvKJflAN4YqXsyj82mjAAgRjIph2XkHMOTDlQOe2FnRXIEwK5a3JRHpON9yx8pe72fTaffxf2J8ncNQXRwmtedt1x4y1JJZWFxJwl862crLOokRU0junnRCe3D5t2Y6jQ2GCQus9rwe8lm9AhItEfXmLmv1m-xQS05u',
        caption: 'Phòng khách tiếp đón hoàng gia tách biệt với phòng ngủ Indochine lộng lẫy',
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOGmz0wSNBwJYmWIXDDd7EnYXe_vZaQ91LEcn9ozTHPtN8jK-zaiCYXDQe10G16X-lw1C4D8eyAYuJ7B5Ep6gbREHtwbOPpYIkq38gtfSAbkti4iMUWHQk-vk8hSXAuBil5kPWZy4Dff2Qz-sfZt6TSO0YL0O-aS9la10xPPCeI0-SPyxA1YbYq5dkj2HGCRCT4x1gTg8N5QRHmfZQy9KK4OhOjH9m0By4gkcKFv9xucV2jQujEg_T',
        caption: 'Bồn sục Jacuzzi đôi ngập tràn hoa hồng tự nhiên',
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCckT64eh-Cvn7RknxHHBSFG4cKKZ_82-eXZShYNY3QMKV2rdqF2qC3CD9F960_i4vxBzMYCQQXUQESDzF6PFUA40JHngcXdut0MTF_KRDv5DLD73Kml8i-eayJNG86vMnb1GegpjRYf3YyxCVEiBRUfM9AgiT0TrHFZ6ihZlMr49bdy5j3DDqYoRpRF4RnnmP6Q2wFXVzdRMr7GjajaLlaHeoKZkIJGi6A4Zyvap8rEXU6BUN_IHPr',
        caption: 'Chi tiết đồ sơn mài và đồng thau đúc tỉ mỉ',
      }
    ],
    specs: {
      area: 48,
      bed: 'Super King Lớn (2m x 2.2m)',
      guests: 3,
      guestsLabel: '2 Lớn + 1 Bé',
      maxGuests: 3,
      tub: 'Bồn Sục Jacuzzi Đôi Thủy Lực',
      bathroomCount: 1,
      smoking: 'Không hút thuốc',
    },
    shortDescription: 'Không gian thượng lưu tách biệt gồm phòng khách tiếp đón sang trọng và phòng ngủ riêng. Tận hưởng bồn sục Jacuzzi đôi ngập tràn bọt hoa hồng cùng dịch vụ đưa đón sân bay 1 chiều.',
    fullDescription: 'Được thiết kế dành riêng cho những kỳ nghỉ trăng mật và những chuyến công tác thượng lưu, Suite Cao Cấp Đông Dương sở hữu diện tích 48m² phân bổ hài hòa giữa sảnh đón, phòng khách riêng và phòng ngủ vương giả. Phòng tắm lát đá cẩm thạch Ý kết hợp bồn Jacuzzi massage đôi với kính nhìn ra phố cổ, trang bị trọn vẹn mỹ phẩm L’Occitane en Provence.',
    amenities: [
      'Phòng khách hoàng gia tiếp khách riêng',
      'Bồn sục Jacuzzi đôi massage thủy lực',
      'Đưa đón sân bay Nội Bài 1 chiều miễn phí',
      'Check-in riêng tư tại phòng (In-room Check-in)',
      'Bộ mỹ phẩm cao cấp L’Occitane en Provence',
      'Máy pha cà phê hạt Nespresso & Trà Anh Quốc',
      'Hoa tươi cắm hàng ngày trong phòng khách',
      'Dịch vụ ủi đồ 02 món miễn phí mỗi ngày'
    ],
    amenitiesCategorized: {
      bedroom: [
        'Giường Super King bọc nhung hoàng gia',
        'Tủ quần áo gỗ gõ đỏ 4 cánh',
        'Bộ chăn ga lụa gấm thêu tay'
      ],
      bathroom: [
        'Bồn sục Jacuzzi đôi tạo bọt thư giãn',
        'Mỹ phẩm L’Occitane en Provence chính hãng',
        'Hai chậu rửa mặt đôi (His & Her)',
        'Gương sấy chống mờ sương nhiệt độ cao'
      ],
      technology: [
        '2 Smart TV 65" và 55" cho phòng khách & phòng ngủ',
        'Dàn loa soundbar rạp hát',
        'Bộ điều khiển rèm tự động thông minh'
      ],
      services: [
        'Xe đưa đón sân bay riêng 1 chiều',
        'Trà chiều phục vụ tận phòng miễn phí',
        'Quản gia hỗ trợ đặt lịch du lịch 24/7'
      ]
    },
    pricing: {
      originalPrice: 2600000,
      price: 2100000,
      discountPercent: 19,
      priceUnit: '/ đêm',
      includedNote: 'Miễn phí đón sân bay 1 chiều & Check-in riêng',
      depositPercent: 30,
      depositAmount: 630000,
      weekendSurcharge: 250000,
      cleaningFee: 0,
      perks: [
        'Miễn phí đưa đón sân bay Nội Bài 1 chiều bằng xe Sedan cao cấp',
        'Thủ tục check-in riêng tại phòng không cần chờ đợi ở sảnh',
        'Tặng đĩa hoa quả nhiệt đới tươi mới mỗi ngày'
      ]
    },
    policies: {
      checkIn: '14:00',
      checkOut: '12:00',
      cancellation: 'Miễn phí hủy phòng trước 48 giờ.',
      deposit: 'Cọc 30% để đảm bảo lịch đón xe sân bay và chuẩn bị phòng.',
      children: 'Miễn phí tối đa 1 trẻ em dưới 6 tuổi.',
      pets: 'Không cho phép mang thú cưng.'
    },
    reviews: [
      {
        author: 'Trần Minh Long',
        date: 'Tháng 10, 2024',
        rating: 5,
        comment: 'Căn Suite Đông Dương đem lại cảm giác bình yên đến ngỡ ngàng giữa phố cổ tấp nập. Bồn Jacuzzi sảng khoái và ấm trà sen chiều thật sự chạm tới trái tim người mê văn hóa xưa.'
      }
    ]
  },
  {
    id: 'grand-family-luxury-suite',
    slug: 'grand-family-luxury-suite',
    name: 'Grand Family Luxury Suite',
    nameEn: 'Grand Family 2-Bedroom Suite',
    category: 'family',
    view: 'pho-co',
    viewLabel: 'Phố Cổ & Khoảng Trời Riêng',
    tub: 'jacuzzi',
    tubLabel: 'Bồn Tắm Nằm + Buồng Tắm Đứng',
    floor: 'Tầng 6 • 2 Phòng Ngủ Biệt Lập',
    rating: 4.92,
    reviewsCount: 96,
    status: {
      type: 'family',
      text: 'Lý tưởng cho gia đình',
      badgeColor: 'bg-primary-dark text-amber-300',
      availableCount: 2,
    },
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATqDhB2M3SkBjJE-l68BXXYf9705GW6G2cHx23TPTuwYXls8ARDtdUMl2oferQTmDqMxA3OMDo9GH7nhtGvgo6EOKZiRma73fmEBdEgSpL187THSQ0z3x6561eoMDL30_hxIryXE6TtVkyq9Ek4aT_Mh9nqoiRMocO45WoRf86mTpffA9HlqgOfqnpKt67TBGTJSd0pSnlIWRannDiuA7Sc7F5rLU6xHWaQ0Rc4WISn6yrqWj8inZ4',
        caption: 'Căn hộ 2 phòng ngủ rộng 75m² ngập tràn ánh sáng tự nhiên cho cả nhà',
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACK-BH4l5SAj8en0qY40JKF9YVUtEbIsZ_mdnLPpl2W4SNh74HVQG5fCj-1t8IpKEbM0DnZy1nXZia5v4RNvgtq2rVl0bTpZlpGHYHTH0I5voMLHq9aoQ-EalzxVagmu2RETt-oMcr5rTTA34QMPu2SFVER8LwBEMWhqTeVxaLgkGwwzxEJJRduG9JjJDx8lK-b2DCNqlcC-s8gNoBP6vzZMex2hN99mmafcyx2mY',
        caption: 'Phòng sinh hoạt chung với bàn ăn gia đình và góc bếp tiện ích',
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSZuMo5x1HHrn6SeKf_ZSYwCt2RNKMusywocmGyuPEtnaCX15-vsn2GLEk3AsA2ctaFLBzSTvt6ioRizV9KvXCyoP_8O2m0aDZgs3MiKWzqcWRx32QaOeZ5RYzZ78ZMFU6hOStxs1g1pPPmVACnvLQkugjYEIWtoYmSvVPwlaTm2j2wYeoSrsNmo9GF0QWtWfQWBiu0fb1OvGaF3YvBUSbzw-uJV-f6F2oQkD5bc_nrEb5eokFq1XT',
        caption: 'Phòng trẻ em với hai giường đơn êm ái và đồ chơi gỗ thủ công',
      }
    ],
    specs: {
      area: 75,
      bed: '2 Giường King (2 Phòng Ngủ Riêng)',
      guests: 6,
      guestsLabel: '4 Lớn + 2 Bé',
      maxGuests: 6,
      tub: '2 Phòng Tắm Riêng (Bồn Nằm + Đứng)',
      bathroomCount: 2,
      smoking: 'Không hút thuốc',
    },
    shortDescription: 'Căn hộ 2 phòng ngủ thông minh với phòng sinh hoạt chung thoáng đãng, bàn ăn gia đình và góc bếp mini tinh tế. Trang bị trọn vẹn máy sấy tóc Dyson Supersonic và bộ quà tặng cho trẻ nhỏ.',
    fullDescription: 'Grand Family Luxury Suite mang đến không gian nghỉ ngơi trọn vẹn và an tâm cho những chuyến du lịch cùng cả gia đình nhiều thế hệ. Căn hộ gồm 1 phòng ngủ master với giường King và 1 phòng ngủ phụ nối liền tiện lợi, phòng khách trung tâm rộng rãi có bàn ăn 6 chỗ, góc bếp nhỏ trang bị lò vi sóng và tủ lạnh lớn.',
    amenities: [
      'Cấu trúc 2 phòng ngủ biệt lập hoàn toàn',
      '2 Phòng tắm riêng biệt không lo chờ đợi',
      'Máy sấy tóc cao cấp Dyson Supersonic',
      'Máy lọc không khí công nghệ Dyson HEPA',
      'Góc bếp mini trang bị lò vi sóng & bồn rửa',
      'Bao gồm bữa sáng Buffet cho cả gia đình',
      'Máy giặt sấy âm tủ tiện lợi dài ngày',
      'Bộ đồ dùng tắm và quà tặng riêng cho bé'
    ],
    amenitiesCategorized: {
      bedroom: [
        '1 Phòng ngủ Master (Giường King 2m)',
        '1 Phòng ngủ phụ (2 Giường đơn hoặc 1 Queen)',
        'Cũi trẻ em chuẩn bị sẵn theo yêu cầu',
        'Bàn làm việc yên tĩnh'
      ],
      bathroom: [
        '2 Phòng tắm đầy đủ tiện nghi',
        'Bộ dầu gội sữa tắm dịu nhẹ cho trẻ nhỏ',
        'Bồn tắm nằm cho bé vẫy vùng an toàn',
        'Áo choàng tắm kích cỡ người lớn & trẻ em'
      ],
      technology: [
        'Máy lọc không khí Dyson cao cấp',
        '3 TV độc lập cho từng không gian',
        'Tủ lạnh lớn 2 cửa dung tích 180L'
      ],
      services: [
        'Bao gồm bữa sáng buffet cho 4 người lớn + 2 trẻ em',
        'Xe 7 chỗ đưa đón sân bay 2 chiều với phí ưu đãi',
        'Dịch vụ trông trẻ có chứng chỉ (theo yêu cầu)'
      ]
    },
    pricing: {
      originalPrice: 4200000,
      price: 3500000,
      discountPercent: 17,
      priceUnit: '/ đêm',
      includedNote: 'Bao gồm bữa sáng trọn gói cho cả gia đình',
      depositPercent: 30,
      depositAmount: 1050000,
      weekendSurcharge: 300000,
      cleaningFee: 0,
      perks: [
        'Bao gồm trọn vẹn bữa sáng Buffet cho tối đa 4 người lớn và 2 trẻ em',
        'Miễn phí dịch vụ giặt ủi 4 bộ trang phục/ngày',
        'Tặng bộ kit trò chơi dân gian Hà Nội cho trẻ nhỏ'
      ]
    },
    policies: {
      checkIn: '14:00',
      checkOut: '12:00',
      cancellation: 'Miễn phí hủy phòng trước 48 giờ.',
      deposit: 'Cọc 30% giá trị đặt phòng.',
      children: 'Tiêu chuẩn cho 4 người lớn và 2 bé dưới 12 tuổi.',
      pets: 'Không cho phép mang thú cưng.'
    },
    reviews: [
      {
        author: 'Gia đình Bác sĩ An Phương',
        date: 'Tháng 11, 2024',
        rating: 5,
        comment: 'Gia đình tôi gồm 4 người ở Grand Family Suite. Cực kỳ rộng rãi, sạch bóng không tì vết, các bé mê mẩn góc trà bánh và chiếc máy sấy Dyson tiện dụng vô cùng.'
      }
    ]
  },
  {
    id: 'suong-mai-grand-suite-tong-thong',
    slug: 'suong-mai-grand-suite-tong-thong',
    name: 'Sương Mai Grand Suite Tổng Thống',
    nameEn: 'Sương Mai Presidential Penthouse Suite',
    category: 'president',
    view: 'ho-guom',
    viewLabel: 'Toàn Cảnh Hồ Hoàn Kiếm 360°',
    tub: 'jacuzzi',
    tubLabel: 'Hồ Sục Jacuzzi Panorama & Sauna',
    floor: 'Tầng 8 Rooftop Áp Mái Độc Bản',
    rating: 5.0,
    reviewsCount: 42,
    status: {
      type: 'president',
      text: 'Đỉnh Cao Tuyệt Tác Di Sản',
      badgeColor: 'bg-amber-600 text-slate-950 font-bold',
      availableCount: 1,
    },
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8h_yb6Dfnr2P0KkCQx4gIZK5S1YB9ny4jkRrpftLXJ2-7A8CksS6UA3XTbuUJHoOWJDe_v5tzCMX7WDsKMhH7w3Ry0MGOdXXQ1iTHvf2MB1OwUUPijpfxl9yobH0dazrHKZ015Ugshh0xNrsN1QtNzG76nhMwKN8i-DlQvcFeOM1DfcBpc8tkts4NewqkCVlYfliVmZ6H77vpBTCPqBsmTcmWt57B7ETeMtR1mMZy8rd6Wf1IvXX2',
        caption: 'Sân thượng áp mái với hồ sục Jacuzzi nước ấm nhìn trọn Tháp Rùa và Hồ Gươm',
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOGmz0wSNBwJYmWIXDDd7EnYXe_vZaQ91LEcn9ozTHPtN8jK-zaiCYXDQe10G16X-lw1C4D8eyAYuJ7B5Ep6gbREHtwbOPpYIkq38gtfSAbkti4iMUWHQk-vk8hSXAuBil5kPWZy4Dff2Qz-sfZt6TSO0YL0O-aS9la10xPPCeI0-SPyxA1YbYq5dkj2HGCRCT4x1gTg8N5QRHmfZQy9KK4OhOjH9m0By4gkcKFv9xucV2jQujEg_T',
        caption: 'Phòng ngủ Master vương giả với kính viễn vọng thiên văn và ban công rộng',
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0ggCRilcMt-cOMY--I3Podg1JFH9qrQ8db6xcIeMFJyHvQ-Rl9bKROnDs_hFs1_aaENFFM4xexQm2wshc4xvKJflAN4YqXsyj82mjAAgRjIph2XkHMOTDlQOe2FnRXIEwK5a3JRHpON9yx8pe72fTaffxf2J8ncNQXRwmtedt1x4y1JJZWFxJwl862crLOokRU0junnRCe3D5t2Y6jQ2GCQus9rwe8lm9AhItEfXmLmv1m-xQS05u',
        caption: 'Bar rượu vang cá nhân và phòng xông hơi đá muối Himalaya',
      }
    ],
    specs: {
      area: 110,
      bed: 'Bespoke Emperor Bed (2.2m x 2.4m)',
      guests: 4,
      guestsLabel: '2 - 4 Khách VIP',
      maxGuests: 4,
      tub: 'Jacuzzi Nước Nóng Ngoài Trời + Sauna',
      bathroomCount: 2,
      smoking: 'Khu vực hút xì gà ngoài ban công',
    },
    shortDescription: 'Hạng phòng độc bản biểu tượng chiếm trọn tầng áp mái cao nhất. Sở hữu tầm nhìn 360 độ ôm trọn Tháp Rùa và mặt nước Hồ Gươm huyền thoại. Đi kèm quản gia riêng biệt 24/7 và đưa đón xe Maybach 2 chiều.',
    fullDescription: 'Là tuyệt phẩm đỉnh cao của Sương Mai Hotel, Suite Tổng Thống Penthouse độc chiếm trọn vẹn tầng thượng với diện tích 110m². Tại đây, quý khách thu trọn vẹn cảnh sắc lịch sử của Hồ Hoàn Kiếm và 36 phố phường vào tầm mắt. Điểm độc nhất vô nhị là hồ sục Jacuzzi nước nóng ngoài ban công ngắm sao đêm, phòng xông hơi đá muối Himalaya riêng biệt, quầy bar rượu vang Grand Cru và dịch vụ quản gia phục vụ riêng 24/7.',
    amenities: [
      'Hồ sục Jacuzzi nước ấm ngoài trời ngắm Hồ Gươm',
      'Đưa đón sân bay chuyên cơ mặt đất Maybach 2 chiều',
      'Quản gia riêng biệt (Private Butler) tận tâm 24/7',
      'Phòng xông hơi đá muối Himalaya & Sauna gỗ thông',
      'Bữa tối nến 5 món thượng hạng tại ban công riêng',
      'Quầy bar rượu vang hảo hạng miễn phí',
      'Bộ đồ dùng phòng tắm hoàng gia Diptyque Paris',
      'Thủ tục hải quan sân bay ưu tiên Fast-track VIP'
    ],
    amenitiesCategorized: {
      bedroom: [
        'Giường Emperor Bed bọc da thủ công Ý',
        'Gối nệm lụa tơ tằm nguyên bản Hà Đông',
        'Kính thiên văn quang học ngắm trăng sao',
        'Tủ bảo quản xì gà kiểm soát độ ẩm'
      ],
      bathroom: [
        'Hồ sục Jacuzzi ngoài trời panorama',
        'Phòng sauna đá muối hồng Himalaya',
        'Mỹ phẩm Diptyque Paris dung tích lớn',
        'Vòi hoa sen âm trần hiệu ứng mưa nhiệt đới'
      ],
      technology: [
        'Hệ thống âm thanh hi-end Devialet Phantom',
        'Màn chiếu 120 inch 4K Laser Cinema',
        'Nhà thông minh điều khiển giọng nói đa ngữ'
      ],
      services: [
        'Quản gia Hoàng Kim phục vụ riêng 24/7',
        'Đưa đón xe Maybach 2 chiều đón tận cửa máy bay',
        'Rượu Champagne Dom Pérignon chào đón khi nhận phòng'
      ]
    },
    pricing: {
      originalPrice: 8000000,
      price: 6800000,
      discountPercent: 15,
      priceUnit: '/ đêm',
      includedNote: 'Trọn gói đặc quyền VIP Hoàng Gia & Quản gia 24/7',
      depositPercent: 50,
      depositAmount: 3400000,
      weekendSurcharge: 500000,
      cleaningFee: 0,
      perks: [
        'Đón tiễn sân bay bằng xe Maybach 2 chiều đẳng cấp',
        'Quản gia riêng phục vụ bữa sáng và trà chiều bất kỳ lúc nào',
        'Tặng 01 chai Champagne Dom Pérignon và tiệc nướng BBQ ban công'
      ]
    },
    policies: {
      checkIn: 'Linh hoạt theo giờ đáp chuyến bay của quý khách',
      checkOut: 'Trả phòng muộn miễn phí tới 16:00',
      cancellation: 'Miễn phí hủy hoặc đổi ngày lưu trú trước 72 giờ.',
      deposit: 'Cọc 50% khi xác nhận đặt phòng bảo đảm.',
      children: 'Chào đón trẻ em với sự chăm sóc của bảo mẫu riêng.',
      pets: 'Thú cưng kích cỡ nhỏ được phép khi thông báo trước.'
    },
    reviews: [
      {
        author: 'Henri Laurent',
        date: 'Tháng 10, 2024',
        rating: 5,
        comment: 'Suite Tổng Thống áp mái đem lại tầm nhìn Hồ Gươm không đâu sánh bằng. Quản gia Hoàng cực kỳ chu đáo, chuẩn bị từng tách cà phê trứng buổi sáng đúng điệu Hà Thành.'
      }
    ]
  }
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
