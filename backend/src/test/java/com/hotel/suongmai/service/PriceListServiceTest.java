package com.hotel.suongmai.service;

import com.hotel.suongmai.dto.PriceListResult;
import com.hotel.suongmai.entity.PriceList;
import com.hotel.suongmai.entity.RoomCategory;
import com.hotel.suongmai.exception.PriceListOverlapException;
import com.hotel.suongmai.repository.BookingRepository;
import com.hotel.suongmai.repository.PriceListRepository;
import com.hotel.suongmai.repository.RoomCategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PriceListServiceTest {

    @Mock
    private PriceListRepository priceListRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private RoomCategoryRepository roomCategoryRepository;

    @InjectMocks
    private PriceListService priceListService;

    private RoomCategory mockCategory;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;

    @BeforeEach
    void setUp() {
        mockCategory = new RoomCategory();
        mockCategory.setId("cat-1");
        mockCategory.setName("Deluxe Room");

        fromDate = LocalDateTime.of(2026, 11, 1, 14, 0);
        toDate = LocalDateTime.of(2026, 11, 10, 12, 0);
    }

    @Test
    @DisplayName("Thành công: Thêm bảng giá mới khi không bị trùng ngày và không có booking cũ")
    void createPriceList_Success_NoOverlap_NoExistingBookings() {
        // Giả lập tìm thấy loại phòng
        when(roomCategoryRepository.findById("cat-1")).thenReturn(Optional.of(mockCategory));
        // Giả lập KHÔNG bị trùng bảng giá (EF-1 false)
        when(priceListRepository.existsOverlappingPrice(eq("cat-1"), eq(fromDate), eq(toDate), isNull())).thenReturn(false);
        // Giả lập KHÔNG có booking cũ (AF-2 false)
        when(bookingRepository.existsActiveBookingsInDateRange(eq("cat-1"), eq(fromDate.toLocalDate()), eq(toDate.toLocalDate()))).thenReturn(false);
        // Giả lập lưu thành công
        when(priceListRepository.save(any(PriceList.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Thực thi hàm cần test
        PriceListResult result = priceListService.createPriceList("cat-1", fromDate, toDate, BigDecimal.valueOf(500000), "ACTIVE");

        // Kiểm tra kết quả
        assertThat(result).isNotNull();
        assertThat(result.getPriceList().getPrice()).isEqualByComparingTo(BigDecimal.valueOf(500000));
        assertThat(result.isHasExistingBookings()).isFalse(); // Flag AF-2 phải là false
        verify(priceListRepository, times(1)).save(any(PriceList.class));
    }

    @Test
    @DisplayName("Xử lý EF-1: Ném PriceListOverlapException khi khoảng ngày bị đè lên bảng giá khác")
    void createPriceList_ThrowsException_WhenOverlapping() {
        when(roomCategoryRepository.findById("cat-1")).thenReturn(Optional.of(mockCategory));
        // Giả lập BỊ TRÙNG bảng giá (EF-1 true)
        when(priceListRepository.existsOverlappingPrice(eq("cat-1"), eq(fromDate), eq(toDate), isNull())).thenReturn(true);

        // Kiểm tra xem Service có ném đúng Exception như đặc tả không
        assertThatThrownBy(() -> priceListService
                .createPriceList("cat-1", fromDate, toDate, BigDecimal.valueOf(500000), "ACTIVE"))
                .isInstanceOf(PriceListOverlapException.class)
                .hasMessageContaining("Khoảng thời gian này đã tồn tại bảng giá");

        // Đảm bảo không gọi lệnh save xuống Database khi bị trùng
        verify(priceListRepository, never()).save(any(PriceList.class));
    }

    @Test
    @DisplayName("Xử lý AF-2: Trả về flag = true khi có booking cũ rơi vào khoảng ngày đổi giá")
    void createPriceList_ReturnsFlagTrue_WhenExistingBookingsFound() {
        when(roomCategoryRepository.findById("cat-1")).thenReturn(Optional.of(mockCategory));
        when(priceListRepository.existsOverlappingPrice(eq("cat-1"), eq(fromDate), eq(toDate), isNull())).thenReturn(false);
        // Giả lập CÓ booking cũ trong khoảng ngày (AF-2 true)
        when(bookingRepository.existsActiveBookingsInDateRange(eq("cat-1"), eq(fromDate.toLocalDate()), eq(toDate.toLocalDate()))).thenReturn(true);
        when(priceListRepository.save(any(PriceList.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PriceListResult result = priceListService.createPriceList("cat-1", fromDate, toDate, BigDecimal.valueOf(600000), "ACTIVE");

        // Kiểm tra kết quả
        assertThat(result).isNotNull();
        assertThat(result.isHasExistingBookings()).isTrue(); // Flag AF-2 phải là true
        assertThat(result.getNoticeMessage()).contains("giữ nguyên mức giá cho các đặt phòng đã xác nhận");
    }
}