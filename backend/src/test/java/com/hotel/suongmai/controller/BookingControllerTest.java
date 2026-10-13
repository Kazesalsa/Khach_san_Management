package com.hotel.suongmai.controller;

import com.hotel.suongmai.config.SecurityConfig;
import com.hotel.suongmai.dto.CreateBookingRequest;
import com.hotel.suongmai.dto.CreateBookingResponse;
import com.hotel.suongmai.entity.BookingStatus;
import com.hotel.suongmai.security.JwtAuthenticationFilter;
import com.hotel.suongmai.security.JwtTokenProvider;
import com.hotel.suongmai.security.TaiKhoanDetailsService;
import com.hotel.suongmai.service.BookingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookingController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class BookingControllerTest {
    @Autowired MockMvc mockMvc;

    @MockBean BookingService bookingService;
    @MockBean JwtTokenProvider jwtTokenProvider;
    @MockBean TaiKhoanDetailsService taiKhoanDetailsService;

    @Test
    void allowsPublicBookingAndReturnsCreatedResponse() throws Exception {
        LocalDate checkIn = LocalDate.now().plusDays(2);
        LocalDate checkOut = checkIn.plusDays(2);
        when(bookingService.createBooking(any(CreateBookingRequest.class)))
                .thenReturn(new CreateBookingResponse(
                        "BK261013-A1B2C", BookingStatus.CHO_XAC_NHAN,
                        "customer-1", "Nguyễn Văn A", "0912345678", "a@example.com",
                        "room-1", "101", "Standard", checkIn, checkOut, 2, 2,
                        new BigDecimal("2000000.00"), new BigDecimal("600000.00")));

        mockMvc.perform(post("/api/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "roomId": "room-1",
                                  "checkIn": "%s",
                                  "checkOut": "%s",
                                  "guestCount": 2,
                                  "guestName": "Nguyễn Văn A",
                                  "phone": "0912345678",
                                  "email": "a@example.com"
                                }
                                """.formatted(checkIn, checkOut)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookingCode").value("BK261013-A1B2C"))
                .andExpect(jsonPath("$.status").value("CHO_XAC_NHAN"))
                .andExpect(jsonPath("$.estimatedTotal").value(2000000.00))
                .andExpect(jsonPath("$.requiredDeposit").value(600000.00));
    }

    @Test
    void rejectsInvalidRequestBeforeCallingService() throws Exception {
        mockMvc.perform(post("/api/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "roomId": "",
                                  "checkIn": "2020-01-01",
                                  "checkOut": "2020-01-01",
                                  "guestCount": 0,
                                  "guestName": "",
                                  "phone": "abc",
                                  "email": "invalid"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Dữ liệu đặt phòng không hợp lệ"))
                .andExpect(jsonPath("$.errors.roomId").exists())
                .andExpect(jsonPath("$.errors.phone").exists());
    }
}
