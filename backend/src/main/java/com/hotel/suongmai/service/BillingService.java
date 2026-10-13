package com.hotel.suongmai.service;

import com.hotel.suongmai.dto.*;
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
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final BookingRepository bookingRepository;
    private final BookingDetailRepository bookingDetailRepository;
    private final ChiTietGiaPhongRepository chiTietGiaPhongRepository;
    private final SuDungDichVuRepository suDungDichVuRepository;
    private final ThanhToanRepository thanhToanRepository;
    private final HoaDonRepository hoaDonRepository;
    private final NhanVienRepository nhanVienRepository;

    @Transactional(readOnly = true)
    public InvoicePreviewResponse previewInvoice(String bookingCode) {
        Booking booking = getBooking(bookingCode);

        validateBookingCanBeBilled(booking);

        InvoiceCalculation calculation = calculateInvoice(booking);

        return new InvoicePreviewResponse(
                bookingCode,
                calculation.roomFee(),
                calculation.serviceFee(),
                calculation.subtotal(),
                calculation.deposit(),
                calculation.remaining(),
                calculation.roomCharges(),
                calculation.serviceCharges()
        );
    }

    @Transactional
    public InvoicePaymentResponse payInvoice(
            String bookingCode,
            PayInvoiceRequest request,
            String username
    ) {
        Booking booking = getBooking(bookingCode);

        validateBookingCanBeBilled(booking);

        /*
         * Nếu booking đã thanh toán trước đó thì trả lại kết quả cũ.
         * Điều này giúp API an toàn khi frontend gửi request hai lần.
         */
        var existingInvoice = hoaDonRepository.findByBookingId(booking.getId());

        if (existingInvoice.isPresent()) {
            HoaDon invoice = existingInvoice.get();

            if (invoice.getStatus() == TrangThaiHoaDon.DA_THANH_TOAN || invoice.getStatus() == TrangThaiHoaDon.DA_CHOT) {
               ThanhToan payment = thanhToanRepository
                        .findFirstByInvoiceIdAndTransactionTypeAndStatusOrderByTransactionTimeDesc(
                                invoice.getId(),
                                LoaiGiaoDich.THANH_TOAN_HOA_DON,
                                TrangThaiThanhToan.THANH_CONG
                        )
                        .orElse(null);

               return new InvoicePaymentResponse(
                    bookingCode,
                    invoice.getInvoiceNumber(),
                    invoice.getRoomFee(),
                    invoice.getServiceFee(),
                    invoice.getTotalAmount(),
                    invoice.getDeductedDeposit(),
                    payment != null ? payment.getAmount() : BigDecimal.ZERO,
                    invoice.getRemainingAmount(),
                    payment != null ? payment.getPaymentMethod() : request.paymentMethod(),
                    invoice.getStatus(),
                    "Hóa đơn đã được thanh toán trước đó"
               );
            }
        }

        NhanVien cashier = nhanVienRepository
                .findByTaiKhoan_TenDangNhap(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên thu tiền"));

        InvoiceCalculation calculation = calculateInvoice(booking);

        HoaDon invoice = new HoaDon();
        invoice.setInvoiceNumber(generateUniqueInvoiceNumber());
        invoice.setBooking(booking);
        invoice.setRoomFee(calculation.roomFee());
        invoice.setServiceFee(calculation.serviceFee());
        invoice.setDeductedDeposit(calculation.deposit());
        invoice.setTotalAmount(calculation.subtotal());
        invoice.setRemainingAmount(BigDecimal.ZERO);
        invoice.setStatus(TrangThaiHoaDon.DA_THANH_TOAN);

        invoice = hoaDonRepository.save(invoice);

        BigDecimal remainingToPay = calculation.remaining().max(BigDecimal.ZERO);
        if (remainingToPay.compareTo(BigDecimal.ZERO) > 0) {
            ThanhToan payment = new ThanhToan();
            payment.setTransactionType(LoaiGiaoDich.THANH_TOAN_HOA_DON);
            payment.setAmount(remainingToPay);
            payment.setPaymentMethod(request.paymentMethod());
            payment.setStatus(TrangThaiThanhToan.THANH_CONG);
            payment.setReferenceCode(generatePaymentReference());
            payment.setBooking(booking);
            payment.setInvoice(invoice);
            payment.setCashierStaff(cashier);

            thanhToanRepository.save(payment);
        }

        return new InvoicePaymentResponse(
                bookingCode,
                invoice.getInvoiceNumber(),
                invoice.getRoomFee(),
                invoice.getServiceFee(),
                invoice.getTotalAmount(),
                invoice.getDeductedDeposit(),
                remainingToPay,
                invoice.getRemainingAmount(),
                request.paymentMethod(),
                invoice.getStatus(),
                "Thanh toán hóa đơn thành công"
        );
    }

    private InvoiceCalculation calculateInvoice(Booking booking) {
        List<BookingDetail> details = bookingDetailRepository.findByBookingId(booking.getId());

        if (details.isEmpty()) {
            throw new IllegalStateException("Đặt phòng chưa có chi tiết đặt phòng");
        }

        List<RoomChargeResponse> roomCharges = calculateRoomCharges(details);

        List<ServiceChargeResponse> serviceCharges = calculateServiceCharges(booking.getId());

        BigDecimal roomFee = roomCharges
                .stream()
                .map(RoomChargeResponse::amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal serviceFee = serviceCharges
                .stream()
                .map(ServiceChargeResponse::amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal subtotal = roomFee.add(serviceFee);

        BigDecimal deposit = valueOrZero(
                thanhToanRepository.sumSuccessfulDepositByBookingId(booking.getId())
        );

        BigDecimal remaining = subtotal
                .subtract(deposit)
                .max(BigDecimal.ZERO);

        return new InvoiceCalculation(
                roomFee,
                serviceFee,
                subtotal,
                deposit,
                remaining,
                roomCharges,
                serviceCharges
        );
    }

    private List<RoomChargeResponse> calculateRoomCharges(List<BookingDetail> details) {
        List<RoomChargeResponse> result = new ArrayList<>();

        for (BookingDetail detail : details) {
            List<ChiTietGiaPhong> prices = chiTietGiaPhongRepository
                    .findByBookingDetailIdOrderByStayDate(detail.getId());

            if (prices.isEmpty()) {
                throw new IllegalStateException("Không tìm thấy bảng giá cho phòng " + detail.getRoom().getRoomNumber());
            }

            for (ChiTietGiaPhong price : prices) {
                BigDecimal unitPrice = valueOrZero(price.getPrice());
                BigDecimal amount = unitPrice;

                result.add(new RoomChargeResponse(
                        detail.getRoom().getRoomNumber(),
                        price.getStayDate(),
                        unitPrice,
                        amount
                ));
            }
        }

        return result;
    }

    private List<ServiceChargeResponse> calculateServiceCharges(
            String bookingId
    ) {
        return suDungDichVuRepository
                .findByBookingId(bookingId)
                .stream()
                .map(serviceUsage -> {
                    BigDecimal quantity = valueOrZero(serviceUsage.getSoLuong());

                    BigDecimal unitPrice = valueOrZero(serviceUsage.getDonGiaApDung());

                    BigDecimal amount = quantity.multiply(unitPrice);

                    return new ServiceChargeResponse(
                            serviceUsage.getDichVu().getTen(),
                            quantity,
                            unitPrice,
                            amount
                    );
                })
                .toList();
    }

    private Booking getBooking(String bookingCode) {
        return bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new BookingNotFoundException("Không tìm thấy đặt phòng với mã " + bookingCode));
    }

    private void validateBookingCanBeBilled(Booking booking) {
        if (booking.getStatus() == BookingStatus.DA_TRA_PHONG) {
            throw new InvalidBookingStateException("Đặt phòng đã hoàn tất trả phòng");
        }

        if (booking.getStatus() != BookingStatus.DA_NHAN) {
            throw new InvalidBookingStateException("Chỉ lập hóa đơn cho khách đang lưu trú");
        }
    }

    private String generateUniqueInvoiceNumber() {
        String invoiceNumber;

        do {
            String randomPart = UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 18);

            invoiceNumber = "HD" + randomPart;
        } while (hoaDonRepository.existsByInvoiceNumber(invoiceNumber));

        return invoiceNumber;
    }

    private String generatePaymentReference() {
        return "PAY-" + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 28);
    }

    private BigDecimal valueOrZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private record InvoiceCalculation(
            BigDecimal roomFee,
            BigDecimal serviceFee,
            BigDecimal subtotal,
            BigDecimal deposit,
            BigDecimal remaining,
            List<RoomChargeResponse> roomCharges,
            List<ServiceChargeResponse> serviceCharges
    ) {
    }
}