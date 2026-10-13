package com.hotel.suongmai.service;

import com.hotel.suongmai.dto.InvoicePreviewResponse;
import com.hotel.suongmai.dto.RoomChargeResponse;
import com.hotel.suongmai.dto.ServiceChargeResponse;
import com.hotel.suongmai.entity.*;
import com.hotel.suongmai.exception.BookingNotFoundException;
import com.hotel.suongmai.exception.InvalidBookingStateException;
import com.hotel.suongmai.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillingService {
    private final BookingRepository bookingRepository;
    private final BookingDetailRepository bookingDetailRepository;
    private final ChiTietGiaPhongRepository chiTietGiaPhongRepository;
    private final SuDungDichVuRepository suDungDichVuRepository;
    private final ThanhToanRepository thanhToanRepository;

    @Transactional(readOnly = true)
    public InvoicePreviewResponse previewInvoice(String bookingCode) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(()-> new BookingNotFoundException("Không tìm thấy đặt phòng với mã " + bookingCode));

        validateBookingCanBeBilled(booking);

        List<BookingDetail> details = bookingDetailRepository.findByBookingId(booking.getId());

        if (details.isEmpty()) {
            throw new IllegalStateException("Đặt phòng chưa có chi tiết đặt phòng");
        }

        List<RoomChargeResponse> roomCharges = calculateRoomCharges(details);

        List<ServiceChargeResponse> serviceCharges = calculateServiceCharges(booking.getId());

        BigDecimal roomFee = roomCharges.stream()
                .map(RoomChargeResponse::amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal serviceFee = serviceCharges.stream()
                .map(ServiceChargeResponse::amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal subtotal = roomFee.add(serviceFee);

        BigDecimal depositDeducted = valueOrZero(thanhToanRepository.sumSuccessfulDepositByBookingId(booking.getId()));

        BigDecimal remainingAmount = subtotal.subtract(depositDeducted).max(BigDecimal.ZERO);

        return new InvoicePreviewResponse(
                bookingCode,
                roomFee,
                serviceFee,
                subtotal,
                depositDeducted,
                remainingAmount,
                roomCharges,
                serviceCharges
        );
    }


    private List<ServiceChargeResponse> calculateServiceCharges(String id) {
        List<ServiceChargeResponse> result = suDungDichVuRepository.findByBookingId(id)
                .stream()
                .map(this::toServiceChargeResponse)
                .toList();

        return result;
    }

    private List<RoomChargeResponse> calculateRoomCharges(List<BookingDetail> details) {
        List<RoomChargeResponse> result = new ArrayList<>();

        for (BookingDetail detail : details) {
            List<ChiTietGiaPhong> prices = chiTietGiaPhongRepository.findByBookingDetailIdOrderByStayDate(detail.getId());

            if (prices.isEmpty()) {
                throw new IllegalStateException("Không tìm thấy bảng giá cho phòng " + detail.getRoom().getRoomNumber());
            }

            for (ChiTietGiaPhong price : prices) {
                BigDecimal amount = valueOrZero(price.getPrice());

                result.add(new RoomChargeResponse(
                        detail.getRoom().getRoomNumber(),
                        price.getStayDate(),
                        amount,
                        amount
                ));
            }
        }
        return result;
    }

    private ServiceChargeResponse toServiceChargeResponse(SuDungDichVu serviceUsage) {
        BigDecimal quantity = valueOrZero(serviceUsage.getSoLuong());
        BigDecimal unitPrice = valueOrZero(serviceUsage.getDonGiaApDung());
        BigDecimal amount = quantity.multiply(unitPrice);
        return new ServiceChargeResponse(
                serviceUsage.getDichVu().getTen(),
                quantity,
                unitPrice,
                amount
        );
    }

    private void validateBookingCanBeBilled(Booking booking) {
        if (booking.getStatus() == BookingStatus.DA_TRA_PHONG) {
            throw new InvalidBookingStateException("Đặt phòng đã hoàn tất trả phòng");
        }

        if (booking.getStatus() != BookingStatus.DA_NHAN) {
            throw new InvalidBookingStateException("Chỉ tính hóa đơn cho khách đang lưu trú");
        }
    }

    private BigDecimal valueOrZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}