package com.hotel.suongmai.service;

import com.hotel.suongmai.repository.BookingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingCodeGeneratorTest {
    @Mock BookingRepository bookingRepository;
    @InjectMocks BookingCodeGenerator generator;

    @Test
    void generatesUniqueCodeInExpectedFormat() {
        when(bookingRepository.existsByBookingCode(anyString())).thenReturn(false);

        String code = generator.generate();

        assertThat(code).matches("^BK\\d{6}-[A-Z0-9]{5}$");
        assertThat(code).hasSizeLessThanOrEqualTo(20);
    }

    @Test
    void stopsAfterTenCollisions() {
        when(bookingRepository.existsByBookingCode(anyString())).thenReturn(true);

        assertThatThrownBy(generator::generate)
                .isInstanceOf(IllegalStateException.class);
        verify(bookingRepository, times(10)).existsByBookingCode(anyString());
    }
}
