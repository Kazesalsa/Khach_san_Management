package com.hotel.suongmai.service;

import com.hotel.suongmai.dto.CreateBookingRequest;
import com.hotel.suongmai.dto.CreateBookingResponse;
import com.hotel.suongmai.entity.Booking;
import com.hotel.suongmai.entity.BookingDetail;
import com.hotel.suongmai.entity.BookingStatus;
import com.hotel.suongmai.entity.ChiTietGiaPhong;
import com.hotel.suongmai.entity.KhachHang;
import com.hotel.suongmai.entity.PriceList;
import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.entity.RoomCategory;
import com.hotel.suongmai.exception.ApplicablePriceNotFoundException;
import com.hotel.suongmai.exception.RoomUnavailableException;
import com.hotel.suongmai.repository.BookingDetailRepository;
import com.hotel.suongmai.repository.BookingRepository;
import com.hotel.suongmai.repository.ChiTietGiaPhongRepository;
import com.hotel.suongmai.repository.KhachHangRepository;
import com.hotel.suongmai.repository.PriceListRepository;
import com.hotel.suongmai.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {
    private static final LocalDate CHECK_IN = LocalDate.of(2026, 10, 20);
    private static final LocalDate CHECK_OUT = LocalDate.of(2026, 10, 22);

    @Mock BookingRepository bookingRepository;
    @Mock BookingDetailRepository bookingDetailRepository;
    @Mock ChiTietGiaPhongRepository roomPriceRepository;
    @Mock KhachHangRepository customerRepository;
    @Mock RoomRepository roomRepository;
    @Mock PriceListRepository priceListRepository;
    @Mock BookingCodeGenerator bookingCodeGenerator;

    @InjectMocks BookingService bookingService;

    private Room room;
    private CreateBookingRequest request;

    @BeforeEach
    void setUp() {
        RoomCategory category = new RoomCategory();
        category.setId("cat-1");
        category.setName("Standard");
        category.setMaxCapacity(3);

        room = new Room();
        room.setId("room-1");
        room.setRoomNumber("101");
        room.setRoomCategory(category);

        request = new CreateBookingRequest(
                "room-1", CHECK_IN, CHECK_OUT, 2,
                "Nguyễn Văn A", "0912 345 678", "A@example.com");
    }

    @Test
    void createsBookingCustomerAndPriceSnapshots() {
        stubAvailableRoom();
        when(customerRepository.findBySoDienThoai("0912345678")).thenReturn(Optional.empty());
        when(customerRepository.save(any(KhachHang.class))).thenAnswer(invocation -> {
            KhachHang customer = invocation.getArgument(0);
            customer.setId("customer-1");
            return customer;
        });
        when(bookingCodeGenerator.generate()).thenReturn("BK261013-A1B2C");
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(bookingDetailRepository.save(any(BookingDetail.class))).thenAnswer(invocation -> {
            BookingDetail detail = invocation.getArgument(0);
            detail.setId("detail-1");
            return detail;
        });
        when(priceListRepository
                .findFirstByRoomCategory_IdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatusOrderByStartDateDesc(
                        anyString(), any(LocalDateTime.class), any(LocalDateTime.class), anyString()))
                .thenReturn(Optional.of(price("price-1", "1000000")),
                        Optional.of(price("price-2", "1500000")));

        CreateBookingResponse response = bookingService.createBooking(request);

        assertThat(response.bookingCode()).isEqualTo("BK261013-A1B2C");
        assertThat(response.status()).isEqualTo(BookingStatus.CHO_XAC_NHAN);
        assertThat(response.phone()).isEqualTo("0912345678");
        assertThat(response.nights()).isEqualTo(2);
        assertThat(response.estimatedTotal()).isEqualByComparingTo("2500000.00");
        assertThat(response.requiredDeposit()).isEqualByComparingTo("750000.00");

        ArgumentCaptor<Booking> bookingCaptor = ArgumentCaptor.forClass(Booking.class);
        verify(bookingRepository).save(bookingCaptor.capture());
        assertThat(bookingCaptor.getValue().getStatus()).isEqualTo(BookingStatus.CHO_XAC_NHAN);

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ChiTietGiaPhong>> snapshots = ArgumentCaptor.forClass(List.class);
        verify(roomPriceRepository).saveAll(snapshots.capture());
        assertThat(snapshots.getValue())
                .extracting(ChiTietGiaPhong::getStayDate)
                .containsExactly(CHECK_IN, CHECK_IN.plusDays(1));
    }

    @Test
    void reusesExistingCustomerWithoutOverwritingProfile() {
        stubAvailableRoom();
        KhachHang existing = new KhachHang();
        existing.setId("customer-1");
        existing.setHoTen("Khách hàng hiện tại");
        existing.setSoDienThoai("0912345678");
        existing.setEmail("existing@example.com");
        when(customerRepository.findBySoDienThoai("0912345678")).thenReturn(Optional.of(existing));
        when(bookingCodeGenerator.generate()).thenReturn("BK261013-A1B2C");
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(bookingDetailRepository.save(any(BookingDetail.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(priceListRepository
                .findFirstByRoomCategory_IdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatusOrderByStartDateDesc(
                        anyString(), any(LocalDateTime.class), any(LocalDateTime.class), anyString()))
                .thenReturn(Optional.of(price("price-1", "1000000")));

        CreateBookingResponse response = bookingService.createBooking(request);

        assertThat(response.customerId()).isEqualTo("customer-1");
        assertThat(response.guestName()).isEqualTo("Khách hàng hiện tại");
        verify(customerRepository, never()).save(any());
    }

    @Test
    void rejectsOverlappingBooking() {
        when(roomRepository.findByIdForBooking("room-1")).thenReturn(Optional.of(room));
        when(bookingDetailRepository.existsActiveBookingOverlap("room-1", CHECK_IN, CHECK_OUT))
                .thenReturn(true);

        assertThatThrownBy(() -> bookingService.createBooking(request))
                .isInstanceOf(RoomUnavailableException.class);

        verify(bookingRepository, never()).save(any());
        verify(customerRepository, never()).save(any());
    }

    @Test
    void rejectsDateRangeWithoutApplicablePrice() {
        stubAvailableRoom();
        when(priceListRepository
                .findFirstByRoomCategory_IdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatusOrderByStartDateDesc(
                        anyString(), any(LocalDateTime.class), any(LocalDateTime.class), anyString()))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.createBooking(request))
                .isInstanceOf(ApplicablePriceNotFoundException.class)
                .hasMessageContaining(CHECK_IN.toString());

        verify(bookingRepository, never()).save(any());
    }

    @Test
    void rejectsGuestCountAboveRoomCapacity() {
        CreateBookingRequest tooManyGuests = new CreateBookingRequest(
                "room-1", CHECK_IN, CHECK_OUT, 4,
                "Nguyễn Văn A", "0912345678", "a@example.com");
        when(roomRepository.findByIdForBooking("room-1")).thenReturn(Optional.of(room));

        assertThatThrownBy(() -> bookingService.createBooking(tooManyGuests))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("sức chứa");

        verify(bookingDetailRepository, never()).existsActiveBookingOverlap(anyString(), any(), any());
    }

    private void stubAvailableRoom() {
        when(roomRepository.findByIdForBooking("room-1")).thenReturn(Optional.of(room));
        when(bookingDetailRepository.existsActiveBookingOverlap("room-1", CHECK_IN, CHECK_OUT))
                .thenReturn(false);
    }

    private PriceList price(String id, String amount) {
        PriceList priceList = new PriceList();
        priceList.setId(id);
        priceList.setPrice(new BigDecimal(amount));
        return priceList;
    }
}
