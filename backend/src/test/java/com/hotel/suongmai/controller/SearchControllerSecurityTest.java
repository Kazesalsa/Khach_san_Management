package com.hotel.suongmai.controller;

import com.hotel.suongmai.config.SecurityConfig;
import com.hotel.suongmai.security.JwtAuthenticationFilter;
import com.hotel.suongmai.security.JwtTokenProvider;
import com.hotel.suongmai.security.TaiKhoanDetailsService;
import com.hotel.suongmai.service.RoomService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SearchController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class SearchControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RoomService roomService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private TaiKhoanDetailsService taiKhoanDetailsService;

    @Test
    void allowsPublicSearchWithoutJwtToken() throws Exception {
        LocalDate fromDate = LocalDate.of(2026, 10, 12);
        LocalDate toDate = LocalDate.of(2026, 10, 15);
        when(roomService.findAvailableRooms(fromDate, toDate)).thenReturn(List.of());

        mockMvc.perform(get("/api/rooms/available")
                        .param("from_date", "2026-10-12")
                        .param("to_date", "2026-10-15"))
                .andExpect(status().isOk());

        verify(roomService).findAvailableRooms(fromDate, toDate);
    }
}
