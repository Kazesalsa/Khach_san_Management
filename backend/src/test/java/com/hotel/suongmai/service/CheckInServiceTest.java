package com.hotel.suongmai.service;

import com.hotel.suongmai.dto.CheckInResponse;
import com.hotel.suongmai.dto.PendingCheckInBookingResponse;
import com.hotel.suongmai.entity.Booking;
import com.hotel.suongmai.entity.BookingDetail;
import com.hotel.suongmai.entity.BookingStatus;
import com.hotel.suongmai.entity.CleaningStatus;
import com.hotel.suongmai.entity.KhachHang;
import com.hotel.suongmai.entity.NhanVien;
import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.entity.RoomCategory;
import com.hotel.suongmai.entity.UsageStatus;
import com.hotel.suongmai.exception.BookingNotFoundException;
import com.hotel.suongmai.exception.InvalidBookingStateException;
import com.hotel.suongmai.exception.ReceptionistNotFoundException;
import com.hotel.suongmai.exception.RoomNotReadyException;
import com.hotel.suongmai.repository.BookingDetailRepository;
import com.hotel.suongmai.repository.BookingRepository;
import com.hotel.suongmai.repository.NhanVienRepository;
import com.hotel.suongmai.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CheckInServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BookingDetailRepository bookingDetailRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private NhanVienRepository nhanVienRepository;

    @InjectMocks
    private CheckInService checkInService;

    private Booking booking;
    private BookingDetail detail;
    private Room room;
    private NhanVien receptionist;

    @BeforeEach
    void setUp() {
        booking = new Booking();
        booking.setId("booking-id");
        booking.setBookingCode("DP001");
        booking.setStatus(BookingStatus.DA_DAT);

        room = new Room();
        room.setId("room-id");
        room.setRoomNumber("101");
        room.setUsageStatus(UsageStatus.DA_DAT);
        room.setCleaningStatus(CleaningStatus.DA_DON_XONG);

        detail = new BookingDetail();
        detail.setId("detail-id");
        detail.setBooking(booking);
        detail.setRoom(room);
        detail.setStatus(BookingStatus.DA_DAT.name());

        receptionist = new NhanVien();
        receptionist.setId("staff-id");
        receptionist.setHoNv("Nguyễn");
        receptionist.setTenNv("Lan");
    }

    @Test
    void getPendingBookingsGroupsMultipleRoomsOfTheSameBooking() {
        KhachHang customer = new KhachHang();
        customer.setHoTen("Nguyễn Văn An");
        customer.setSoDienThoai("0912345678");
        customer.setEmail("an@example.com");
        booking.setCustomer(customer);
        booking.setEstimatedTotal(new BigDecimal("2400000"));
        booking.setRequiredDeposit(new BigDecimal("720000"));

        RoomCategory category = new RoomCategory();
        category.setName("Deluxe");
        room.setFloor(1);
        room.setRoomCategory(category);

        LocalDate checkIn = LocalDate.of(2026, 10, 20);
        LocalDate checkOut = LocalDate.of(2026, 10, 22);
        detail.setGuestCount(2);
        detail.setExpectedCheckInDate(checkIn);
        detail.setExpectedCheckOutDate(checkOut);

        Room secondRoom = new Room();
        secondRoom.setId("room-2");
        secondRoom.setRoomNumber("102");
        secondRoom.setFloor(1);
        secondRoom.setRoomCategory(category);
        secondRoom.setUsageStatus(UsageStatus.DA_DAT);
        secondRoom.setCleaningStatus(CleaningStatus.DANG_DON);

        BookingDetail secondDetail = new BookingDetail();
        secondDetail.setId("detail-2");
        secondDetail.setBooking(booking);
        secondDetail.setRoom(secondRoom);
        secondDetail.setGuestCount(3);
        secondDetail.setExpectedCheckInDate(checkIn);
        secondDetail.setExpectedCheckOutDate(checkOut.plusDays(1));

        when(bookingDetailRepository.findPendingCheckIns(BookingStatus.DA_DAT, "", ""))
                .thenReturn(List.of(detail, secondDetail));

        List<PendingCheckInBookingResponse> result = checkInService.getPendingBookings(null);

        assertThat(result).singleElement().satisfies(response -> {
            assertThat(response.bookingCode()).isEqualTo("DP001");
            assertThat(response.guestName()).isEqualTo("Nguyễn Văn An");
            assertThat(response.phone()).isEqualTo("0912345678");
            assertThat(response.bookingStatus()).isEqualTo(BookingStatus.DA_DAT);
            assertThat(response.rooms()).hasSize(2);
            assertThat(response.rooms().get(0).roomNumber()).isEqualTo("101");
            assertThat(response.rooms().get(0).nights()).isEqualTo(2);
            assertThat(response.rooms().get(1).roomNumber()).isEqualTo("102");
            assertThat(response.rooms().get(1).nights()).isEqualTo(3);
            assertThat(response.rooms().get(1).cleaningStatus())
                    .isEqualTo(CleaningStatus.DANG_DON);
        });
    }

    @Test
    void getPendingBookingsNormalizesPhoneSearch() {
        when(bookingDetailRepository.findPendingCheckIns(
                BookingStatus.DA_DAT, "0912-345-678", "0912345678"))
                .thenReturn(List.of());

        assertThat(checkInService.getPendingBookings(" 0912-345-678 ")).isEmpty();

        verify(bookingDetailRepository).findPendingCheckIns(
                BookingStatus.DA_DAT, "0912-345-678", "0912345678");
    }

    @Test
    void getPendingBookingsDoesNotTreatBookingCodeAsPhone() {
        when(bookingDetailRepository.findPendingCheckIns(
                BookingStatus.DA_DAT, "DP001", ""))
                .thenReturn(List.of());

        assertThat(checkInService.getPendingBookings(" dp001 ")).isEmpty();

        verify(bookingDetailRepository).findPendingCheckIns(
                BookingStatus.DA_DAT, "DP001", "");
    }

    @Test
    void checkInUpdatesBookingRoomDetailAndReceptionist() {
        when(bookingRepository.findByBookingCode("DP001")).thenReturn(Optional.of(booking));
        when(bookingDetailRepository.findByBookingId("booking-id")).thenReturn(List.of(detail));
        when(nhanVienRepository.findByTaiKhoan_TenDangNhap("letan1"))
                .thenReturn(Optional.of(receptionist));

        CheckInResponse response = checkInService.checkIn("DP001", "letan1");

        assertThat(booking.getStatus()).isEqualTo(BookingStatus.DA_NHAN);
        assertThat(room.getUsageStatus()).isEqualTo(UsageStatus.DANG_O);
        assertThat(detail.getStatus()).isEqualTo("DA_NHAN");
        assertThat(detail.getActualCheckInTime()).isNotNull();
        assertThat(detail.getCheckInStaff()).isSameAs(receptionist);

        assertThat(response.bookingCode()).isEqualTo("DP001");
        assertThat(response.roomNumbers()).containsExactly("101");
        assertThat(response.receptionistId()).isEqualTo("staff-id");
        assertThat(response.receptionistName()).isEqualTo("Nguyễn Lan");
        assertThat(response.bookingStatus()).isEqualTo("DA_NHAN");
        assertThat(response.roomStatus()).isEqualTo("DANG_O");
        assertThat(response.checkInTime()).isEqualTo(detail.getActualCheckInTime());

        verify(bookingRepository).save(booking);
        verify(bookingDetailRepository).save(detail);
        verify(roomRepository).save(room);
    }

    @Test
    void checkInRejectsUnknownBookingCode() {
        when(bookingRepository.findByBookingCode("UNKNOWN")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> checkInService.checkIn("UNKNOWN", "letan1"))
                .isInstanceOf(BookingNotFoundException.class);
    }

    @Test
    void checkInRejectsBookingThatIsNotReserved() {
        booking.setStatus(BookingStatus.DA_NHAN);
        when(bookingRepository.findByBookingCode("DP001")).thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> checkInService.checkIn("DP001", "letan1"))
                .isInstanceOf(InvalidBookingStateException.class);

        verify(bookingRepository, never()).save(booking);
    }

    @Test
    void checkInRejectsBookingWithoutRooms() {
        when(bookingRepository.findByBookingCode("DP001")).thenReturn(Optional.of(booking));
        when(bookingDetailRepository.findByBookingId("booking-id")).thenReturn(List.of());

        assertThatThrownBy(() -> checkInService.checkIn("DP001", "letan1"))
                .isInstanceOf(InvalidBookingStateException.class);
    }

    @Test
    void checkInRejectsRoomThatHasNotBeenCleaned() {
        room.setCleaningStatus(CleaningStatus.DANG_DON);
        when(bookingRepository.findByBookingCode("DP001")).thenReturn(Optional.of(booking));
        when(bookingDetailRepository.findByBookingId("booking-id")).thenReturn(List.of(detail));

        assertThatThrownBy(() -> checkInService.checkIn("DP001", "letan1"))
                .isInstanceOf(RoomNotReadyException.class)
                .hasMessage("Phòng chưa sẵn sàng để nhận khách");

        verify(bookingRepository, never()).save(booking);
        verify(bookingDetailRepository, never()).save(detail);
        verify(roomRepository, never()).save(room);
    }

    @Test
    void checkInValidatesAllRoomsBeforeChangingAnyState() {
        Room uncleanRoom = new Room();
        uncleanRoom.setRoomNumber("102");
        uncleanRoom.setCleaningStatus(CleaningStatus.CHUA_DON);

        BookingDetail uncleanDetail = new BookingDetail();
        uncleanDetail.setBooking(booking);
        uncleanDetail.setRoom(uncleanRoom);

        when(bookingRepository.findByBookingCode("DP001")).thenReturn(Optional.of(booking));
        when(bookingDetailRepository.findByBookingId("booking-id"))
                .thenReturn(List.of(detail, uncleanDetail));

        assertThatThrownBy(() -> checkInService.checkIn("DP001", "letan1"))
                .isInstanceOf(RoomNotReadyException.class)
                .hasMessage("Phòng chưa sẵn sàng để nhận khách");

        assertThat(booking.getStatus()).isEqualTo(BookingStatus.DA_DAT);
        assertThat(room.getUsageStatus()).isEqualTo(UsageStatus.DA_DAT);
    }

    @Test
    void checkInRequiresReceptionistProfile() {
        when(bookingRepository.findByBookingCode("DP001")).thenReturn(Optional.of(booking));
        when(bookingDetailRepository.findByBookingId("booking-id")).thenReturn(List.of(detail));
        when(nhanVienRepository.findByTaiKhoan_TenDangNhap("letan1"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> checkInService.checkIn("DP001", "letan1"))
                .isInstanceOf(ReceptionistNotFoundException.class);

        verify(bookingRepository, never()).save(booking);
    }
}
