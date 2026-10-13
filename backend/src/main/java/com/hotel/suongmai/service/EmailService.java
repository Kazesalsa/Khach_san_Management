package com.hotel.suongmai.service;

import com.hotel.suongmai.entity.Booking;
import com.hotel.suongmai.entity.BookingDetail;
import com.hotel.suongmai.repository.BookingDetailRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final BookingDetailRepository bookingDetailRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Gửi email xác nhận đặt phòng thành công sau khi thanh toán cọc PayOS
     * Chạy bất đồng bộ ngầm để không làm chậm luồng xử lý thanh toán
     */
    public void sendBookingConfirmationEmail(String toEmail, Booking booking) {
        if (toEmail == null || toEmail.isBlank() || !toEmail.contains("@")) {
            log.warn("Không thể gửi email xác nhận: Địa chỉ email không hợp lệ ({})", toEmail);
            return;
        }

        CompletableFuture.runAsync(() -> {
            try {
                BookingDetail detail = bookingDetailRepository.findByBookingId(booking.getId())
                        .stream().findFirst().orElse(null);

                String guestName = (booking.getCustomer() != null && booking.getCustomer().getHoTen() != null)
                        ? booking.getCustomer().getHoTen()
                        : "Quý khách";

                String roomInfo = "Phòng tiêu chuẩn Sương Mai";
                String checkIn = "Hôm nay";
                String checkOut = "Ngày mai";
                String guests = "2 người lớn";

                if (detail != null) {
                    if (detail.getRoom() != null) {
                        String catName = detail.getRoom().getRoomCategory() != null
                                ? detail.getRoom().getRoomCategory().getName()
                                : "";
                        String roomNum = detail.getRoom().getRoomNumber() != null
                                ? " (Phòng " + detail.getRoom().getRoomNumber() + ")"
                                : "";
                        roomInfo = catName + roomNum;
                    }
                    DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                    if (detail.getExpectedCheckInDate() != null) {
                        checkIn = detail.getExpectedCheckInDate().format(dtf);
                    }
                    if (detail.getExpectedCheckOutDate() != null) {
                        checkOut = detail.getExpectedCheckOutDate().format(dtf);
                    }
                    if (detail.getGuestCount() != null) {
                        guests = detail.getGuestCount() + " khách";
                    }
                }

                NumberFormat currencyFormat = NumberFormat.getInstance(new Locale("vi", "VN"));
                String depositStr = booking.getRequiredDeposit() != null
                        ? currencyFormat.format(booking.getRequiredDeposit()) + " đ"
                        : "Đã thanh toán";
                String totalStr = booking.getEstimatedTotal() != null
                        ? currencyFormat.format(booking.getEstimatedTotal()) + " đ"
                        : "0 đ";

                BigDecimal remaining = BigDecimal.ZERO;
                if (booking.getEstimatedTotal() != null && booking.getRequiredDeposit() != null) {
                    remaining = booking.getEstimatedTotal().subtract(booking.getRequiredDeposit()).max(BigDecimal.ZERO);
                }
                String remainingStr = currencyFormat.format(remaining) + " đ";

                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

                helper.setFrom(fromEmail, "Khách Sạn Sương Mai");
                helper.setTo(toEmail.trim());
                helper.setSubject("🌿 [Sương Mai Hotel] Xác nhận đặt phòng thành công - Mã " + booking.getBookingCode());

                String htmlContent = buildEmailTemplate(
                        guestName,
                        booking.getBookingCode(),
                        roomInfo,
                        checkIn,
                        checkOut,
                        guests,
                        depositStr,
                        totalStr,
                        remainingStr
                );

                helper.setText(htmlContent, true);
                mailSender.send(mimeMessage);
                log.info("Đã gửi email xác nhận đặt phòng thành công tới: {}", toEmail);
            } catch (Exception e) {
                log.error("Lỗi khi gửi email xác nhận đặt phòng cho mã {}: {}", booking.getBookingCode(), e.getMessage());
            }
        });
    }

    private String buildEmailTemplate(String guestName, String bookingCode, String roomInfo,
                                      String checkIn, String checkOut, String guests,
                                      String deposit, String total, String remaining) {
        return """
            <!DOCTYPE html>
            <html lang="vi">
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2C2A29; background-color: #FBF9F5; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E6E1DA; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                .header { background: #1C3328; color: #C5A059; padding: 28px 24px; text-align: center; }
                .header h1 { margin: 0 0 6px 0; font-size: 24px; letter-spacing: 1px; font-weight: 600; text-transform: uppercase; }
                .header p { margin: 0; font-size: 13px; color: #E0D7C6; letter-spacing: 0.5px; }
                .content { padding: 32px 28px; }
                .greeting { font-size: 16px; font-weight: 600; color: #1C3328; margin-bottom: 12px; }
                .intro { font-size: 14px; line-height: 1.6; color: #5C5856; margin-bottom: 24px; }
                .card { background: #F6F4F0; border: 1px solid #EBE7E0; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
                .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #DDD7CC; font-size: 13px; }
                .row:last-child { border-bottom: none; }
                .label { color: #7A7571; font-weight: 500; }
                .value { color: #1C3328; font-weight: 600; text-align: right; }
                .highlight-val { color: #C5A059; font-weight: 700; font-size: 15px; }
                .status-badge { display: inline-block; background: #E8F5E9; color: #2E7D32; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 12px; margin-top: 4px; }
                .footer { background: #F6F4F0; border-top: 1px solid #E6E1DA; padding: 20px; text-align: center; font-size: 12px; color: #8A8580; line-height: 1.6; }
                .footer strong { color: #1C3328; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Sương Mai Hotel</h1>
                  <p>Indochine Heritage Luxury • Phố Cổ Hà Nội</p>
                </div>
                <div class="content">
                  <div class="greeting">Kính chào %s,</div>
                  <div class="intro">
                    Cảm ơn Quý khách đã tin tưởng và lựa chọn Khách sạn Sương Mai. Chúng tôi xin xác nhận yêu cầu đặt phòng của Quý khách đã được giữ chỗ thành công sau khi hoàn tất thanh toán tiền cọc qua cổng PayOS.
                  </div>

                  <div class="card">
                    <div class="row">
                      <span class="label">Mã đặt phòng:</span>
                      <span class="value highlight-val">%s</span>
                    </div>
                    <div class="row">
                      <span class="label">Hạng phòng:</span>
                      <span class="value">%s</span>
                    </div>
                    <div class="row">
                      <span class="label">Thời gian lưu trú:</span>
                      <span class="value">%s → %s</span>
                    </div>
                    <div class="row">
                      <span class="label">Số lượng khách:</span>
                      <span class="value">%s</span>
                    </div>
                    <div class="row">
                      <span class="label">Tiền cọc đã thanh toán (30%%):</span>
                      <span class="value" style="color: #2E7D32;">%s</span>
                    </div>
                    <div class="row">
                      <span class="label">Tổng chi phí dự kiến:</span>
                      <span class="value">%s</span>
                    </div>
                    <div class="row">
                      <span class="label">Số tiền còn lại khi nhận phòng:</span>
                      <span class="value">%s</span>
                    </div>
                    <div class="row">
                      <span class="label">Trạng thái:</span>
                      <span class="value"><span class="status-badge">✓ Đã xác nhận & Giữ phòng</span></span>
                    </div>
                  </div>

                  <p style="font-size: 13px; color: #6E6965; line-height: 1.5; margin-bottom: 8px;">
                    • <strong>Thời gian nhận phòng (Check-in):</strong> từ 14:00 ngày %s<br>
                    • <strong>Thời gian trả phòng (Check-out):</strong> trước 12:00 ngày %s
                  </p>
                  <p style="font-size: 13px; color: #6E6965; line-height: 1.5;">
                    Quý khách vui lòng xuất trình Mã đặt phòng hoặc Căn cước công dân tại quầy lễ tân khi làm thủ tục nhận phòng.
                  </p>
                </div>
                <div class="footer">
                  <strong>Khách sạn Sương Mai</strong><br>
                  Địa chỉ: 45 Hàng Bè, Hoàn Kiếm, Hà Nội<br>
                  Hotline hỗ trợ 24/7: 024 3828 9999 • Email: reservation@suongmaihotel.vn<br>
                  <em>Kính chúc Quý khách một kỳ nghỉ an yên và trọn vẹn!</em>
                </div>
              </div>
            </body>
            </html>
            """.formatted(
                guestName,
                bookingCode,
                roomInfo,
                checkIn,
                checkOut,
                guests,
                deposit,
                total,
                remaining,
                checkIn,
                checkOut
        );
    }
}
