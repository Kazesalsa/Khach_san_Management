package com.hotel.suongmai.exception;

import com.hotel.suongmai.controller.CheckoutController;
import com.hotel.suongmai.dto.CheckoutErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice(assignableTypes = CheckoutController.class)
public class CheckoutExceptionHandler {

    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<CheckoutErrorResponse> handleBookingNotFound(BookingNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new CheckoutErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(UnpaidBookingException.class)
    public ResponseEntity<CheckoutErrorResponse> handleUnpaidBooking(UnpaidBookingException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new CheckoutErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(InvalidBookingStateException.class)
    public ResponseEntity<CheckoutErrorResponse> handleInvalidBookingState(InvalidBookingStateException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new CheckoutErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<CheckoutErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new CheckoutErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<CheckoutErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new CheckoutErrorResponse("Bạn không có quyền thực hiện thao tác trả phòng"));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<CheckoutErrorResponse> handleDatabaseError(DataAccessException ex) {
        log.error("Lỗi cơ sở dữ liệu khi xử lý trả phòng: ", ex);
        String msg = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new CheckoutErrorResponse("Lỗi cơ sở dữ liệu khi xử lý trả phòng: " + msg));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CheckoutErrorResponse> handleGeneralError(Exception ex) {
        log.error("Lỗi hệ thống khi xử lý trả phòng: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new CheckoutErrorResponse("Hệ thống gặp sự cố khi xử lý trả phòng. Vui lòng thử lại."));
    }
}
