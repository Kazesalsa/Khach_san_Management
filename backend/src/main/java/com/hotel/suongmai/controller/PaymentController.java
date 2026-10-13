package com.hotel.suongmai.controller;

import com.hotel.suongmai.dto.CreateCheckoutPaymentRequest;
import com.hotel.suongmai.dto.CreateDepositPaymentRequest;
import com.hotel.suongmai.dto.PaymentLinkResponse;
import com.hotel.suongmai.dto.PaymentStatusResponse;
import com.hotel.suongmai.security.TaiKhoanDetails;
import com.hotel.suongmai.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.payos.type.Webhook;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Tạo link thanh toán tiền cọc giữ phòng (Deposit) qua PayOS
     */
    @PostMapping("/create-deposit")
    public ResponseEntity<PaymentLinkResponse> createDepositPayment(
            @RequestBody CreateDepositPaymentRequest request,
            @AuthenticationPrincipal TaiKhoanDetails accountDetails) {
        String username = accountDetails != null ? accountDetails.getUsername() : null;
        PaymentLinkResponse response = paymentService.createDepositPaymentLink(request, username);
        return ResponseEntity.ok(response);
    }

    /**
     * Tạo link thanh toán quyết toán hóa đơn khi Trả phòng (Checkout) qua PayOS
     */
    @PostMapping("/create-checkout")
    public ResponseEntity<PaymentLinkResponse> createCheckoutPayment(
            @RequestBody CreateCheckoutPaymentRequest request,
            @AuthenticationPrincipal TaiKhoanDetails accountDetails) {
        String username = accountDetails != null ? accountDetails.getUsername() : null;
        PaymentLinkResponse response = paymentService.createCheckoutPaymentLink(request, username);
        return ResponseEntity.ok(response);
    }

    /**
     * Webhook nhận thông báo tự động từ cổng thanh toán PayOS
     */
    @PostMapping("/webhook")
    public ResponseEntity<Map<String, Object>> handleWebhook(@RequestBody Webhook webhook) {
        try {
            paymentService.processWebhook(webhook);
            return ResponseEntity.ok(Map.of("code", "00", "message", "Webhook processed successfully"));
        } catch (Exception e) {
            log.error("Lỗi xử lý webhook PayOS: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("code", "01", "error", e.getMessage()));
        }
    }

    /**
     * Kiểm tra trạng thái thanh toán theo orderCode và tự động đồng bộ từ PayOS
     */
    @GetMapping("/status/{orderCode}")
    public ResponseEntity<PaymentStatusResponse> getPaymentStatus(@PathVariable Long orderCode) {
        PaymentStatusResponse response = paymentService.checkPaymentStatus(orderCode);
        return ResponseEntity.ok(response);
    }
}
