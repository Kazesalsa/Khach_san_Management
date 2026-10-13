package com.hotel.suongmai.service;

import com.hotel.suongmai.dto.CheckoutResponse;
import com.hotel.suongmai.dto.OccupiedRoomResponse;
import com.hotel.suongmai.entity.*;
import com.hotel.suongmai.exception.BookingNotFoundException;
import com.hotel.suongmai.exception.InvalidBookingStateException;
import com.hotel.suongmai.exception.UnpaidBookingException;
import com.hotel.suongmai.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CheckoutServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BookingDetailRepository bookingDetailRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private HoaDonRepository hoaDonRepository;

    @Mock
    private NhanVienRepository nhanVienRepository;

    @Mock
    private ThanhToanRepository thanhToanRepository;

    @Mock
    private SuDungDichVuRepository suDungDichVuRepository;

    @InjectMocks
    private CheckoutService checkoutService;

    private Booking sampleBooking;
    private BookingDetail sampleDetail;
    private Room sampleRoom;
    private HoaDon sampleInvoice;
    private NhanVien sampleStaff;

    @BeforeEach
    void setUp() {
        KhachHang customer = new KhachHang();
        customer.setId("kh-01");
        customer.setHoTen("Nguyễn Văn An");
        customer.setSoDienThoai("0912345678");

        sampleBooking = new Booking();
        sampleBooking.setId("b-01");
        sampleBooking.setBookingCode("BOOK001");
        sampleBooking.setCustomer(customer);
        sampleBooking.setStatus(BookingStatus.DA_NHAN);
        sampleBooking.setEstimatedTotal(new BigDecimal("2000000"));

        RoomCategory category = new RoomCategory();
        category.setName("Deluxe");

        sampleRoom = new Room();
        sampleRoom.setId("r-101");
        sampleRoom.setRoomNumber("101");
        sampleRoom.setFloor(1);
        sampleRoom.setRoomCategory(category);
        sampleRoom.setUsageStatus(UsageStatus.DANG_O);
        sampleRoom.setCleaningStatus(CleaningStatus.DA_DON_XONG);

        sampleInvoice = new HoaDon();
        sampleInvoice.setId("hd-01");
        sampleInvoice.setStatus(TrangThaiHoaDon.CHO_THANH_TOAN);
        sampleInvoice.setTotalAmount(new BigDecimal("2000000"));

        sampleDetail = new BookingDetail();
        sampleDetail.setId("bd-01");
        sampleDetail.setBooking(sampleBooking);
        sampleDetail.setRoom(sampleRoom);
        sampleDetail.setInvoice(sampleInvoice);
        sampleDetail.setActualCheckInTime(LocalDateTime.of(2026, 10, 10, 14, 0));
        sampleDetail.setExpectedCheckOutDate(LocalDate.of(2026, 10, 13));
        sampleDetail.setGuestCount(2);

        sampleStaff = new NhanVien();
        sampleStaff.setId("nv-01");
        sampleStaff.setHoNv("Trần Thị");
        sampleStaff.setTenNv("Mai");
    }

    // =========================================================================
    // Tests cho getOccupiedRooms()
    // =========================================================================

    @Test
    @DisplayName("Lấy danh sách phòng đang ở - Đã thanh toán đủ (paid)")
    void getOccupiedRooms_whenPaidInFull_shouldReturnPaidStatus() {
        when(bookingDetailRepository.findOccupied()).thenReturn(List.of(sampleDetail));
        when(suDungDichVuRepository.sumServiceFeeByBooking("b-01")).thenReturn(new BigDecimal("500000"));
        // Tổng cần thu = 2.000.000 (phòng) + 500.000 (dịch vụ) = 2.500.000
        when(thanhToanRepository.sumPaidByBooking("b-01")).thenReturn(new BigDecimal("2500000"));

        List<OccupiedRoomResponse> result = checkoutService.getOccupiedRooms();

        assertThat(result).hasSize(1);
        OccupiedRoomResponse res = result.get(0);
        assertThat(res.roomNumber()).isEqualTo("101");
        assertThat(res.guestName()).isEqualTo("Nguyễn Văn An");
        assertThat(res.roomType()).isEqualTo("Deluxe");
        assertThat(res.bookingCode()).isEqualTo("BOOK001");
        assertThat(res.totalAmount()).isEqualByComparingTo(new BigDecimal("2500000"));
        assertThat(res.paidAmount()).isEqualByComparingTo(new BigDecimal("2500000"));
        assertThat(res.remainingAmount()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(res.paymentStatus()).isEqualTo("paid");
    }

    @Test
    @DisplayName("Lấy danh sách phòng đang ở - Chưa thanh toán đủ (unpaid)")
    void getOccupiedRooms_whenPartiallyPaid_shouldReturnUnpaidStatus() {
        when(bookingDetailRepository.findOccupied()).thenReturn(List.of(sampleDetail));
        when(suDungDichVuRepository.sumServiceFeeByBooking("b-01")).thenReturn(BigDecimal.ZERO);
        when(thanhToanRepository.sumPaidByBooking("b-01")).thenReturn(new BigDecimal("1000000"));

        List<OccupiedRoomResponse> result = checkoutService.getOccupiedRooms();

        assertThat(result).hasSize(1);
        OccupiedRoomResponse res = result.get(0);
        assertThat(res.paymentStatus()).isEqualTo("unpaid");
        assertThat(res.remainingAmount()).isEqualByComparingTo(new BigDecimal("1000000"));
    }

    @Test
    @DisplayName("Không có phòng nào đang ở - Trả về danh sách rỗng")
    void getOccupiedRooms_whenEmpty_shouldReturnEmptyList() {
        when(bookingDetailRepository.findOccupied()).thenReturn(List.of());

        List<OccupiedRoomResponse> result = checkoutService.getOccupiedRooms();

        assertThat(result).isEmpty();
    }

    // =========================================================================
    // Tests cho checkout(bookingCode, username) - Issue #96
    // =========================================================================

    @Test
    @DisplayName("Check-out thành công khi đã thanh toán đủ: đổi trạng thái phòng sang TRONG và CHUA_DON")
    void checkout_whenPaidInFull_shouldSucceedAndUpdateStatus() {
        when(bookingRepository.findByBookingCode("BOOK001")).thenReturn(Optional.of(sampleBooking));
        sampleInvoice.setStatus(TrangThaiHoaDon.DA_THANH_TOAN);
        when(hoaDonRepository.findByBookingId("b-01"))
                .thenReturn(Optional.of(sampleInvoice));
        when(nhanVienRepository.findByTaiKhoan_TenDangNhap("letan1")).thenReturn(Optional.of(sampleStaff));
        when(bookingDetailRepository.findByBookingId("b-01")).thenReturn(List.of(sampleDetail));

        CheckoutResponse response = checkoutService.checkout("BOOK001", "letan1");

        // 1. Kiểm tra kết quả trả về
        assertThat(response).isNotNull();
        assertThat(response.bookingCode()).isEqualTo("BOOK001");
        assertThat(response.roomNumbers()).containsExactly("101");
        assertThat(response.cashierStaffName()).isEqualTo("Trần Thị Mai");
        assertThat(response.checkOutTime()).isNotNull();

        // 2. Kiểm tra Booking đổi sang DA_TRA_PHONG
        assertThat(sampleBooking.getStatus()).isEqualTo(BookingStatus.DA_TRA_PHONG);
        verify(bookingRepository).save(sampleBooking);

        // 3. Kiểm tra Room đổi sang TRONG và CHUA_DON (để lao công dọn dẹp)
        assertThat(sampleRoom.getUsageStatus()).isEqualTo(UsageStatus.TRONG);
        assertThat(sampleRoom.getCleaningStatus()).isEqualTo(CleaningStatus.CHUA_DON);
        verify(roomRepository).save(sampleRoom);

        // 4. Kiểm tra BookingDetail cập nhật giờ trả và nhân viên check-out
        assertThat(sampleDetail.getActualCheckOutTime()).isNotNull();
        assertThat(sampleDetail.getStatus()).isEqualTo("DA_TRA_PHONG");
        assertThat(sampleDetail.getCheckOutStaff()).isEqualTo(sampleStaff);
        verify(bookingDetailRepository).save(sampleDetail);

        // 5. Kiểm tra hóa đơn được chốt
        assertThat(sampleInvoice.getStatus()).isEqualTo(TrangThaiHoaDon.DA_CHOT);
        assertThat(sampleInvoice.getFinalizedAt()).isNotNull();
        assertThat(sampleInvoice.getFinalizedByStaff()).isEqualTo(sampleStaff);
        verify(hoaDonRepository).save(sampleInvoice);
    }

    @Test
    @DisplayName("Check-out thành công khi chưa có hóa đơn trước đó nhưng khách đã thanh toán đủ")
    void checkout_whenNoInvoiceYetButPaidInFull_shouldAutoCreateInvoiceAndSucceed() {
        when(bookingRepository.findByBookingCode("BOOK001")).thenReturn(Optional.of(sampleBooking));
        when(hoaDonRepository.findByBookingId("b-01")).thenReturn(Optional.empty());
        when(suDungDichVuRepository.sumServiceFeeByBooking("b-01")).thenReturn(BigDecimal.ZERO);
        // sampleBooking estimatedTotal là 2.000.000, đã thanh toán 2.000.000
        when(thanhToanRepository.sumPaidByBooking("b-01")).thenReturn(new BigDecimal("2000000"));
        when(nhanVienRepository.findByTaiKhoan_TenDangNhap("letan1")).thenReturn(Optional.of(sampleStaff));
        when(bookingDetailRepository.findByBookingId("b-01")).thenReturn(List.of(sampleDetail));
        when(hoaDonRepository.save(any(HoaDon.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CheckoutResponse response = checkoutService.checkout("BOOK001", "letan1");

        assertThat(response).isNotNull();
        assertThat(response.bookingCode()).isEqualTo("BOOK001");
        assertThat(sampleBooking.getStatus()).isEqualTo(BookingStatus.DA_TRA_PHONG);
        assertThat(sampleRoom.getUsageStatus()).isEqualTo(UsageStatus.TRONG);
        assertThat(sampleRoom.getCleaningStatus()).isEqualTo(CleaningStatus.CHUA_DON);
        verify(hoaDonRepository, org.mockito.Mockito.atLeastOnce()).save(any(HoaDon.class));
    }

    @Test
    @DisplayName("Check-out thất bại khi chưa thanh toán đủ: ném ngoại lệ UnpaidBookingException")
    void checkout_whenUnpaid_shouldThrowUnpaidBookingException() {
        when(bookingRepository.findByBookingCode("BOOK001")).thenReturn(Optional.of(sampleBooking));
        sampleInvoice.setStatus(TrangThaiHoaDon.CHO_THANH_TOAN);
        when(hoaDonRepository.findByBookingId("b-01"))
                .thenReturn(Optional.of(sampleInvoice));

        assertThatThrownBy(() -> checkoutService.checkout("BOOK001", "letan1"))
                .isInstanceOf(UnpaidBookingException.class)
                .hasMessageContaining("chưa được thanh toán");

        verify(bookingRepository, never()).save(any());
        verify(roomRepository, never()).save(any());
    }

    @Test
    @DisplayName("Check-out thất bại khi mã đặt phòng không tồn tại: ném BookingNotFoundException")
    void checkout_whenNotFound_shouldThrowBookingNotFoundException() {
        when(bookingRepository.findByBookingCode("NOT_FOUND")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> checkoutService.checkout("NOT_FOUND", "letan1"))
                .isInstanceOf(BookingNotFoundException.class)
                .hasMessageContaining("Không tìm thấy");
    }

    @Test
    @DisplayName("Check-out thất bại khi phòng đã trả trước đó: ném InvalidBookingStateException")
    void checkout_whenAlreadyCheckedOut_shouldThrowInvalidBookingStateException() {
        sampleBooking.setStatus(BookingStatus.DA_TRA_PHONG);
        when(bookingRepository.findByBookingCode("BOOK001")).thenReturn(Optional.of(sampleBooking));

        assertThatThrownBy(() -> checkoutService.checkout("BOOK001", "letan1"))
                .isInstanceOf(InvalidBookingStateException.class)
                .hasMessageContaining("đã hoàn tất trả phòng");
    }

    @Test
    @DisplayName("Check-out thất bại khi chưa nhận phòng: ném InvalidBookingStateException")
    void checkout_whenNotCheckedIn_shouldThrowInvalidBookingStateException() {
        sampleBooking.setStatus(BookingStatus.DA_DAT);
        when(bookingRepository.findByBookingCode("BOOK001")).thenReturn(Optional.of(sampleBooking));

        assertThatThrownBy(() -> checkoutService.checkout("BOOK001", "letan1"))
                .isInstanceOf(InvalidBookingStateException.class)
                .hasMessageContaining("Chỉ có thể trả phòng cho đặt phòng đang ở");
    }

    // =========================================================================
    // Tests cho batchCheckout(bookingCodes, username) - Đi theo đoàn
    // =========================================================================

    @Test
    @DisplayName("Batch check-out thành công cho đoàn khách nhiều phòng")
    void batchCheckout_whenValidList_shouldProcessAll() {
        when(bookingRepository.findByBookingCode("BOOK001")).thenReturn(Optional.of(sampleBooking));
        sampleInvoice.setStatus(TrangThaiHoaDon.DA_THANH_TOAN);
        when(hoaDonRepository.findByBookingId("b-01"))
                .thenReturn(Optional.of(sampleInvoice));
        when(nhanVienRepository.findByTaiKhoan_TenDangNhap("letan1")).thenReturn(Optional.of(sampleStaff));
        when(bookingDetailRepository.findByBookingId("b-01")).thenReturn(List.of(sampleDetail));

        List<CheckoutResponse> responses = checkoutService.batchCheckout(List.of("BOOK001"), "letan1");

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).bookingCode()).isEqualTo("BOOK001");
        assertThat(responses.get(0).roomNumbers()).containsExactly("101");
    }

    @Test
    @DisplayName("Batch check-out danh sách rỗng -> Ném ngoại lệ IllegalArgumentException")
    void batchCheckout_whenEmptyList_shouldThrowIllegalArgumentException() {
        assertThatThrownBy(() -> checkoutService.batchCheckout(List.of(), "letan1"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Batch check-out thành công cập nhật trạng thái phòng và cần dọn dẹp")
    void batchCheckout_updatesRoomStatus() {
        // Arrange same mocks as batch checkout test
        when(bookingRepository.findByBookingCode("BOOK001")).thenReturn(Optional.of(sampleBooking));
        sampleInvoice.setStatus(TrangThaiHoaDon.DA_THANH_TOAN);
        when(hoaDonRepository.findByBookingId("b-01"))
                .thenReturn(Optional.of(sampleInvoice));
        when(nhanVienRepository.findByTaiKhoan_TenDangNhap("letan1")).thenReturn(Optional.of(sampleStaff));
        when(bookingDetailRepository.findByBookingId("b-01")).thenReturn(List.of(sampleDetail));

        // Act
        checkoutService.batchCheckout(List.of("BOOK001"), "letan1");

        // Assert room status updated to TRONG and CHUA_DON
        assertThat(sampleRoom.getUsageStatus()).isEqualTo(UsageStatus.TRONG);
        assertThat(sampleRoom.getCleaningStatus()).isEqualTo(CleaningStatus.CHUA_DON);
        verify(roomRepository).save(sampleRoom);
    }
}

