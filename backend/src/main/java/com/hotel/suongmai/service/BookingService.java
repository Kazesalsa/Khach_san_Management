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
import com.hotel.suongmai.exception.ApplicablePriceNotFoundException;
import com.hotel.suongmai.exception.RoomNotFoundException;
import com.hotel.suongmai.exception.RoomUnavailableException;
import com.hotel.suongmai.repository.BookingDetailRepository;
import com.hotel.suongmai.repository.BookingRepository;
import com.hotel.suongmai.repository.ChiTietGiaPhongRepository;
import com.hotel.suongmai.repository.KhachHangRepository;
import com.hotel.suongmai.repository.PriceListRepository;
import com.hotel.suongmai.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class BookingService {
    private static final BigDecimal DEPOSIT_RATE = new BigDecimal("0.30");
    private static final String ACTIVE_PRICE = "ACTIVE";

    private final BookingRepository bookingRepository;
    private final BookingDetailRepository bookingDetailRepository;
    private final ChiTietGiaPhongRepository roomPriceRepository;
    private final KhachHangRepository customerRepository;
    private final RoomRepository roomRepository;
    private final PriceListRepository priceListRepository;
    private final BookingCodeGenerator bookingCodeGenerator;

    @Transactional
    public CreateBookingResponse createBooking(CreateBookingRequest request) {
        validateDates(request.checkIn(), request.checkOut());

        Room room = roomRepository.findByIdForBooking(request.roomId())
                .orElseThrow(() -> new RoomNotFoundException(
                        "Không tìm thấy phòng với ID: " + request.roomId()));

        if (request.guestCount() > room.getRoomCategory().getMaxCapacity()) {
            throw new IllegalArgumentException("Số khách vượt quá sức chứa tối đa của phòng");
        }
        if (bookingDetailRepository.existsActiveBookingOverlap(
                room.getId(), request.checkIn(), request.checkOut())) {
            throw new RoomUnavailableException("Phòng đã được đặt trong khoảng ngày đã chọn");
        }

        List<NightlyPrice> nightlyPrices = resolveNightlyPrices(room, request.checkIn(), request.checkOut());
        BigDecimal estimatedTotal = nightlyPrices.stream()
                .map(nightlyPrice -> nightlyPrice.priceList().getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal requiredDeposit = estimatedTotal.multiply(DEPOSIT_RATE)
                .setScale(2, RoundingMode.HALF_UP);

        KhachHang customer = findOrCreateCustomer(request);

        Booking booking = new Booking();
        booking.setBookingCode(bookingCodeGenerator.generate());
        booking.setCustomer(customer);
        booking.setBookingChannel("WEBSITE");
        booking.setEstimatedTotal(estimatedTotal);
        booking.setRequiredDeposit(requiredDeposit);
        booking.setStatus(BookingStatus.CHO_XAC_NHAN);
        booking = bookingRepository.save(booking);

        BookingDetail detail = new BookingDetail();
        detail.setBooking(booking);
        detail.setRoom(room);
        detail.setExpectedCheckInDate(request.checkIn());
        detail.setExpectedCheckOutDate(request.checkOut());
        detail.setGuestCount(request.guestCount());
        detail.setStatus(BookingStatus.CHO_XAC_NHAN.name());
        detail = bookingDetailRepository.save(detail);

        BookingDetail savedDetail = detail;
        List<ChiTietGiaPhong> priceSnapshots = nightlyPrices.stream()
                .map(nightlyPrice -> new ChiTietGiaPhong(
                        savedDetail,
                        nightlyPrice.stayDate(),
                        nightlyPrice.priceList().getPrice(),
                        nightlyPrice.priceList().getId()))
                .toList();
        roomPriceRepository.saveAll(priceSnapshots);

        return new CreateBookingResponse(
                booking.getBookingCode(),
                booking.getStatus(),
                customer.getId(),
                customer.getHoTen(),
                customer.getSoDienThoai(),
                customer.getEmail(),
                room.getId(),
                room.getRoomNumber(),
                room.getRoomCategory().getName(),
                request.checkIn(),
                request.checkOut(),
                ChronoUnit.DAYS.between(request.checkIn(), request.checkOut()),
                request.guestCount(),
                estimatedTotal,
                requiredDeposit);
    }

    private KhachHang findOrCreateCustomer(CreateBookingRequest request) {
        String phone = normalizePhone(request.phone());
        return customerRepository.findBySoDienThoai(phone)
                .orElseGet(() -> {
                    KhachHang customer = new KhachHang();
                    customer.setHoTen(request.guestName().trim());
                    customer.setSoDienThoai(phone);
                    customer.setEmail(request.email().trim().toLowerCase(Locale.ROOT));
                    return customerRepository.save(customer);
                });
    }

    private List<NightlyPrice> resolveNightlyPrices(Room room, LocalDate checkIn, LocalDate checkOut) {
        List<NightlyPrice> nightlyPrices = new ArrayList<>();
        for (LocalDate stayDate = checkIn; stayDate.isBefore(checkOut); stayDate = stayDate.plusDays(1)) {
            LocalDate currentStayDate = stayDate;
            PriceList priceList = priceListRepository
                    .findFirstByRoomCategory_IdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatusOrderByStartDateDesc(
                            room.getRoomCategory().getId(),
                            currentStayDate.atStartOfDay(),
                            currentStayDate.atStartOfDay(),
                            ACTIVE_PRICE)
                    .orElseThrow(() -> new ApplicablePriceNotFoundException(
                            "Không có bảng giá hiện hành cho ngày " + currentStayDate));
            nightlyPrices.add(new NightlyPrice(currentStayDate, priceList));
        }
        return nightlyPrices;
    }

    private void validateDates(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null || !checkOut.isAfter(checkIn)) {
            throw new IllegalArgumentException("Ngày trả phòng phải sau ngày nhận phòng");
        }
    }

    private String normalizePhone(String rawPhone) {
        String digits = rawPhone.replaceAll("\\D", "");
        if (digits.startsWith("84") && digits.length() >= 10) {
            digits = "0" + digits.substring(2);
        }
        if (digits.length() < 9 || digits.length() > 15) {
            throw new IllegalArgumentException("Số điện thoại không hợp lệ");
        }
        return digits;
    }

    private record NightlyPrice(LocalDate stayDate, PriceList priceList) {
    }
}
