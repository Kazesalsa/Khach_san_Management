package com.hotel.suongmai.controller;

import com.hotel.suongmai.config.SecurityConfig;
import com.hotel.suongmai.dto.PaymentLinkResponse;
import com.hotel.suongmai.dto.PaymentStatusResponse;
import com.hotel.suongmai.security.JwtAuthenticationFilter;
import com.hotel.suongmai.security.JwtTokenProvider;
import com.hotel.suongmai.security.TaiKhoanDetailsService;
import com.hotel.suongmai.service.PaymentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PaymentController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class PaymentControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PaymentService paymentService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private TaiKhoanDetailsService taiKhoanDetailsService;

    @Test
    @DisplayName("API tạo link thanh toán cọc (/api/payment/create-deposit) cho phép truy cập công khai không cần token")
    void createDepositIsPublic() throws Exception {
        PaymentLinkResponse response = PaymentLinkResponse.builder()
                .bookingCode("SM-123456")
                .orderCode(172874918234L)
                .checkoutUrl("https://pay.payos.vn/web/test")
                .amount(300000)
                .status("PENDING")
                .build();

        when(paymentService.createDepositPaymentLink(any(), any())).thenReturn(response);

        mockMvc.perform(post("/api/payment/create-deposit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "bookingCode": "SM-123456",
                                  "guestName": "Tran Van B",
                                  "phone": "0987654321",
                                  "depositAmount": 300000
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderCode").value(172874918234L))
                .andExpect(jsonPath("$.checkoutUrl").value("https://pay.payos.vn/web/test"));
    }

    @Test
    @DisplayName("API tạo link thanh toán checkout (/api/payment/create-checkout) hoạt động tốt")
    void createCheckoutIsPublic() throws Exception {
        PaymentLinkResponse response = PaymentLinkResponse.builder()
                .bookingCode("SM-482031")
                .orderCode(172874918235L)
                .checkoutUrl("https://pay.payos.vn/web/checkout-test")
                .amount(3360000)
                .status("PENDING")
                .build();

        when(paymentService.createCheckoutPaymentLink(any(), any())).thenReturn(response);

        mockMvc.perform(post("/api/payment/create-checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "bookingCode": "SM-482031",
                                  "amount": 3360000
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingCode").value("SM-482031"))
                .andExpect(jsonPath("$.amount").value(3360000));
    }

    @Test
    @DisplayName("API kiểm tra trạng thái thanh toán (/api/payment/status/{orderCode}) hoạt động công khai")
    void getStatusIsPublic() throws Exception {
        PaymentStatusResponse response = PaymentStatusResponse.builder()
                .orderCode(1234567890L)
                .bookingCode("SM-123456")
                .status("PAID")
                .amount(BigDecimal.valueOf(500000))
                .message("Thanh toán thành công")
                .build();

        when(paymentService.checkPaymentStatus(eq(1234567890L))).thenReturn(response);

        mockMvc.perform(get("/api/payment/status/1234567890"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PAID"))
                .andExpect(jsonPath("$.bookingCode").value("SM-123456"));
    }

    @Test
    @DisplayName("API webhook (/api/payment/webhook) mở công khai cho server PayOS gọi vào")
    void webhookIsPublic() throws Exception {
        mockMvc.perform(post("/api/payment/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "code": "00",
                                  "desc": "success",
                                  "success": true,
                                  "data": {
                                    "orderCode": 1234567890,
                                    "amount": 300000,
                                    "description": "Test",
                                    "accountNumber": "123",
                                    "reference": "ref",
                                    "transactionDateTime": "2026-10-12 12:00:00",
                                    "currency": "VND",
                                    "paymentLinkId": "link",
                                    "code": "00",
                                    "desc": "success"
                                  },
                                  "signature": "sig"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("00"));
    }
}
