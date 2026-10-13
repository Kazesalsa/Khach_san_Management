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
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional(readOnly = true)
    public void sendBookingConfirmationEmail(String toEmail, Booking booking) {
        if (toEmail == null || toEmail.isBlank() || !toEmail.contains("@")) {
            log.warn("Không thể gửi email xác nhận: Địa chỉ email không hợp lệ ({})", toEmail);
            return;
        }

        try {
            // Trích xuất toàn bộ dữ liệu trên luồng chính khi Hibernate Session còn mở
            String guestName = (booking.getCustomer() != null && booking.getCustomer().getHoTen() != null)
                    ? booking.getCustomer().getHoTen()
                    : "Quý khách";
            String bookingCode = booking.getBookingCode();

            String roomInfo = "Phòng tiêu chuẩn Sương Mai";
            String checkIn = "Hôm nay";
            String checkOut = "Ngày mai";
            String guests = "2 người lớn";

            BookingDetail detail = bookingDetailRepository.findByBookingId(booking.getId())
                    .stream().findFirst().orElse(null);

            if (detail != null) {
                if (detail.getRoom() != null) {
                    String catName = (detail.getRoom().getRoomCategory() != null && detail.getRoom().getRoomCategory().getName() != null)
                            ? detail.getRoom().getRoomCategory().getName()
                            : "";
                    String roomNum = detail.getRoom().getRoomNumber() != null
                            ? " (Phòng " + detail.getRoom().getRoomNumber() + ")"
                            : "";
                    roomInfo = (catName + roomNum).trim();
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

            // Soạn sẵn toàn bộ nội dung HTML
            String htmlContent = buildEmailTemplate(
                    guestName,
                    bookingCode,
                    roomInfo,
                    checkIn,
                    checkOut,
                    guests,
                    depositStr,
                    totalStr,
                    remainingStr
            );

            // Gửi email bất đồng bộ ngầm qua SMTP với các chuỗi String thuần (không chạm vào JPA proxy)
            CompletableFuture.runAsync(() -> {
                try {
                    MimeMessage mimeMessage = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

                    helper.setFrom(fromEmail, "Khách Sạn Sương Mai");
                    helper.setTo(toEmail.trim());
                    helper.setSubject("[Sương Mai Hotel] Xác nhận đặt phòng thành công - Mã " + bookingCode);
                    helper.setText(htmlContent, true);

                    mailSender.send(mimeMessage);
                    log.info("Đã gửi email xác nhận đặt phòng thành công tới: {}", toEmail);
                } catch (Exception e) {
                    log.error("Lỗi khi gửi email xác nhận đặt phòng cho mã {}: {}", bookingCode, e.getMessage());
                }
            });
        } catch (Exception e) {
            log.error("Lỗi khi chuẩn bị dữ liệu gửi email cho mã {}: {}", booking.getBookingCode(), e.getMessage());
        }
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
                body { font-family: Arial, Helvetica, sans-serif; color: #374151; background-color: #f9fafb; margin: 0; padding: 24px; font-size: 14px; line-height: 1.6; }
                .container { max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 32px 28px; }
                .header { border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 24px; }
                .header h1 { margin: 0; font-size: 20px; color: #111827; font-weight: 700; }
                .greeting { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 12px; }
                .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 18px; margin: 20px 0; }
                .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
                .label { color: #6b7280; }
                .value { color: #111827; font-weight: 600; text-align: right; }
                .status-badge { color: #15803d; font-weight: 600; }
                .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 28px; font-size: 12px; color: #9ca3af; line-height: 1.5; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Khách Sạn Sương Mai</h1>
                </div>
                <div class="content">
                  <div class="greeting">Kính chào %s,</div>
                  <p>Cảm ơn Quý khách đã đặt phòng tại Khách sạn Sương Mai. Yêu cầu đặt phòng của Quý khách đã được xác nhận sau khi hoàn tất thanh toán tiền cọc qua cổng PayOS.</p>

                  <div class="card">
                    <div class="row">
                      <span class="label">Mã đặt phòng:</span>
                      <span class="value">%s</span>
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
                      <span class="value" style="color: #15803d;">%s</span>
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
                      <span class="value status-badge">Đã xác nhận & Giữ phòng</span>
                    </div>
                  </div>

                  <p style="font-size: 13px; color: #6b7280; margin-bottom: 6px;">
                    • <strong>Thời gian nhận phòng (Check-in):</strong> từ 14:00 ngày %s<br>
                    • <strong>Thời gian trả phòng (Check-out):</strong> trước 12:00 ngày %s
                  </p>
                  <p style="font-size: 13px; color: #6b7280;">
                    Quý khách vui lòng xuất trình Mã đặt phòng hoặc Căn cước công dân tại quầy lễ tân khi làm thủ tục nhận phòng.
                  </p>
                </div>
                <div class="footer">
                  <strong>Khách sạn Sương Mai</strong><br>
                  Địa chỉ: 45 Hàng Bè, Hoàn Kiếm, Hà Nội<br>
                  Hotline: 024 3828 9999 • Email: reservation@suongmaihotel.vn
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

    /**
     * Gửi email chào mừng khi khách hàng đăng ký tài khoản mới thành công
     */
    public void sendWelcomeRegistrationEmail(String toEmail, String customerName) {
        if (toEmail == null || toEmail.isBlank() || !toEmail.contains("@")) {
            log.warn("Không thể gửi email chào mừng: Địa chỉ email không hợp lệ ({})", toEmail);
            return;
        }

        CompletableFuture.runAsync(() -> {
            try {
                String name = (customerName != null && !customerName.isBlank()) ? customerName : "Quý khách";
                DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
                String registerTime = java.time.LocalDateTime.now().format(dtf);

                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

                helper.setFrom(fromEmail, "Khách Sạn Sương Mai");
                helper.setTo(toEmail.trim());
                helper.setSubject("[Sương Mai Hotel] Chào mừng Quý khách gia nhập thành viên");

                String htmlContent = buildWelcomeEmailTemplate(name, toEmail.trim(), registerTime);
                helper.setText(htmlContent, true);
                mailSender.send(mimeMessage);
                log.info("Đã gửi email chào mừng đăng ký tài khoản tới: {}", toEmail);
            } catch (Exception e) {
                log.error("Lỗi khi gửi email chào mừng tới {}: {}", toEmail, e.getMessage());
            }
        });
    }

    private String buildWelcomeEmailTemplate(String name, String email, String registerTime) {
        return """
            <!DOCTYPE html>
            <html lang="vi">
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: Arial, Helvetica, sans-serif; color: #374151; background-color: #f9fafb; margin: 0; padding: 24px; font-size: 14px; line-height: 1.6; }
                .container { max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 32px 28px; }
                .header { border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 24px; }
                .header h1 { margin: 0; font-size: 20px; color: #111827; font-weight: 700; }
                .greeting { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 12px; }
                .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 18px; margin: 20px 0; }
                .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
                .label { color: #6b7280; }
                .value { color: #111827; font-weight: 600; text-align: right; }
                .status-badge { color: #15803d; font-weight: 600; }
                .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 28px; font-size: 12px; color: #9ca3af; line-height: 1.5; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Khách Sạn Sương Mai</h1>
                </div>
                <div class="content">
                  <div class="greeting">Kính chào %s,</div>
                  <p>Chào mừng Quý khách đến với Khách sạn Sương Mai. Tài khoản thành viên của Quý khách đã được khởi tạo thành công:</p>

                  <div class="card">
                    <div class="row">
                      <span class="label">Tên đăng nhập / Email:</span>
                      <span class="value">%s</span>
                    </div>
                    <div class="row">
                      <span class="label">Thời gian kích hoạt:</span>
                      <span class="value">%s</span>
                    </div>
                    <div class="row">
                      <span class="label">Trạng thái tài khoản:</span>
                      <span class="value status-badge">Đang hoạt động</span>
                    </div>
                  </div>

                  <p style="font-size: 13px; color: #6b7280;">
                    Quý khách có thể sử dụng email này cùng mật khẩu đã tạo để đăng nhập vào website bất cứ lúc nào.
                  </p>
                </div>
                <div class="footer">
                  <strong>Khách sạn Sương Mai</strong><br>
                  Địa chỉ: 45 Hàng Bè, Hoàn Kiếm, Hà Nội<br>
                  Hotline: 024 3828 9999 • Email: reservation@suongmaihotel.vn
                </div>
              </div>
            </body>
            </html>
            """.formatted(name, email, registerTime);
    }
    /**
     * Gửi email cấp mật khẩu tạm thời mới khi người dùng yêu cầu quên mật khẩu
     */
    public void sendTemporaryPasswordEmail(String toEmail, String customerName, String temporaryPassword) {
        if (toEmail == null || toEmail.isBlank() || !toEmail.contains("@")) {
            log.warn("Không thể gửi email mật khẩu mới: Địa chỉ email không hợp lệ ({})", toEmail);
            return;
        }

        CompletableFuture.runAsync(() -> {
            try {
                String name = (customerName != null && !customerName.isBlank()) ? customerName : "Quý khách";
                DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
                String issueTime = java.time.LocalDateTime.now().format(dtf);

                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

                helper.setFrom(fromEmail, "Khách Sạn Sương Mai");
                helper.setTo(toEmail.trim());
                helper.setSubject("[Sương Mai Hotel] Mật khẩu mới cho tài khoản của Quý khách");

                String htmlContent = buildTemporaryPasswordEmailTemplate(name, toEmail.trim(), temporaryPassword, issueTime);
                helper.setText(htmlContent, true);
                mailSender.send(mimeMessage);
                log.info("Đã gửi email mật khẩu tạm thời mới tới: {}", toEmail);
            } catch (Exception e) {
                log.error("Lỗi khi gửi email mật khẩu tạm thời tới {}: {}", toEmail, e.getMessage());
            }
        });
    }

    private String buildTemporaryPasswordEmailTemplate(String name, String email, String tempPassword, String issueTime) {
        return """
            <!DOCTYPE html>
            <html lang="vi">
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: Arial, Helvetica, sans-serif; color: #374151; background-color: #f9fafb; margin: 0; padding: 24px; font-size: 14px; line-height: 1.6; }
                .container { max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 32px 28px; }
                .header { border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 24px; }
                .header h1 { margin: 0; font-size: 20px; color: #111827; font-weight: 700; }
                .greeting { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 12px; }
                .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 18px; margin: 20px 0; }
                .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
                .label { color: #6b7280; }
                .value { color: #111827; font-weight: 600; text-align: right; }
                .password-box { background: #ffffff; border: 1px solid #d1d5db; color: #111827; font-size: 20px; font-weight: 700; text-align: center; padding: 12px; border-radius: 6px; margin: 12px 0; font-family: monospace; letter-spacing: 1px; }
                .notice { font-size: 13px; color: #6b7280; margin-top: 20px; }
                .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 28px; font-size: 12px; color: #9ca3af; line-height: 1.5; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Khách Sạn Sương Mai</h1>
                </div>
                <div class="content">
                  <div class="greeting">Kính chào %s,</div>
                  <p>Hệ thống đã nhận được yêu cầu cấp lại mật khẩu cho tài khoản của Quý khách. Dưới đây là mật khẩu tạm thời mới:</p>

                  <div class="card">
                    <div class="row">
                      <span class="label">Tài khoản / Email:</span>
                      <span class="value">%s</span>
                    </div>
                    <div style="margin-top: 10px;">
                      <span class="label">Mật khẩu tạm thời:</span>
                      <div class="password-box">%s</div>
                    </div>
                    <div class="row">
                      <span class="label">Thời gian cấp:</span>
                      <span class="value">%s</span>
                    </div>
                  </div>

                  <div class="notice">
                    <p style="margin: 0 0 8px 0;"><strong>Lưu ý:</strong></p>
                    <ul style="margin: 0; padding-left: 18px;">
                      <li>Vui lòng đăng nhập và đổi lại mật khẩu cá nhân tại phần thông tin tài khoản.</li>
                      <li>Nếu Quý khách không gửi yêu cầu này, vui lòng liên hệ ngay với chúng tôi để được hỗ trợ.</li>
                    </ul>
                  </div>
                </div>
                <div class="footer">
                  <strong>Khách sạn Sương Mai</strong><br>
                  Địa chỉ: 45 Hàng Bè, Hoàn Kiếm, Hà Nội<br>
                  Hotline: 024 3828 9999 • Email: reservation@suongmaihotel.vn
                </div>
              </div>
            </body>
            </html>
            """.formatted(name, email, tempPassword, issueTime);
    }
}
