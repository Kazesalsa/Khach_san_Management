package com.hotel.suongmai.controller;

import com.hotel.suongmai.config.SecurityConfig;
import com.hotel.suongmai.dto.PriceListResult;
import com.hotel.suongmai.entity.PriceList;
import com.hotel.suongmai.entity.RoomCategory;
import com.hotel.suongmai.entity.TaiKhoan;
import com.hotel.suongmai.entity.TrangThaiTaiKhoan;
import com.hotel.suongmai.entity.VaiTro;
import com.hotel.suongmai.exception.PriceListExceptionHandler;
import com.hotel.suongmai.exception.PriceListOverlapException;
import com.hotel.suongmai.security.JwtAuthenticationFilter;
import com.hotel.suongmai.security.JwtTokenProvider;
import com.hotel.suongmai.security.TaiKhoanDetails;
import com.hotel.suongmai.security.TaiKhoanDetailsService;
import com.hotel.suongmai.service.PriceListService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PriceListController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, PriceListExceptionHandler.class})
class PriceListControllerSecurityTest {

    private static final String VALID_REQUEST = """
            {
              "roomCategoryId": "cat-1",
              "startDate": "2026-11-01",
              "endDate": "2026-11-10",
              "price": 500000,
              "status": "ACTIVE"
            }
            """;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PriceListService priceListService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private TaiKhoanDetailsService taiKhoanDetailsService;

    @Test
    void rejectsRequestWithoutTokenWithForbidden() throws Exception {
        mockMvc.perform(post("/api/price-lists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_REQUEST))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message")
                        .value("Bạn không có quyền thực hiện thao tác này"));

        verifyNoInteractions(priceListService);
    }

    @Test
    void rejectsAuthenticatedUserWithoutOwnerRole() throws Exception {
        authenticate("reception-token", "reception", VaiTro.LE_TAN);

        mockMvc.perform(post("/api/price-lists")
                        .header("Authorization", "Bearer reception-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_REQUEST))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message")
                        .value("Bạn không có quyền thực hiện thao tác này"));

        verifyNoInteractions(priceListService);
    }

    @Test
    void rejectsInvalidTokenWithForbidden() throws Exception {
        when(jwtTokenProvider.validateToken("invalid-token")).thenReturn(false);

        mockMvc.perform(post("/api/price-lists")
                        .header("Authorization", "Bearer invalid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_REQUEST))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message")
                        .value("Bạn không có quyền thực hiện thao tác này"));

        verifyNoInteractions(priceListService);
    }

    @Test
    void ownerCanCreatePriceList() throws Exception {
        authenticateOwner();
        when(priceListService.createPriceList(
                eq("cat-1"),
                eq(LocalDateTime.of(2026, 11, 1, 0, 0)),
                eq(LocalDateTime.of(2026, 11, 10, 23, 59, 59, 999_999_999)),
                eq(new BigDecimal("500000")),
                eq("ACTIVE")))
                .thenReturn(result(false, "Thiết lập bảng giá thành công."));

        mockMvc.perform(post("/api/price-lists")
                        .header("Authorization", "Bearer owner-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_REQUEST))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("price-1"))
                .andExpect(jsonPath("$.roomCategoryId").value("cat-1"))
                .andExpect(jsonPath("$.startDate").value("2026-11-01"))
                .andExpect(jsonPath("$.endDate").value("2026-11-10"))
                .andExpect(jsonPath("$.price").value(500000))
                .andExpect(jsonPath("$.hasExistingBookings").value(false))
                .andExpect(jsonPath("$.message").value("Thiết lập bảng giá thành công."))
                .andExpect(jsonPath("$.warning").doesNotExist());
    }

    @Test
    void validationRejectsEmptyAndNonPositiveDataWithoutCallingService() throws Exception {
        authenticateOwner();

        mockMvc.perform(post("/api/price-lists")
                        .header("Authorization", "Bearer owner-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "roomCategoryId": "",
                                  "startDate": "2026-11-10",
                                  "endDate": "2026-11-01",
                                  "price": 0
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Dữ liệu bảng giá không hợp lệ"))
                .andExpect(jsonPath("$.errors.roomCategoryId").exists())
                .andExpect(jsonPath("$.errors.price").exists())
                .andExpect(jsonPath("$.errors.dateRangeValid").exists());

        verifyNoInteractions(priceListService);
    }

    @Test
    void validationRejectsMissingRequiredFieldsWithoutCallingService() throws Exception {
        authenticateOwner();

        mockMvc.perform(post("/api/price-lists")
                        .header("Authorization", "Bearer owner-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Dữ liệu bảng giá không hợp lệ"))
                .andExpect(jsonPath("$.errors.roomCategoryId").exists())
                .andExpect(jsonPath("$.errors.startDate").exists())
                .andExpect(jsonPath("$.errors.endDate").exists())
                .andExpect(jsonPath("$.errors.price").exists());

        verifyNoInteractions(priceListService);
    }

    @Test
    void malformedDateReturnsBadRequestWithoutCallingService() throws Exception {
        authenticateOwner();

        mockMvc.perform(post("/api/price-lists")
                        .header("Authorization", "Bearer owner-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "roomCategoryId": "cat-1",
                                  "startDate": "01-11-2026",
                                  "endDate": "2026-11-10",
                                  "price": 500000
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Dữ liệu bảng giá không hợp lệ"));

        verifyNoInteractions(priceListService);
    }

    @Test
    void overlapExceptionReturnsBadRequest() throws Exception {
        authenticateOwner();
        when(priceListService.createPriceList(any(), any(), any(), any(), any()))
                .thenThrow(new PriceListOverlapException("Khoảng ngày đã tồn tại bảng giá"));

        mockMvc.perform(post("/api/price-lists")
                        .header("Authorization", "Bearer owner-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_REQUEST))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Khoảng ngày đã tồn tại bảng giá"));
    }

    @Test
    void databaseExceptionReturnsRequiredInternalServerError() throws Exception {
        authenticateOwner();
        when(priceListService.createPriceList(any(), any(), any(), any(), any()))
                .thenThrow(new DataAccessResourceFailureException("database unavailable"));

        mockMvc.perform(post("/api/price-lists")
                        .header("Authorization", "Bearer owner-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_REQUEST))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message")
                        .value("Không thể lưu bảng giá. Vui lòng thử lại."));
    }

    @Test
    void responseContainsWarningWhenExistingBookingsAreAffected() throws Exception {
        authenticateOwner();
        when(priceListService.createPriceList(any(), any(), any(), any(), any()))
                .thenReturn(result(true, "Các booking cũ vẫn giữ nguyên mức giá."));

        mockMvc.perform(post("/api/price-lists")
                        .header("Authorization", "Bearer owner-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_REQUEST))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.hasExistingBookings").value(true))
                .andExpect(jsonPath("$.warning")
                        .value("Các booking cũ vẫn giữ nguyên mức giá."));
    }

    @Test
    void ownerCanUpdatePriceList() throws Exception {
        authenticateOwner();
        when(priceListService.updatePriceList(
                eq("price-1"), any(), any(), eq(new BigDecimal("650000")), eq("ACTIVE")))
                .thenReturn(result(false, "Cập nhật bảng giá thành công."));

        mockMvc.perform(put("/api/price-lists/price-1")
                        .header("Authorization", "Bearer owner-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "startDate": "2026-12-01",
                                  "endDate": "2026-12-15",
                                  "price": 650000,
                                  "status": "ACTIVE"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("price-1"))
                .andExpect(jsonPath("$.message").value("Cập nhật bảng giá thành công."));

        verify(priceListService).updatePriceList(
                "price-1",
                LocalDateTime.of(2026, 12, 1, 0, 0),
                LocalDateTime.of(2026, 12, 15, 23, 59, 59, 999_999_999),
                new BigDecimal("650000"),
                "ACTIVE");
    }

    @Test
    void updateResponseKeepsUpdateMessageWhenExistingBookingsAreAffected() throws Exception {
        authenticateOwner();
        when(priceListService.updatePriceList(eq("price-1"), any(), any(), any(), any()))
                .thenReturn(result(true, "Giá của các đặt phòng cũ không bị thay đổi."));

        mockMvc.perform(put("/api/price-lists/price-1")
                        .header("Authorization", "Bearer owner-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "startDate": "2026-12-01",
                                  "endDate": "2026-12-15",
                                  "price": 650000,
                                  "status": "ACTIVE"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Cập nhật bảng giá thành công."))
                .andExpect(jsonPath("$.hasExistingBookings").value(true))
                .andExpect(jsonPath("$.warning")
                        .value("Giá của các đặt phòng cũ không bị thay đổi."));
    }

    @Test
    void updateValidationRejectsInvalidDataWithoutCallingService() throws Exception {
        authenticateOwner();

        mockMvc.perform(put("/api/price-lists/price-1")
                        .header("Authorization", "Bearer owner-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "startDate": "2026-12-15",
                                  "endDate": "2026-12-01",
                                  "price": -1
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.price").exists())
                .andExpect(jsonPath("$.errors.dateRangeValid").exists());

        verifyNoInteractions(priceListService);
    }

    @Test
    void updateOverlapExceptionReturnsBadRequest() throws Exception {
        authenticateOwner();
        when(priceListService.updatePriceList(eq("price-1"), any(), any(), any(), any()))
                .thenThrow(new PriceListOverlapException("Khoảng ngày đã tồn tại bảng giá"));

        mockMvc.perform(put("/api/price-lists/price-1")
                        .header("Authorization", "Bearer owner-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "startDate": "2026-12-01",
                                  "endDate": "2026-12-15",
                                  "price": 650000,
                                  "status": "ACTIVE"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Khoảng ngày đã tồn tại bảng giá"));
    }

    @Test
    void updateDatabaseExceptionReturnsRequiredInternalServerError() throws Exception {
        authenticateOwner();
        when(priceListService.updatePriceList(eq("price-1"), any(), any(), any(), any()))
                .thenThrow(new DataAccessResourceFailureException("database unavailable"));

        mockMvc.perform(put("/api/price-lists/price-1")
                        .header("Authorization", "Bearer owner-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "startDate": "2026-12-01",
                                  "endDate": "2026-12-15",
                                  "price": 650000,
                                  "status": "ACTIVE"
                                }
                                """))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message")
                        .value("Không thể lưu bảng giá. Vui lòng thử lại."));
    }

    @Test
    void invalidRoomCategoryFromServiceReturnsBadRequest() throws Exception {
        authenticateOwner();
        when(priceListService.createPriceList(any(), any(), any(), any(), any()))
                .thenThrow(new IllegalArgumentException("Không tìm thấy hạng phòng"));

        mockMvc.perform(post("/api/price-lists")
                        .header("Authorization", "Bearer owner-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_REQUEST))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Không tìm thấy hạng phòng"));
    }

    private void authenticateOwner() {
        authenticate("owner-token", "admin", VaiTro.CHU_KHACH_SAN);
    }

    private void authenticate(String token, String username, VaiTro role) {
        TaiKhoan account = new TaiKhoan();
        account.setId("account-1");
        account.setTenDangNhap(username);
        account.setMatKhauHash("encoded-password");
        account.setVaiTro(role);
        account.setTrangThai(TrangThaiTaiKhoan.HOAT_DONG);

        when(jwtTokenProvider.validateToken(token)).thenReturn(true);
        when(jwtTokenProvider.getUsernameFromJwt(token)).thenReturn(username);
        when(taiKhoanDetailsService.loadUserByUsername(username))
                .thenReturn(new TaiKhoanDetails(account));
    }

    private PriceListResult result(boolean hasExistingBookings, String notice) {
        RoomCategory category = new RoomCategory();
        category.setId("cat-1");
        category.setName("Standard");

        PriceList priceList = new PriceList();
        priceList.setId("price-1");
        priceList.setRoomCategory(category);
        priceList.setStartDate(LocalDateTime.of(2026, 11, 1, 0, 0));
        priceList.setEndDate(LocalDateTime.of(2026, 11, 10, 23, 59, 59));
        priceList.setPrice(new BigDecimal("500000"));
        priceList.setStatus("ACTIVE");

        return new PriceListResult(priceList, hasExistingBookings, notice);
    }
}
