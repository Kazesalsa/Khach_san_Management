import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicRooms, DEFAULT_ROOM_IMAGE } from '../../services/roomService';
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
    setSelectedCategory(paramCategory || 'all');
    setSelectedGuests(initialGuestsFilter || 'all');
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
    navigate('/rooms', { replace: true });
  };

  const [roomsList, setRoomsList] = useState([]);

  // Tải danh sách phòng và hình ảnh thực tế từ database
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    getPublicRooms().then((dbRooms) => {
      if (mounted && Array.isArray(dbRooms) && dbRooms.length > 0) {
        const mapped = dbRooms.map((r) => {
          // Category slug mapping chuẩn hóa với ROOM_CATEGORIES
          const categorySlug =
            r.categoryId === 'cat-4' || (r.categoryName && r.categoryName.toLowerCase().includes('suite')) ? 'suite' :
            r.categoryId === 'cat-3' || (r.categoryName && r.categoryName.toLowerCase().includes('deluxe')) ? 'deluxe' :
            r.categoryId === 'cat-2' || (r.categoryName && r.categoryName.toLowerCase().includes('superior')) ? 'superior' :
            'standard';

          // Phân bổ hướng nhìn (View) thực tế theo tầng
          const floorNum = parseInt(r.floor, 10) || 1;
          const viewType = floorNum >= 4 ? 'ho-guom' : floorNum === 3 ? 'pho-co' : 'san-vuon';
          const viewLabel = floorNum >= 4 ? `Tầng ${r.floor} - View Hồ Hoàn Kiếm (Panorama)` :
                            floorNum === 3 ? `Tầng ${r.floor} - View Phố Cổ Hoàn Kiếm` :
                            `Tầng ${r.floor} - View Vườn Trong Yên Tĩnh`;

          // Phân bổ tiện ích bồn tắm theo hạng phòng
          const tubType = categorySlug === 'suite' ? 'jacuzzi' :
                          categorySlug === 'deluxe' ? 'wood' : 'french';
          const tubLabel = categorySlug === 'suite' ? 'Bồn sục Jacuzzi massage' :
                           categorySlug === 'deluxe' ? 'Bồn gỗ sồi ngâm thảo dược' : 'Bồn tắm sứ Pháp cổ';
          const tubSpec = categorySlug === 'suite' ? 'Jacuzzi Massage Đôi' :
                          categorySlug === 'deluxe' ? 'Bồn Gỗ Sồi Thảo Mộc' : 'Bồn Sứ Pháp Chân Rồng';

          const roomCapacity = Number(r.maxCapacity) || 2;

          return {
            id: r.id,
            slug: r.roomCode?.toLowerCase() || r.id,
            roomCode: r.roomCode,
            roomNumber: r.roomNumber,
            name: r.name,
            nameEn: `${r.categoryName} Room ${r.roomNumber}`,
            category: categorySlug,
            categoryId: r.categoryId,
            categoryName: r.categoryName,
            view: viewType,
            viewLabel: viewLabel,
            tub: tubType,
            tubLabel: tubLabel,
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
              area: categorySlug === 'suite' ? 65 : categorySlug === 'deluxe' ? 45 : 32,
              bed: roomCapacity >= 4 ? '2 King Lớn' : roomCapacity >= 3 ? '1 King (2m x 2m2)' : '1 King (1.8m x 2m)',
              guests: roomCapacity,
              guestsLabel: `${roomCapacity} Người lớn`,
              maxGuests: roomCapacity + 1,
              tub: tubSpec,
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

  // Tính số lượng phòng cho từng danh mục
  const categoryCounts = useMemo(() => {
    const counts = {
      all: roomsList.length,
      standard: 0,
      superior: 0,
      deluxe: 0,
      suite: 0,
    };
    roomsList.forEach((r) => {
      if (counts[r.category] !== undefined) {
        counts[r.category]++;
      }
    });
    return counts;
  }, [roomsList]);

  // Filter & Sort Logic
  const filteredAndSortedRooms = useMemo(() => {
    return roomsList.filter((room) => {
      // Category filter (khớp cả categorySlug, categoryId, categoryName & aliases)
      if (selectedCategory !== 'all') {
        const cat = selectedCategory.toLowerCase();
        const matchesCategory =
          room.category === cat ||
          room.categoryId === cat ||
          (cat === 'suite' && (room.category === 'president' || room.categoryId === 'cat-4')) ||
          (cat === 'president' && (room.category === 'suite' || room.categoryId === 'cat-4')) ||
          (cat === 'superior' && (room.category === 'indochine-suite' || room.categoryId === 'cat-2')) ||
          (cat === 'indochine-suite' && (room.category === 'superior' || room.categoryId === 'cat-2')) ||
          (cat === 'standard' && room.categoryId === 'cat-1') ||
          (cat === 'deluxe' && room.categoryId === 'cat-3');
        if (!matchesCategory) return false;
      }

      // Search query filter (tên, số phòng, hạng phòng, tiện nghi, view)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = room.name?.toLowerCase().includes(query);
        const matchesNameEn = room.nameEn?.toLowerCase().includes(query);
        const matchesNumber = room.roomNumber ? String(room.roomNumber).includes(query) : false;
        const matchesCatName = room.categoryName ? room.categoryName.toLowerCase().includes(query) : false;
        const matchesDesc = room.shortDescription?.toLowerCase().includes(query);
        const matchesView = room.viewLabel?.toLowerCase().includes(query);
        const matchesFloor = room.floor?.toLowerCase().includes(query);
        const matchesAmenities = room.amenities?.some((a) =>
          a.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesNameEn && !matchesNumber && !matchesCatName && !matchesDesc && !matchesView && !matchesFloor && !matchesAmenities) {
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

      // Guests filter: Kiểm tra sức chứa có đáp ứng đủ số lượng khách tìm kiếm
      if (selectedGuests !== 'all') {
        const capacity = room.specs.guests || 2;
        const maxCapacity = room.specs.maxGuests || capacity;
        if (selectedGuests === '1' && capacity < 1) return false;
        if (selectedGuests === '2' && capacity < 2) return false;
        if (selectedGuests === '3-4' && capacity < 3 && maxCapacity < 3) return false;
        if (selectedGuests === '5+' && capacity < 4 && maxCapacity < 5) return false;
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
    roomsList,
  ]);

  // Paginated results
  const totalResults = filteredAndSortedRooms.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  const paginatedRooms = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedRooms.slice(start, start + pageSize);
  }, [filteredAndSortedRooms, currentPage, pageSize]);

  // Open Booking Confirmation Modal
  const handleBookNow = (room) => {
    setBookingRoom(room);
    setIsBookingModalOpen(true);
  };

  // Lightbox Modal for Photo Gallery
  const [galleryRoom, setGalleryRoom] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const handleOpenGallery = (room, idx = 0) => {
    setGalleryRoom(room);
    setGalleryIndex(idx);
  };

  useEffect(() => {
    if (!galleryRoom) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setGalleryRoom(null);
      if (e.key === 'ArrowLeft') {
        setGalleryIndex((prev) => (prev === 0 ? (galleryRoom.images?.length || 1) - 1 : prev - 1));
      }
      if (e.key === 'ArrowRight') {
        setGalleryIndex((prev) => (prev === (galleryRoom.images?.length || 1) - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryRoom]);

  return (
    <div className="w-full bg-background min-h-screen">
      
      {/* Hero Banner Section */}
      <RoomHeroBanner />

      {/* Top Breadcrumb */}
      <div className="bg-surface border-b border-border-custom shadow-xs">
        <div className="max-w-[1360px] mx-auto px-4 lg:px-8 py-2.5">
          <Breadcrumb items={[{ label: 'Phòng & Bảng giá' }]} />
        </div>
      </div>

      {/* Interactive Sticky Filter Bar */}
      <RoomFilterBar
        selectedCategory={selectedCategory}
        categoryCounts={categoryCounts}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setCurrentPage(1);
          const newParams = new URLSearchParams(searchParams);
          if (cat === 'all') {
            newParams.delete('category');
          } else {
            newParams.set('category', cat);
          }
          const queryString = newParams.toString();
          navigate(queryString ? `/rooms?${queryString}` : '/rooms', { replace: true });
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
          const newParams = new URLSearchParams(searchParams);
          if (g === 'all') {
            newParams.delete('adults');
            newParams.delete('guests');
          } else {
            newParams.set('adults', g === '3-4' ? '3' : g === '5+' ? '5' : g);
          }
          const queryString = newParams.toString();
          navigate(queryString ? `/rooms?${queryString}` : '/rooms', { replace: true });
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
                  onBookNow={handleBookNow}
                  onOpenGallery={handleOpenGallery}
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

      {/* Lightbox Modal for Photo Gallery */}
      <AnimatePresence>
        {galleryRoom && (
          <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md">
            {/* Header */}
            <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-accent text-[24px]">photo_camera</span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                    {galleryRoom.name}
                  </h3>
                  <p className="text-[11px] text-white/70">
                    Ảnh thực tế {galleryIndex + 1} / {galleryRoom.images?.length || 1}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGalleryRoom(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Đóng xem ảnh (Esc)"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Main Stage */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
              <img
                src={galleryRoom.images?.[galleryIndex]?.url || DEFAULT_ROOM_IMAGE}
                alt={galleryRoom.images?.[galleryIndex]?.caption || galleryRoom.name}
                className="max-h-[68vh] max-w-[92vw] object-contain rounded-xl shadow-2xl transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_ROOM_IMAGE;
                }}
              />

              {/* Prev / Next buttons */}
              {galleryRoom.images && galleryRoom.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setGalleryIndex((prev) =>
                        prev === 0 ? galleryRoom.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2 sm:left-6 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
                    title="Ảnh trước (←)"
                  >
                    <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setGalleryIndex((prev) =>
                        prev === galleryRoom.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-2 sm:right-6 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
                    title="Ảnh tiếp theo (→)"
                  >
                    <span className="material-symbols-outlined text-[28px]">chevron_right</span>
                  </button>
                </>
              )}
            </div>

            {/* Bottom: Caption, Thumbnails & Actions */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <p className="text-white/80 text-xs text-center max-w-xl">
                {galleryRoom.images?.[galleryIndex]?.caption || galleryRoom.name}
              </p>

              {/* Thumbnails */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2">
                {galleryRoom.images?.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setGalleryIndex(i)}
                    className={`relative w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      i === galleryIndex ? 'border-accent scale-105 shadow-md' : 'border-white/30 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`thumb-${i}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_ROOM_IMAGE;
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    const r = galleryRoom;
                    setGalleryRoom(null);
                    handleBookNow(r);
                  }}
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-accent text-primary hover:bg-accent-hover transition-colors cursor-pointer shadow-sm"
                >
                  Đặt phòng ngay
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default RoomsPage;
