package com.hotel.suongmai.service;

import com.hotel.suongmai.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Component chuyên trách sinh mã đặt phòng tự động duy nhất (Unique Booking Code).
 * Format: BKyyMMdd-XXXXX (15 ký tự, đảm bảo <= 20 ký tự theo độ dài VARCHAR(20) trong DB).
 * Tự động kiểm tra trùng lặp với CSDL để đảm bảo tính duy nhất 100%.
 */
@Component
@RequiredArgsConstructor
public class BookingCodeGenerator {

    private static final String PREFIX = "BK";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyMMdd");
    private static final String ALPHANUMERIC = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int RANDOM_LENGTH = 5;
    private static final int MAX_ATTEMPTS = 10;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final BookingRepository bookingRepository;

    /**
     * Sinh mã đặt phòng duy nhất dạng BKyyMMdd-XXXXX (ví dụ: BK261011-9A3F1)
     * Đảm bảo không trùng lặp trong CSDL.
     *
     * @return Mã đặt phòng duy nhất
     */
    public String generateUniqueBookingCode() {
        String datePart = LocalDate.now().format(DATE_FORMATTER);

        for (int attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
            String candidateCode = PREFIX + datePart + "-" + generateRandomString(RANDOM_LENGTH);
            if (!bookingRepository.existsByBookingCode(candidateCode)) {
                return candidateCode;
            }
        }

        // Cơ chế Fallback an toàn với microsecond timestamp nếu gặp va chạm nhiều lần liên tiếp
        long timestampSuffix = System.currentTimeMillis() % 1000000;
        String fallbackCode = PREFIX + datePart + "-" + String.format("%06d", timestampSuffix);
        if (!bookingRepository.existsByBookingCode(fallbackCode)) {
            return fallbackCode;
        }

        throw new IllegalStateException("Không thể sinh mã đặt phòng duy nhất sau nhiều lần thử");
    }

    private String generateRandomString(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(ALPHANUMERIC.charAt(RANDOM.nextInt(ALPHANUMERIC.length())));
        }
        return sb.toString();
    }
}
