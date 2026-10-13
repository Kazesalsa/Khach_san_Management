package com.hotel.suongmai.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateBookingRequest(
        @NotBlank(message = "Phòng không được để trống")
        String roomId,

        @NotNull(message = "Ngày nhận phòng không được để trống")
        @FutureOrPresent(message = "Ngày nhận phòng không được ở trong quá khứ")
        LocalDate checkIn,

        @NotNull(message = "Ngày trả phòng không được để trống")
        LocalDate checkOut,

        @NotNull(message = "Số khách không được để trống")
        @Min(value = 1, message = "Số khách phải lớn hơn 0")
        Integer guestCount,

        @NotBlank(message = "Họ tên khách hàng không được để trống")
        @Size(max = 100, message = "Họ tên không được vượt quá 100 ký tự")
        String guestName,

        @NotBlank(message = "Số điện thoại không được để trống")
        @Pattern(regexp = "^[0-9+() .-]{9,20}$", message = "Số điện thoại không hợp lệ")
        String phone,

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        @Size(max = 150, message = "Email không được vượt quá 150 ký tự")
        String email
) {
}
