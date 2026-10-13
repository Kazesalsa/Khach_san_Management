package com.hotel.suongmai.service;

import com.hotel.suongmai.config.PayOSConfig;
import com.hotel.suongmai.dto.PaymentStatusResponse;
import com.hotel.suongmai.entity.*;
import com.hotel.suongmai.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.payos.PayOS;
import vn.payos.type.Webhook;
import vn.payos.type.WebhookData;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PayOSConfig payOSConfig;

    @Mock
    private PayOS payOS;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BookingDetailRepository bookingDetailRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private RoomCategoryRepository roomCategoryRepository;

    @Mock
    private KhachHangRepository khachHangRepository;

    @Mock
    private NhanVienRepository nhanVienRepository;

    @Mock
    private ThanhToanRepository thanhToanRepository;

    @Mock
    private HoaDonRepository hoaDonRepository;

    @Mock
    private SuDungDichVuRepository suDungDichVuRepository;

    @InjectMocks
    private PaymentService paymentService;

    private Booking booking;
    private ThanhToan depositPayment;
    private ThanhToan checkoutPayment;
    private HoaDon invoice;

    @BeforeEach
    void setUp() {
        KhachHang customer = new KhachHang();
        customer.setId("cust-1");
        customer.setHoTen("Nguyễn Văn An");
        customer.setSoDienThoai("0912345678");

        booking = new Booking();
        booking.setId("book-1");
        booking.setBookingCode("SM-482031");
        booking.setCustomer(customer);
        booking.setStatus(BookingStatus.CHO_XAC_NHAN);
        booking.setEstimatedTotal(BigDecimal.valueOf(4800000));
        booking.setRequiredDeposit(BigDecimal.valueOf(1440000));

        invoice = new HoaDon();
        invoice.setId("inv-1");
        invoice.setInvoiceNumber("HD-001");
        invoice.setTotalAmount(BigDecimal.valueOf(4800000));
        invoice.setRemainingAmount(BigDecimal.valueOf(3360000));
        invoice.setStatus(TrangThaiHoaDon.CHO_THANH_TOAN);

        depositPayment = new ThanhToan();
        depositPayment.setId("pay-1");
        depositPayment.setReferenceCode("1234567890");
        depositPayment.setAmount(BigDecimal.valueOf(1440000));
        depositPayment.setTransactionType(LoaiGiaoDich.TIEN_COC);
        depositPayment.setPaymentMethod(PhuongThucThanhToan.CHUYEN_KHOAN);
        depositPayment.setStatus(TrangThaiThanhToan.CHO_XAC_NHAN);
        depositPayment.setBooking(booking);

        checkoutPayment = new ThanhToan();
        checkoutPayment.setId("pay-2");
        checkoutPayment.setReferenceCode("9876543210");
        checkoutPayment.setAmount(BigDecimal.valueOf(3360000));
        checkoutPayment.setTransactionType(LoaiGiaoDich.THANH_TOAN_HOA_DON);
        checkoutPayment.setPaymentMethod(PhuongThucThanhToan.CHUYEN_KHOAN);
        checkoutPayment.setStatus(TrangThaiThanhToan.CHO_XAC_NHAN);
        checkoutPayment.setBooking(booking);
        checkoutPayment.setInvoice(invoice);
    }

    @Test
    @DisplayName("Áp dụng cọc thành công: cập nhật ThanhToan THANH_CONG và Booking sang DA_DAT")
    void applyPaymentSuccess_deposit() {
        when(thanhToanRepository.findByReferenceCode("1234567890")).thenReturn(Optional.of(depositPayment));

        paymentService.applyPaymentSuccess(1234567890L, BigDecimal.valueOf(1440000));

        assertThat(depositPayment.getStatus()).isEqualTo(TrangThaiThanhToan.THANH_CONG);
        assertThat(booking.getStatus()).isEqualTo(BookingStatus.DA_DAT);
        verify(thanhToanRepository).save(depositPayment);
        verify(bookingRepository).save(booking);
    }

    @Test
    @DisplayName("Áp dụng thanh toán checkout thành công: cập nhật hóa đơn DA_THANH_TOAN và remainingAmount = 0")
    void applyPaymentSuccess_checkout() {
        when(thanhToanRepository.findByReferenceCode("9876543210")).thenReturn(Optional.of(checkoutPayment));

        paymentService.applyPaymentSuccess(9876543210L, BigDecimal.valueOf(3360000));

        assertThat(checkoutPayment.getStatus()).isEqualTo(TrangThaiThanhToan.THANH_CONG);
        assertThat(invoice.getStatus()).isEqualTo(TrangThaiHoaDon.DA_THANH_TOAN);
        assertThat(invoice.getRemainingAmount()).isEqualByComparingTo(BigDecimal.ZERO);
        verify(thanhToanRepository).save(checkoutPayment);
        verify(hoaDonRepository).save(invoice);
    }

    @Test
    @DisplayName("Kiểm tra trạng thái thanh toán khi giao dịch đã thành công")
    void checkPaymentStatus_alreadyPaid() {
        depositPayment.setStatus(TrangThaiThanhToan.THANH_CONG);
        depositPayment.setTransactionTime(LocalDateTime.now());
        when(thanhToanRepository.findByReferenceCode("1234567890")).thenReturn(Optional.of(depositPayment));

        PaymentStatusResponse res = paymentService.checkPaymentStatus(1234567890L);

        assertThat(res.getStatus()).isEqualTo("PAID");
        assertThat(res.getBookingCode()).isEqualTo("SM-482031");
        assertThat(res.getAmount()).isEqualByComparingTo(BigDecimal.valueOf(1440000));
    }

    @Test
    @DisplayName("Xử lý Webhook hợp lệ từ PayOS")
    void processWebhook_success() throws Exception {
        WebhookData webhookData = WebhookData.builder()
                .orderCode(1234567890L)
                .amount(1440000)
                .description("Coc SM-482031")
                .accountNumber("VQRQAMSXX6266")
                .reference("REF123")
                .transactionDateTime("2026-10-12 12:00:00")
                .currency("VND")
                .paymentLinkId("link123")
                .code("00")
                .desc("success")
                .build();

        Webhook webhook = Webhook.builder()
                .code("00")
                .desc("success")
                .data(webhookData)
                .signature("test_signature")
                .success(true)
                .build();

        when(payOS.verifyPaymentWebhookData(webhook)).thenReturn(webhookData);
        when(thanhToanRepository.findByReferenceCode("1234567890")).thenReturn(Optional.of(depositPayment));

        paymentService.processWebhook(webhook);

        assertThat(depositPayment.getStatus()).isEqualTo(TrangThaiThanhToan.THANH_CONG);
        assertThat(booking.getStatus()).isEqualTo(BookingStatus.DA_DAT);
    }
}
