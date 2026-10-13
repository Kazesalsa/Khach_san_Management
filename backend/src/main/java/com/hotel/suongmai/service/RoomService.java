package com.hotel.suongmai.service;

import com.hotel.suongmai.dto.PublicRoomResponse;
import com.hotel.suongmai.entity.Amenity;
import com.hotel.suongmai.entity.CleaningStatus;
import com.hotel.suongmai.entity.PriceList;
import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.entity.RoomImage;
import com.hotel.suongmai.exception.RoomAlreadyCleanedException;
import com.hotel.suongmai.exception.RoomNotFoundException;
import com.hotel.suongmai.repository.PriceListRepository;
import com.hotel.suongmai.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final PriceListRepository priceListRepository;

    @Transactional
    public Room markRoomAsCleaned(String roomCode) {
        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RoomNotFoundException("Phòng không tồn tại với mã phòng: " + roomCode));

        if (room.getCleaningStatus() == CleaningStatus.DA_DON_XONG) {
            throw new RoomAlreadyCleanedException("Phòng đã được dọn với mã phòng: " + roomCode);
        }

        room.setCleaningStatus(CleaningStatus.DA_DON_XONG);

        return roomRepository.save(room);
    }

    @Transactional(readOnly = true)
    public List<Room> findAllRooms() {
        return roomRepository.findAllByOrderByFloorAscRoomNumberAsc();
    }

    @Transactional(readOnly = true)
    public List<Room> findAvailableRooms(LocalDate fromDate, LocalDate toDate) {
        if (fromDate == null || toDate == null || !toDate.isAfter(fromDate)) {
            throw new IllegalArgumentException(
                    "Ngày trả phòng phải sau ngày nhận phòng");
        }

        return roomRepository.findAvailableRooms(fromDate, toDate);
    }

    /**
     * Lấy danh sách toàn bộ phòng công khai kèm theo ảnh từ bảng phong_hinh_anh và giá phòng
     */
    @Transactional(readOnly = true)
    public List<PublicRoomResponse> getPublicRooms() {
        List<Room> rooms = roomRepository.findAllWithCategoryAndAmenities();
        LocalDateTime now = LocalDateTime.now();
        List<PriceList> prices = priceListRepository.findAll();

        return rooms.stream().map(room -> mapToPublicRoomResponse(room, prices, now)).toList();
    }

    /**
     * Lấy chi tiết một phòng công khai theo ID hoặc mã phòng
     */
    @Transactional(readOnly = true)
    public PublicRoomResponse getPublicRoomById(String id) {
        Room room = roomRepository.findByIdOrCodeWithCategoryAndAmenities(id)
                .or(() -> roomRepository.findById(id))
                .or(() -> roomRepository.findByRoomNumber(id))
                .orElseThrow(() -> new RoomNotFoundException("Không tìm thấy phòng với mã hoặc ID: " + id));

        LocalDateTime now = LocalDateTime.now();
        List<PriceList> prices = priceListRepository.findAll();
        return mapToPublicRoomResponse(room, prices, now);
    }

    private PublicRoomResponse mapToPublicRoomResponse(Room room, List<PriceList> allPrices, LocalDateTime now) {
        String catId = room.getRoomCategory() != null ? room.getRoomCategory().getId() : null;
        String catName = room.getRoomCategory() != null ? room.getRoomCategory().getName() : "Tiêu chuẩn";
        String catDesc = room.getRoomCategory() != null ? room.getRoomCategory().getDescription() : "";
        Integer capacity = room.getRoomCategory() != null ? room.getRoomCategory().getMaxCapacity() : 2;

        List<String> amenities = (room.getRoomCategory() != null && room.getRoomCategory().getAmenities() != null)
                ? room.getRoomCategory().getAmenities().stream()
                        .map(Amenity::getName)
                        .filter(Objects::nonNull)
                        .toList()
                : List.of("Wi-Fi miễn phí", "Điều hòa nhiệt độ", "Dịch vụ phòng");

        // Tìm đơn giá đang hiệu lực trong bảng gia_phong
        BigDecimal price = BigDecimal.valueOf(500000);
        if (catId != null) {
            price = allPrices.stream()
                    .filter(p -> p.getRoomCategory() != null && catId.equalsIgnoreCase(p.getRoomCategory().getId()))
                    .filter(p -> (p.getStartDate() == null || !now.isBefore(p.getStartDate())) &&
                            (p.getEndDate() == null || !now.isAfter(p.getEndDate())))
                    .map(PriceList::getPrice)
                    .filter(Objects::nonNull)
                    .findFirst()
                    .orElseGet(() -> {
                        if ("cat-4".equalsIgnoreCase(catId) || "Suite".equalsIgnoreCase(catName)) return BigDecimal.valueOf(2500000);
                        if ("cat-3".equalsIgnoreCase(catId) || "Deluxe".equalsIgnoreCase(catName)) return BigDecimal.valueOf(1200000);
                        if ("cat-2".equalsIgnoreCase(catId) || "Superior".equalsIgnoreCase(catName)) return BigDecimal.valueOf(800000);
                        return BigDecimal.valueOf(500000);
                    });
        }
        BigDecimal originalPrice = price.multiply(BigDecimal.valueOf(1.2)).setScale(0, RoundingMode.HALF_UP);

        // Lấy danh sách ảnh từ phong_hinh_anh
        List<PublicRoomResponse.PublicRoomImageResponse> imageList = new ArrayList<>();
        if (room.getImages() != null && !room.getImages().isEmpty()) {
            for (RoomImage img : room.getImages()) {
                if (img.getUrl() != null && !img.getUrl().isBlank()) {
                    imageList.add(PublicRoomResponse.PublicRoomImageResponse.builder()
                            .id(img.getId())
                            .url(sanitizeImageUrl(img.getUrl()))
                            .displayOrder(img.getDisplayOrder())
                            .isPrimary(img.getIsPrimary())
                            .caption("Ảnh phòng " + room.getRoomNumber() + " - " + catName)
                            .build());
                }
            }
        }

        if (imageList.isEmpty()) {
            imageList.add(PublicRoomResponse.PublicRoomImageResponse.builder()
                    .url("https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80")
                    .caption("Ảnh phòng " + room.getRoomNumber())
                    .isPrimary("true")
                    .build());
        }

        String primaryImageUrl = imageList.stream()
                .filter(i -> "true".equalsIgnoreCase(i.getIsPrimary()) || "1".equals(i.getDisplayOrder()))
                .map(PublicRoomResponse.PublicRoomImageResponse::getUrl)
                .findFirst()
                .orElse(imageList.get(0).getUrl());

        String roomName = "Phòng " + room.getRoomNumber() + " - " + catName;

        return PublicRoomResponse.builder()
                .id(room.getId())
                .roomCode(room.getRoomCode())
                .roomNumber(room.getRoomNumber())
                .floor(room.getFloor())
                .name(roomName)
                .categoryId(catId)
                .categoryName(catName)
                .categoryDescription(catDesc)
                .maxCapacity(capacity)
                .price(price)
                .originalPrice(originalPrice)
                .discountPercent(20)
                .amenities(amenities)
                .images(imageList)
                .primaryImageUrl(primaryImageUrl)
                .usageStatus(room.getUsageStatus() != null ? room.getUsageStatus().name() : "TRONG")
                .cleaningStatus(room.getCleaningStatus() != null ? room.getCleaningStatus().name() : "DA_DON_XONG")
                .build();
    }

    private String sanitizeImageUrl(String url) {
        if (url == null || url.isBlank()) {
            return "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80";
        }
        // Tự động thay thế các photo ID 404 cũ nếu cơ sở dữ liệu chưa chạy re-seed
        if (url.contains("1582719508461-890f11f40ce6")) return url.replace("1582719508461-890f11f40ce6", "1598928506311-c55ded91a20c");
        if (url.contains("1600566753190-17f0baa2cb32")) return url.replace("1600566753190-17f0baa2cb32", "1584132967334-10e028bd69f7");
        if (url.contains("1552321554-5d5d36dc1604")) return url.replace("1552321554-5d5d36dc1604", "1568495248636-6432b97bd949");
        if (url.contains("1604709177227-08728731d16f")) return url.replace("1604709177227-08728731d16f", "1595576508898-0ad5c879a061");
        if (url.contains("1507652313628-9773c1d43a60")) return url.replace("1507652313628-9773c1d43a60", "1578683010236-d716f9a3f461");
        if (url.contains("1582719478250-c89facf4a4bf")) return url.replace("1582719478250-c89facf4a4bf", "1587985064135-0366536eab42");
        if (url.contains("1572987653523-389fbff2794c")) return url.replace("1572987653523-389fbff2794c", "1571896349842-33c89424de2d");
        if (url.contains("1505692794401-ca20ba3b8fb3")) return url.replace("1505692794401-ca20ba3b8fb3", "1618773928121-c32242e63f39");
        if (url.contains("1583847268964-b28ce7f3df82")) return url.replace("1583847268964-b28ce7f3df82", "1631049307264-da0ec9d70304");
        if (url.contains("1505691938859-f0a0e60ea20f")) return url.replace("1505691938859-f0a0e60ea20f", "1631049552057-403cdb8f0658");
        return url;
    }
}
