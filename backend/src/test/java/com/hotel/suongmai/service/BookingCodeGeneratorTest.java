package com.hotel.suongmai.service;

import com.hotel.suongmai.repository.BookingRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingCodeGeneratorTest {

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private BookingCodeGenerator bookingCodeGenerator;

    @Test
    @DisplayName("Thành công: Sinh mã đặt phòng đúng định dạng BKyyMMdd-XXXXX và <= 20 ký tự")
    void generateUniqueBookingCode_Success() {
        when(bookingRepository.existsByBookingCode(anyString())).thenReturn(false);

        String code = bookingCodeGenerator.generateUniqueBookingCode();

        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        assertThat(code).isNotNull();
        assertThat(code).startsWith("BK" + datePart + "-");
        assertThat(code.length()).isLessThanOrEqualTo(20);
        assertThat(code).matches("^BK\\d{6}-[A-Z0-9]{5}$");

        verify(bookingRepository, times(1)).existsByBookingCode(code);
    }

    @Test
    @DisplayName("Xử lý trùng lặp: Retry khi lần đầu sinh mã bị trùng và thành công ở lần thứ hai")
    void generateUniqueBookingCode_RetryOnCollision() {
        // Lần đầu trả về true (đã tồn tại), lần 2 trả về false (chưa tồn tại)
        when(bookingRepository.existsByBookingCode(anyString()))
                .thenReturn(true)
                .thenReturn(false);

        String code = bookingCodeGenerator.generateUniqueBookingCode();

        assertThat(code).isNotNull();
        assertThat(code.length()).isLessThanOrEqualTo(20);
        verify(bookingRepository, times(2)).existsByBookingCode(anyString());
    }

    @Test
    @DisplayName("Fallback: Nếu thử 10 lần ngẫu nhiên đều trùng, fallback với timestamp vẫn thành công nếu mã fallback chưa tồn tại")
    void generateUniqueBookingCode_FallbackWithTimestamp() {
        // 10 lần thử đều trùng, lần 11 (fallback) chưa tồn tại
        when(bookingRepository.existsByBookingCode(anyString()))
                .thenReturn(true, true, true, true, true, true, true, true, true, true, false);

        String code = bookingCodeGenerator.generateUniqueBookingCode();

        assertThat(code).isNotNull();
        assertThat(code.length()).isLessThanOrEqualTo(20);
        verify(bookingRepository, times(11)).existsByBookingCode(anyString());
    }

    @Test
    @DisplayName("Thất bại: Ném IllegalStateException nếu tất cả các lần thử và fallback đều bị trùng")
    void generateUniqueBookingCode_ThrowsExceptionWhenAllCollided() {
        when(bookingRepository.existsByBookingCode(anyString())).thenReturn(true);

        assertThatThrownBy(() -> bookingCodeGenerator.generateUniqueBookingCode())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Không thể sinh mã đặt phòng duy nhất");
    }
}
