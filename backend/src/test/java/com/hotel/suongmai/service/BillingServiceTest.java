package com.hotel.suongmai.service;

import com.hotel.suongmai.dto.InvoicePreviewResponse;
import com.hotel.suongmai.dto.RoomChargeResponse;
import com.hotel.suongmai.dto.ServiceChargeResponse;
import com.hotel.suongmai.entity.Booking;
import com.hotel.suongmai.entity.BookingDetail;
import com.hotel.suongmai.entity.BookingStatus;
import com.hotel.suongmai.entity.ChiTietGiaPhong;
import com.hotel.suongmai.entity.DichVu;
import com.hotel.suongmai.entity.Room;
import com.hotel.suongmai.entity.SuDungDichVu;
import com.hotel.suongmai.exception.BookingNotFoundException;
import com.hotel.suongmai.exception.InvalidBookingStateException;
import com.hotel.suongmai.repository.BookingDetailRepository;
import com.hotel.suongmai.repository.BookingRepository;
import com.hotel.suongmai.repository.ChiTietGiaPhongRepository;
import com.hotel.suongmai.repository.SuDungDichVuRepository;
import com.hotel.suongmai.repository.ThanhToanRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BillingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BookingDetailRepository bookingDetailRepository;

    @Mock
    private ChiTietGiaPhongRepository chiTietGiaPhongRepository;

    @Mock
    private SuDungDichVuRepository suDungDichVuRepository;

    @Mock
    private ThanhToanRepository thanhToanRepository;

    @InjectMocks
    private BillingService billingService;

    @Test
    void previewInvoice_calculatesRoomServiceDepositAndRemainingAmount() {
        Booking booking = booking("booking-1", "BOOK-001", BookingStatus.DA_NHAN);
        BookingDetail detail = bookingDetail("detail-1", booking, "101");

        ChiTietGiaPhong firstNight = roomPrice(
                detail, LocalDate.of(2026, 10, 10), "500000", "price-1");
        ChiTietGiaPhong secondNight = roomPrice(
                detail, LocalDate.of(2026, 10, 11), "700000", "price-2");

        DichVu breakfast = new DichVu();
        breakfast.setTen("Bữa sáng");

        SuDungDichVu serviceUsage = new SuDungDichVu();
        serviceUsage.setDichVu(breakfast);
        serviceUsage.setSoLuong(new BigDecimal("2"));
        serviceUsage.setDonGiaApDung(new BigDecimal("150000"));

        when(bookingRepository.findByBookingCode("BOOK-001"))
                .thenReturn(Optional.of(booking));
        when(bookingDetailRepository.findByBookingId("booking-1"))
                .thenReturn(List.of(detail));
        when(chiTietGiaPhongRepository.findByBookingDetailIdOrderByStayDate("detail-1"))
                .thenReturn(List.of(firstNight, secondNight));
        when(suDungDichVuRepository.findByBookingId("booking-1"))
                .thenReturn(List.of(serviceUsage));
        when(thanhToanRepository.sumPaidByBooking("booking-1"))
                .thenReturn(new BigDecimal("200000"));

        InvoicePreviewResponse response = billingService.previewInvoice("BOOK-001");

        assertThat(response.bookingCode()).isEqualTo("BOOK-001");
        assertThat(response.roomFee()).isEqualByComparingTo("1200000");
        assertThat(response.serviceFee()).isEqualByComparingTo("300000");
        assertThat(response.subtotal()).isEqualByComparingTo("1500000");
        assertThat(response.depositDeducted()).isEqualByComparingTo("200000");
        assertThat(response.remainingAmount()).isEqualByComparingTo("1300000");

        assertThat(response.roomCharges()).hasSize(2);
        assertThat(response.roomCharges())
                .extracting(RoomChargeResponse::amount)
                .containsExactly(new BigDecimal("500000"), new BigDecimal("700000"));

        assertThat(response.serviceCharges()).singleElement().satisfies(charge -> {
            assertThat(charge.serviceName()).isEqualTo("Bữa sáng");
            assertThat(charge.quantity()).isEqualByComparingTo("2");
            assertThat(charge.unitPrice()).isEqualByComparingTo("150000");
            assertThat(charge.amount()).isEqualByComparingTo("300000");
        });
    }

    @Test
    void previewInvoice_normalizesNullAmountsToZero() {
        Booking booking = booking("booking-1", "BOOK-001", BookingStatus.DA_NHAN);
        BookingDetail detail = bookingDetail("detail-1", booking, "101");
        ChiTietGiaPhong priceWithoutAmount = roomPrice(
                detail, LocalDate.of(2026, 10, 10), null, "price-1");

        DichVu minibar = new DichVu();
        minibar.setTen("Minibar");

        SuDungDichVu usageWithoutAmount = new SuDungDichVu();
        usageWithoutAmount.setDichVu(minibar);
        usageWithoutAmount.setSoLuong(null);
        usageWithoutAmount.setDonGiaApDung(new BigDecimal("100000"));

        stubBookingWithDetail(booking, detail);
        when(chiTietGiaPhongRepository.findByBookingDetailIdOrderByStayDate("detail-1"))
                .thenReturn(List.of(priceWithoutAmount));
        when(suDungDichVuRepository.findByBookingId("booking-1"))
                .thenReturn(List.of(usageWithoutAmount));
        when(thanhToanRepository.sumPaidByBooking("booking-1"))
                .thenReturn(null);

        InvoicePreviewResponse response = billingService.previewInvoice("BOOK-001");

        assertThat(response.roomFee()).isEqualByComparingTo("0");
        assertThat(response.serviceFee()).isEqualByComparingTo("0");
        assertThat(response.subtotal()).isEqualByComparingTo("0");
        assertThat(response.depositDeducted()).isEqualByComparingTo("0");
        assertThat(response.remainingAmount()).isEqualByComparingTo("0");
        assertThat(response.roomCharges()).singleElement()
                .extracting(RoomChargeResponse::amount)
                .isEqualTo(new BigDecimal("0"));
        assertThat(response.serviceCharges()).singleElement()
                .extracting(ServiceChargeResponse::amount)
                .isEqualTo(new BigDecimal("0"));
    }

    @Test
    void previewInvoice_doesNotReturnNegativeRemainingAmountWhenDepositExceedsSubtotal() {
        Booking booking = booking("booking-1", "BOOK-001", BookingStatus.DA_NHAN);
        BookingDetail detail = bookingDetail("detail-1", booking, "101");

        stubBookingWithDetail(booking, detail);
        when(chiTietGiaPhongRepository.findByBookingDetailIdOrderByStayDate("detail-1"))
                .thenReturn(List.of(roomPrice(
                        detail, LocalDate.of(2026, 10, 10), "500000", "price-1")));
        when(suDungDichVuRepository.findByBookingId("booking-1"))
                .thenReturn(List.of());
        when(thanhToanRepository.sumPaidByBooking("booking-1"))
                .thenReturn(new BigDecimal("800000"));

        InvoicePreviewResponse response = billingService.previewInvoice("BOOK-001");

        assertThat(response.subtotal()).isEqualByComparingTo("500000");
        assertThat(response.depositDeducted()).isEqualByComparingTo("800000");
        assertThat(response.remainingAmount()).isEqualByComparingTo("0");
    }

    @Test
    void previewInvoice_throwsWhenBookingDoesNotExist() {
        when(bookingRepository.findByBookingCode("UNKNOWN"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> billingService.previewInvoice("UNKNOWN"))
                .isInstanceOf(BookingNotFoundException.class)
                .hasMessageContaining("UNKNOWN");

        verifyNoInteractions(
                bookingDetailRepository,
                chiTietGiaPhongRepository,
                suDungDichVuRepository,
                thanhToanRepository);
    }

    @Test
    void previewInvoice_throwsWhenBookingIsNotCurrentlyStaying() {
        Booking booking = booking("booking-1", "BOOK-001", BookingStatus.DA_DAT);
        when(bookingRepository.findByBookingCode("BOOK-001"))
                .thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> billingService.previewInvoice("BOOK-001"))
                .isInstanceOf(InvalidBookingStateException.class)
                .hasMessageContaining("đang lưu trú");

        verifyNoInteractions(
                bookingDetailRepository,
                chiTietGiaPhongRepository,
                suDungDichVuRepository,
                thanhToanRepository);
    }

    @Test
    void previewInvoice_throwsWhenBookingWasAlreadyCheckedOut() {
        Booking booking = booking("booking-1", "BOOK-001", BookingStatus.DA_TRA_PHONG);
        when(bookingRepository.findByBookingCode("BOOK-001"))
                .thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> billingService.previewInvoice("BOOK-001"))
                .isInstanceOf(InvalidBookingStateException.class)
                .hasMessageContaining("hoàn tất trả phòng");

        verifyNoInteractions(
                bookingDetailRepository,
                chiTietGiaPhongRepository,
                suDungDichVuRepository,
                thanhToanRepository);
    }

    @Test
    void previewInvoice_throwsWhenBookingHasNoDetails() {
        Booking booking = booking("booking-1", "BOOK-001", BookingStatus.DA_NHAN);
        when(bookingRepository.findByBookingCode("BOOK-001"))
                .thenReturn(Optional.of(booking));
        when(bookingDetailRepository.findByBookingId("booking-1"))
                .thenReturn(List.of());

        assertThatThrownBy(() -> billingService.previewInvoice("BOOK-001"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("chi tiết đặt phòng");

        verifyNoInteractions(
                chiTietGiaPhongRepository,
                suDungDichVuRepository,
                thanhToanRepository);
    }

    @Test
    void previewInvoice_throwsWhenRoomHasNoPriceDetails() {
        Booking booking = booking("booking-1", "BOOK-001", BookingStatus.DA_NHAN);
        BookingDetail detail = bookingDetail("detail-1", booking, "101");

        stubBookingWithDetail(booking, detail);
        when(chiTietGiaPhongRepository.findByBookingDetailIdOrderByStayDate("detail-1"))
                .thenReturn(List.of());

        assertThatThrownBy(() -> billingService.previewInvoice("BOOK-001"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("101");

        verifyNoInteractions(suDungDichVuRepository, thanhToanRepository);
    }

    private void stubBookingWithDetail(Booking booking, BookingDetail detail) {
        when(bookingRepository.findByBookingCode(booking.getBookingCode()))
                .thenReturn(Optional.of(booking));
        when(bookingDetailRepository.findByBookingId(booking.getId()))
                .thenReturn(List.of(detail));
    }

    private Booking booking(String id, String bookingCode, BookingStatus status) {
        Booking booking = new Booking();
        booking.setId(id);
        booking.setBookingCode(bookingCode);
        booking.setStatus(status);
        return booking;
    }

    private BookingDetail bookingDetail(String id, Booking booking, String roomNumber) {
        Room room = new Room();
        room.setRoomNumber(roomNumber);

        BookingDetail detail = new BookingDetail();
        detail.setId(id);
        detail.setBooking(booking);
        detail.setRoom(room);
        return detail;
    }

    private ChiTietGiaPhong roomPrice(
            BookingDetail detail,
            LocalDate stayDate,
            String price,
            String priceTableId) {
        return new ChiTietGiaPhong(
                detail,
                stayDate,
                price == null ? null : new BigDecimal(price),
                priceTableId);
    }
}
