package com.hotel.suongmai.service;

import com.hotel.suongmai.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
@RequiredArgsConstructor
public class BookingCodeGenerator {
    private static final String CHARACTERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyMMdd");
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int MAX_ATTEMPTS = 10;

    private final BookingRepository bookingRepository;

    public String generate() {
        String prefix = "BK" + LocalDate.now().format(DATE_FORMAT) + "-";
        for (int attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
            String candidate = prefix + randomSuffix();
            if (!bookingRepository.existsByBookingCode(candidate)) {
                return candidate;
            }
        }
        throw new IllegalStateException("Không thể sinh mã đặt phòng duy nhất");
    }

    private String randomSuffix() {
        StringBuilder suffix = new StringBuilder(5);
        for (int index = 0; index < 5; index++) {
            suffix.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return suffix.toString();
    }
}
