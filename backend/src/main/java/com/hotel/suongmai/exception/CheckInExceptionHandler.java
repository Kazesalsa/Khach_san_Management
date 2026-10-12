package com.hotel.suongmai.exception;

import com.hotel.suongmai.controller.CheckInController;
import com.hotel.suongmai.dto.CheckInErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice(assignableTypes = CheckInController.class)
public class CheckInExceptionHandler {

    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<CheckInErrorResponse> handleBookingNotFound(
            BookingNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new CheckInErrorResponse(exception.getMessage()));
    }

    @ExceptionHandler({RoomNotReadyException.class, InvalidBookingStateException.class})
    public ResponseEntity<CheckInErrorResponse> handleConflict(RuntimeException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new CheckInErrorResponse(exception.getMessage()));
    }

    @ExceptionHandler(ReceptionistNotFoundException.class)
    public ResponseEntity<CheckInErrorResponse> handleReceptionistNotFound(
            ReceptionistNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new CheckInErrorResponse(exception.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<CheckInErrorResponse> handleAccessDenied(AccessDeniedException exception) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new CheckInErrorResponse(
                        "Bạn không có quyền thực hiện thao tác check-in"));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<CheckInErrorResponse> handleDatabaseError(DataAccessException exception) {
        log.error("Lỗi cơ sở dữ liệu khi xử lý check-in", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new CheckInErrorResponse(
                        "Không thể thực hiện check-in. Vui lòng thử lại sau."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CheckInErrorResponse> handleUnexpectedError(Exception exception) {
        log.error("Lỗi hệ thống khi xử lý check-in", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new CheckInErrorResponse(
                        "Hệ thống gặp sự cố khi xử lý check-in. Vui lòng thử lại."));
    }
}
