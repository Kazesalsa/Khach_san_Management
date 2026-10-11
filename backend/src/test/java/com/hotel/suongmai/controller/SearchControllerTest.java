package com.hotel.suongmai.controller;

import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.entity.RoomCategory;
import com.hotel.suongmai.service.RoomService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup;

@ExtendWith(MockitoExtension.class)
class SearchControllerTest {

    private static final String ENDPOINT = "/api/rooms/available";

    @Mock
    private RoomService roomService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = standaloneSetup(new SearchController(roomService)).build();
    }

    @Test
    void returnsAvailableRoomsInFrontendJsonFormat() throws Exception {
        LocalDate fromDate = LocalDate.of(2026, 10, 12);
        LocalDate toDate = LocalDate.of(2026, 10, 15);
        when(roomService.findAvailableRooms(fromDate, toDate)).thenReturn(List.of(room()));

        mockMvc.perform(get(ENDPOINT)
                        .param("from_date", "2026-10-12")
                        .param("to_date", "2026-10-15"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("room-101"))
                .andExpect(jsonPath("$[0].roomNumber").value("101"))
                .andExpect(jsonPath("$[0].roomType").value("Deluxe"))
                .andExpect(jsonPath("$[0].capacity").value(2))
                .andExpect(jsonPath("$[0].pricePerNight").isEmpty());

        verify(roomService).findAvailableRooms(fromDate, toDate);
    }

    @Test
    void returnsBadRequestWithoutCallingServiceWhenFromDateIsAfterToDate() throws Exception {
        mockMvc.perform(get(ENDPOINT)
                        .param("from_date", "2026-10-16")
                        .param("to_date", "2026-10-15"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message")
                        .value("from_date phải nhỏ hơn to_date"));

        verifyNoInteractions(roomService);
    }

    @Test
    void returnsBadRequestWithoutCallingServiceWhenDatesAreEqual() throws Exception {
        mockMvc.perform(get(ENDPOINT)
                        .param("from_date", "2026-10-15")
                        .param("to_date", "2026-10-15"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message")
                        .value("from_date phải nhỏ hơn to_date"));

        verifyNoInteractions(roomService);
    }

    @Test
    void returnsInternalServerErrorWhenDatabaseIsUnavailable() throws Exception {
        LocalDate fromDate = LocalDate.of(2026, 10, 12);
        LocalDate toDate = LocalDate.of(2026, 10, 15);
        when(roomService.findAvailableRooms(fromDate, toDate))
                .thenThrow(new DataAccessResourceFailureException("Database unavailable"));

        mockMvc.perform(get(ENDPOINT)
                        .param("from_date", "2026-10-12")
                        .param("to_date", "2026-10-15"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Hệ thống gặp trục trặc"));
    }

    @Test
    void returnsInternalServerErrorWhenServiceThrowsUnexpectedError() throws Exception {
        LocalDate fromDate = LocalDate.of(2026, 10, 12);
        LocalDate toDate = LocalDate.of(2026, 10, 15);
        when(roomService.findAvailableRooms(fromDate, toDate))
                .thenThrow(new IllegalStateException("Unexpected error"));

        mockMvc.perform(get(ENDPOINT)
                        .param("from_date", "2026-10-12")
                        .param("to_date", "2026-10-15"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Hệ thống gặp trục trặc"));
    }

    @Test
    void returnsBadRequestWithoutCallingServiceWhenDateParameterIsMissing() throws Exception {
        mockMvc.perform(get(ENDPOINT).param("from_date", "2026-10-12"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(roomService);
    }

    private Room room() {
        RoomCategory category = new RoomCategory();
        category.setName("Deluxe");
        category.setMaxCapacity(2);

        Room room = new Room();
        room.setId("room-101");
        room.setRoomNumber("101");
        room.setRoomCategory(category);
        return room;
    }
}
