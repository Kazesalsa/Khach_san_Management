package com.hotel.suongmai.exception;

import com.hotel.suongmai.controller.BillingController;
import com.hotel.suongmai.dto.CheckoutErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestControllerAdvice(assignableTypes = BillingController.class)
public class BillingExceptionHandler {

    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<CheckoutErrorResponse> handleNotFound(BookingNotFoundException exception) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new CheckoutErrorResponse(exception.getMessage()));
    }

    @ExceptionHandler({
            InvalidBookingStateException.class,
            IllegalArgumentException.class,
            IllegalStateException.class
    })
    public ResponseEntity<CheckoutErrorResponse> handleBadRequest(RuntimeException exception) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new CheckoutErrorResponse(exception.getMessage()));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<CheckoutErrorResponse> handleDatabaseError(DataAccessException exception) {
        log.error("Lỗi database khi xử lý hóa đơn", exception);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new CheckoutErrorResponse("Không thể lưu thông tin hóa đơn"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CheckoutErrorResponse> handleGeneralError(Exception exception) {
        log.error("Lỗi hệ thống khi xử lý hóa đơn", exception);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new CheckoutErrorResponse("Hệ thống gặp sự cố khi xử lý hóa đơn"));
    }
}