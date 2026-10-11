package com.hotel.suongmai.service;

import com.hotel.suongmai.dto.OccupiedRoomResponse;
import com.hotel.suongmai.entity.*;
import com.hotel.suongmai.repository.BookingDetailRepository;
import com.hotel.suongmai.repository.SuDungDichVuRepository;
import com.hotel.suongmai.repository.ThanhToanRepository;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CheckoutServiceTest {

    @Mock
    private BookingDetailRepository bookingDetailRepository;

    @Mock
    private ThanhToanRepository thanhToanRepository;

    @Mock
    private SuDungDichVuRepository suDungDichVuRepository;

    @InjectMocks
    private CheckoutService checkoutService;

    private Booking sampleBooking;
    private BookingDetail sampleDetail;

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

        Room room = new Room();
        room.setId("r-101");
        room.setRoomNumber("101");
        room.setFloor(1);
        room.setRoomCategory(category);

        sampleDetail = new BookingDetail();
        sampleDetail.setId("bd-01");
        sampleDetail.setBooking(sampleBooking);
        sampleDetail.setRoom(room);
        sampleDetail.setActualCheckInTime(LocalDateTime.of(2026, 10, 10, 14, 0));
        sampleDetail.setExpectedCheckOutDate(LocalDate.of(2026, 10, 13));
        sampleDetail.setGuestCount(2);
    }

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
        // Cần thu = 2.000.000, đã cọc = 1.000.000 -> Còn thiếu 1.000.000
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
}
