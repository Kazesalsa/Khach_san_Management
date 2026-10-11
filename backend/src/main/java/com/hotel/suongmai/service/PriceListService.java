package com.hotel.suongmai.service;

import com.hotel.suongmai.dto.PriceListResult;
import com.hotel.suongmai.dto.RoomCategoryOptionResponse;
import com.hotel.suongmai.entity.PriceList;
import com.hotel.suongmai.entity.RoomCategory;
import com.hotel.suongmai.exception.PriceListOverlapException;
import com.hotel.suongmai.repository.BookingRepository;
import com.hotel.suongmai.repository.PriceListRepository;
import com.hotel.suongmai.repository.RoomCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PriceListService {

    private final PriceListRepository priceListRepository;
    private final BookingRepository bookingRepository;
    private final RoomCategoryRepository roomCategoryRepository;

    /**
     * Tạo bảng giá phòng mới (UC-01 Main Flow + EF-1 + AF-2)
     */
    @Transactional
    public PriceListResult createPriceList(
            String categoryId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            BigDecimal price,
            String status
    ) {
        RoomCategory category = roomCategoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Không tìm thấy loại phòng với ID: " + categoryId
                        )
                );

        if (priceListRepository.existsOverlappingPrice(
                categoryId,
                startDate,
                endDate,
                null
        )) {
            throw new PriceListOverlapException(
                    "Khoảng thời gian này đã tồn tại bảng giá cho loại phòng được chọn!"
            );
        }

        PriceList priceList = new PriceList();
        priceList.setRoomCategory(category);
        priceList.setStartDate(startDate);
        priceList.setEndDate(endDate);
        priceList.setPrice(price);
        priceList.setStatus(status != null ? status : "ACTIVE");

        PriceList savedPriceList = priceListRepository.save(priceList);

        boolean hasExistingBookings =
                bookingRepository.existsActiveBookingsInDateRange(
                        categoryId,
                        startDate.toLocalDate(),
                        endDate.toLocalDate()
                );

        String notice = hasExistingBookings
                ? "Bảng giá mới được áp dụng, nhưng giữ nguyên mức giá cho các đặt phòng đã xác nhận trước đó."
                : "Thiết lập bảng giá thành công.";

        return new PriceListResult(
                savedPriceList,
                hasExistingBookings,
                notice
        );
    }

    /**
     * Cập nhật bảng giá phòng hiện có (UC-01 AF-1 + EF-1 + AF-2)
     */
    @Transactional
    public PriceListResult updatePriceList(
            String priceListId,
            LocalDateTime newStartDate,
            LocalDateTime newEndDate,
            BigDecimal newPrice,
            String newStatus
    ) {
        PriceList existingPriceList = priceListRepository.findById(priceListId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Không tìm thấy bảng giá với ID: " + priceListId
                        )
                );

        String categoryId =
                existingPriceList.getRoomCategory().getId();

        if (priceListRepository.existsOverlappingPrice(
                categoryId,
                newStartDate,
                newEndDate,
                priceListId
        )) {
            throw new PriceListOverlapException(
                    "Khoảng thời gian cập nhật bị trùng lặp với bảng giá khác!"
            );
        }

        existingPriceList.setStartDate(newStartDate);
        existingPriceList.setEndDate(newEndDate);
        existingPriceList.setPrice(newPrice);

        if (newStatus != null) {
            existingPriceList.setStatus(newStatus);
        }

        PriceList updatedPriceList =
                priceListRepository.save(existingPriceList);

        boolean hasExistingBookings =
                bookingRepository.existsActiveBookingsInDateRange(
                        categoryId,
                        newStartDate.toLocalDate(),
                        newEndDate.toLocalDate()
                );

        String notice = hasExistingBookings
                ? "Cập nhật bảng giá thành công. Giá của các đặt phòng cũ trong khoảng ngày này không bị thay đổi."
                : "Cập nhật bảng giá thành công.";

        return new PriceListResult(
                updatedPriceList,
                hasExistingBookings,
                notice
        );
    }

    /**
     * Lấy danh sách loại phòng để hiển thị trong Dropdown
     */
    @Transactional(readOnly = true)
    public List<RoomCategoryOptionResponse> getRoomCategoryOptions() {
        return roomCategoryRepository.findAll()
                .stream()
                .map(category ->
                        new RoomCategoryOptionResponse(
                                category.getId(),
                                category.getName()
                        )
                )
                .toList();
    }
}