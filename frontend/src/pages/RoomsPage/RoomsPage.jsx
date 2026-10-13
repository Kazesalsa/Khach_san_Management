import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicRooms } from '../../services/roomService';
import Breadcrumb from '../../components/ui/Breadcrumb';
import RoomHeroBanner from '../../components/Rooms/RoomHeroBanner';
import RoomFilterBar from '../../components/Rooms/RoomFilterBar';
import RoomCard from '../../components/Rooms/RoomCard';
import Pagination from '../../components/Rooms/Pagination';
import RoomComparisonMatrix from '../../components/Rooms/RoomComparisonMatrix';
import DirectBookingPrivileges from '../../components/Rooms/DirectBookingPrivileges';
import RoomTestimonials from '../../components/Rooms/RoomTestimonials';
import { EmptyState, ConnectionErrorState } from '../../components/Rooms/EmptyState';
import { RoomCardSkeleton } from '../../components/ui/SkeletonLoader';
import BookingConfirmModal from '../../components/Rooms/BookingConfirmModal';

const RoomsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Đọc các tham số tìm kiếm từ URL
  const paramCheckIn = searchParams.get('checkIn') || '';
  const paramCheckOut = searchParams.get('checkOut') || '';
  const paramAdults = searchParams.get('adults') || searchParams.get('guests') || '';
  const paramChildren = searchParams.get('children') || '0';
  const paramCategory = searchParams.get('category') || 'all';

  const initialGuestsFilter = useMemo(() => {
    if (!paramAdults) return 'all';
    const total = Number(paramAdults) + Number(paramChildren || 0);
    if (total === 1) return '1';
    if (total === 2) return '2';
    if (total === 3 || total === 4) return '3-4';
    if (total >= 5) return '5+';
    return 'all';
  }, [paramAdults, paramChildren]);

  // Filter & Search States
  const [selectedCategory, setSelectedCategory] = useState(paramCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedGuests, setSelectedGuests] = useState(initialGuestsFilter);
  const [selectedView, setSelectedView] = useState('all');
  const [selectedTub, setSelectedTub] = useState('all');
  const [selectedSort, setSelectedSort] = useState('recommended');

  // Cập nhật khi tham số URL thay đổi
  useEffect(() => {
    if (paramCategory) setSelectedCategory(paramCategory);
    if (initialGuestsFilter) setSelectedGuests(initialGuestsFilter);
  }, [paramCategory, initialGuestsFilter]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Prototype & Edge Cases Simulation States
  const [isLoading, setIsLoading] = useState(false);
  const [hasConnectionError, setHasConnectionError] = useState(false);

  // Selected room for booking modal
  const [bookingRoom, setBookingRoom] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedPriceRange('all');
    setSelectedGuests('all');
    setSelectedView('all');
    setSelectedTub('all');
    setSelectedSort('recommended');
    setCurrentPage(1);
  };

  const [roomsList, setRoomsList] = useState([]);

  // Tải danh sách phòng và hình ảnh thực tế từ database
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    getPublicRooms().then((dbRooms) => {
      if (mounted && Array.isArray(dbRooms) && dbRooms.length > 0) {
        const mapped = dbRooms.map((r) => {
          const categorySlug = r.categoryId === 'cat-4' ? 'president' :
                               r.categoryId === 'cat-3' ? 'deluxe' :
                               r.categoryId === 'cat-2' ? 'indochine-suite' : 'deluxe';
          return {
            id: r.id,
            slug: r.roomCode?.toLowerCase() || r.id,
            roomCode: r.roomCode,
            roomNumber: r.roomNumber,
            name: r.name,
            nameEn: `${r.categoryName} Room ${r.roomNumber}`,
            category: categorySlug,
            view: 'pho-co',
            viewLabel: `Tầng ${r.floor} - View thoáng`,
            tub: 'french',
            tubLabel: 'Bồn tắm cao cấp',
            floor: `Tầng ${r.floor}`,
            rating: 4.9,
            reviewsCount: 120 + (parseInt(r.roomNumber, 10) || 5),
            status: {
              type: r.usageStatus === 'TRONG' ? 'available' : 'popular',
              text: r.usageStatus === 'TRONG' ? 'Còn phòng trống' : 'Đang sử dụng',
              badgeColor: 'bg-emerald-800 text-white',
              availableCount: r.usageStatus === 'TRONG' ? 1 : 0,
            },
            // DANH SÁCH ẢNH LẤY TRỰC TIẾP TỪ BẢNG phong_hinh_anh TRONG DATABASE
            images: r.images && r.images.length > 0 ? r.images.map((img) => ({
              url: img.url,
              caption: img.caption || `Ảnh phòng ${r.roomNumber} - ${r.categoryName}`
            })) : [
              { url: r.primaryImageUrl, caption: `Ảnh phòng ${r.roomNumber}` }
            ],
            specs: {
              area: r.categoryId === 'cat-4' ? 65 : r.categoryId === 'cat-3' ? 45 : 32,
              bed: r.maxCapacity >= 4 ? '2 King Lớn' : '1 King (1.8m x 2m)',
              guests: r.maxCapacity || 2,
              guestsLabel: `${r.maxCapacity || 2} Người lớn`,
              maxGuests: (r.maxCapacity || 2) + 1,
              tub: 'Bồn Sứ Pháp Chân Rồng',
              bathroomCount: 1,
              smoking: 'Không hút thuốc',
            },
            shortDescription: r.categoryDescription || `Phòng ${r.categoryName} tầng ${r.floor} tiện nghi tại Sương Mai Hotel.`,
            fullDescription: r.categoryDescription || `Phòng ${r.categoryName} tầng ${r.floor} khách sạn Sương Mai.`,
            amenities: r.amenities && r.amenities.length > 0 ? r.amenities : [
              'Ban công vòm sắt ngắm phố cổ',
              'Miễn phí trà sen Tây Hồ & Cà phê Nespresso',
              'Bồn tắm sứ chân rồng kiểu Pháp',
              'Wifi 6 phủ sóng tốc độ cao',
            ],
            pricing: {
              originalPrice: Number(r.originalPrice) || 1500000,
              price: Number(r.price) || 1200000,
              discountPercent: r.discountPercent || 20,
              priceUnit: '/ đêm',
              includedNote: 'Đã bao gồm bữa sáng Buffet & Thuế phí VAT',
              depositPercent: 30,
            }
          };
        });
        setRoomsList(mapped);
      }
    }).catch((err) => {
      console.warn('Lỗi tải danh sách phòng từ database:', err);
    }).finally(() => {
      if (mounted) setIsLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  // Filter & Sort Logic
  const filteredAndSortedRooms = useMemo(() => {
    return roomsList.filter((room) => {
      // Category filter
      if (selectedCategory !== 'all' && room.category !== selectedCategory) {
        return false;
      }

      // Search query filter (name, amenities, view)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = room.name.toLowerCase().includes(query);
        const matchesNameEn = room.nameEn.toLowerCase().includes(query);
        const matchesDesc = room.shortDescription.toLowerCase().includes(query);
        const matchesAmenities = room.amenities.some((a) =>
          a.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesNameEn && !matchesDesc && !matchesAmenities) {
          return false;
        }
      }

      // Price range filter
      if (selectedPriceRange !== 'all') {
        const p = room.pricing.price;
        if (selectedPriceRange === 'under-1500' && p >= 1500000) return false;
        if (selectedPriceRange === '1500-2500' && (p < 1500000 || p > 2500000)) return false;
        if (selectedPriceRange === '2500-5000' && (p < 2500000 || p > 5000000)) return false;
        if (selectedPriceRange === 'above-5000' && p <= 5000000) return false;
      }

      // Guests filter
      if (selectedGuests !== 'all') {
        const g = room.specs.guests;
        if (selectedGuests === '1' && g < 1) return false;
        if (selectedGuests === '2' && g !== 2) return false;
        if (selectedGuests === '3-4' && (g < 3 || g > 4)) return false;
        if (selectedGuests === '5+' && g < 5) return false;
      }

      // View filter
      if (selectedView !== 'all' && room.view !== selectedView) {
        return false;
      }

      // Tub filter
      if (selectedTub !== 'all' && room.tub !== selectedTub) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'price-asc') return a.pricing.price - b.pricing.price;
      if (selectedSort === 'price-desc') return b.pricing.price - a.pricing.price;
      if (selectedSort === 'rating') return b.rating - a.rating;
      if (selectedSort === 'area') return b.specs.area - a.specs.area;
      return 0; // Default recommended
    });
  }, [
    selectedCategory,
    searchQuery,
    selectedPriceRange,
    selectedGuests,
    selectedView,
    selectedTub,
    selectedSort,
  ]);

  // Paginated results
  const totalResults = filteredAndSortedRooms.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  const paginatedRooms = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedRooms.slice(start, start + pageSize);
  }, [filteredAndSortedRooms, currentPage, pageSize]);

  // Open Room Detail
  const handleViewDetail = (room) => {
    navigate(`/rooms/${room.id}`);
  };

  // Open Booking Confirmation Modal
  const handleBookNow = (room) => {
    setBookingRoom(room);
    setIsBookingModalOpen(true);
  };

  // Simulate loading state
  const handleSimulateLoading = () => {
    setIsLoading(true);
    setHasConnectionError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="w-full bg-background min-h-screen">
      
      {/* Hero Banner Section */}
      <RoomHeroBanner />

      {/* Top Breadcrumb & Prototype Toolbar */}
      <div className="bg-surface border-b border-border-custom shadow-xs">
        <div className="max-w-[1360px] mx-auto px-4 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
          <Breadcrumb items={[{ label: 'Phòng & Bảng giá' }]} />

          {/* Prototype Controls Toolbar */}
          <div className="flex items-center gap-2 text-xs py-1">
            <span className="text-text-secondary font-medium hidden md:inline">
              Kiểm thử tương tác:
            </span>
            <button
              type="button"
              onClick={handleSimulateLoading}
              className="text-text-secondary hover:text-primary transition-colors flex items-center gap-1 font-medium bg-surface-alt px-2.5 py-1 rounded border border-border-custom/50"
              title="Mô phỏng trạng thái Skeleton Loading"
            >
              <span className="material-symbols-outlined text-[15px]">hourglass_empty</span>
              <span>Skeleton</span>
            </button>
            <button
              type="button"
              onClick={() => setHasConnectionError(true)}
              className="text-text-secondary hover:text-danger-custom transition-colors flex items-center gap-1 font-medium bg-surface-alt px-2.5 py-1 rounded border border-border-custom/50"
              title="Mô phỏng lỗi kết nối mạng"
            >
              <span className="material-symbols-outlined text-[15px]">wifi_off</span>
              <span>Lỗi kết nối</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Sticky Filter Bar */}
      <RoomFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setCurrentPage(1);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        selectedPriceRange={selectedPriceRange}
        onPriceRangeChange={(p) => {
          setSelectedPriceRange(p);
          setCurrentPage(1);
        }}
        selectedGuests={selectedGuests}
        onGuestsChange={(g) => {
          setSelectedGuests(g);
          setCurrentPage(1);
        }}
        selectedView={selectedView}
        onViewChange={(v) => {
          setSelectedView(v);
          setCurrentPage(1);
        }}
        selectedTub={selectedTub}
        onTubChange={(t) => {
          setSelectedTub(t);
          setCurrentPage(1);
        }}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        onResetFilters={handleResetFilters}
        totalResults={totalResults}
      />

      {/* Main Listing Body */}
      <main className="max-w-[1360px] mx-auto px-4 lg:px-8 py-10 w-full">
        
        {/* Festive Season Notice Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 p-4 sm:p-5 rounded-2xl bg-accent/15 border border-accent/30 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
            </div>
            <div>
              <h4 className="font-headline text-sm sm:text-base text-primary font-bold">
                Đặc Quyền Đặt Phòng Mùa Lễ Hội Sương Mai 2024
              </h4>
              <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                Tặng ngay set trà chiều bánh Pháp cổ điển & Miễn phí làm thủ tục nhận phòng sớm từ 11:00 AM khi đặt trực tiếp.
              </p>
            </div>
          </div>
          <span className="shrink-0 px-3.5 py-1 rounded-full bg-primary text-text-on-dark text-[11px] font-bold uppercase tracking-wider">
            Ưu đãi độc quyền
          </span>
        </motion.div>

        {/* Content States: Connection Error vs Skeleton Loading vs Empty vs Room Cards */}
        {hasConnectionError ? (
          <ConnectionErrorState onRetry={() => setHasConnectionError(false)} />
        ) : isLoading ? (
          <div className="flex flex-col gap-8">
            <RoomCardSkeleton />
            <RoomCardSkeleton />
            <RoomCardSkeleton />
          </div>
        ) : paginatedRooms.length === 0 ? (
          <EmptyState onReset={handleResetFilters} />
        ) : (
          <div className="flex flex-col gap-8" id="roomListContainer">
            <AnimatePresence mode="popLayout">
              {paginatedRooms.map((room, index) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  index={index}
                  onViewDetail={handleViewDetail}
                  onBookNow={handleBookNow}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && !hasConnectionError && totalResults > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalResults}
            pageSize={pageSize}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }}
          />
        )}

        {/* Anti-Double Booking Lock Assurance Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 bg-surface-alt border border-border-custom p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row items-center gap-4 shadow-sm"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-border-custom flex items-center justify-center shrink-0 text-primary">
            <span className="material-symbols-outlined text-[26px]">lock_clock</span>
          </div>
          <div className="flex flex-col flex-1 text-center md:text-left">
            <h4 className="text-sm font-bold text-primary">
              Cơ chế Khóa phòng tự động ngăn trùng lịch (Anti-Double Booking)
            </h4>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              Hệ thống sẽ khóa phòng tạm thời <strong>10 phút</strong> ngay khi quý khách chọn phòng để đảm bảo không ai khác có thể giữ phòng của bạn trong khi tiến hành điền thông tin.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 text-accent font-semibold text-xs bg-surface border border-border-custom px-3 py-1.5 rounded-lg shadow-xs">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Công nghệ chuẩn SRS V1.4</span>
          </div>
        </motion.div>

      </main>

      {/* Comparison Matrix Section */}
      <RoomComparisonMatrix />

      {/* Direct Booking Privileges Section */}
      <DirectBookingPrivileges />

      {/* Testimonials Showcase Section */}
      <RoomTestimonials />

      {/* Booking Confirmation Modal */}
      {bookingRoom && (
        <BookingConfirmModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setBookingRoom(null);
          }}
          room={bookingRoom}
          initialCheckIn={paramCheckIn}
          initialCheckOut={paramCheckOut}
          initialGuests={paramAdults ? Number(paramAdults) : 2}
        />
      )}

    </div>
  );
};

export default RoomsPage;
