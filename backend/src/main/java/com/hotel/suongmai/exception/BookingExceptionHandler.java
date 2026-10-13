package com.hotel.suongmai.exception;

import com.hotel.suongmai.controller.BookingController;
import com.hotel.suongmai.dto.BookingErrorResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice(assignableTypes = BookingController.class)
public class BookingExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BookingErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest()
                .body(new BookingErrorResponse("Dữ liệu đặt phòng không hợp lệ", errors));
    }

    @ExceptionHandler({IllegalArgumentException.class, HttpMessageNotReadableException.class})
    public ResponseEntity<BookingErrorResponse> handleBadRequest(Exception exception) {
        String message = exception instanceof IllegalArgumentException
                ? exception.getMessage()
                : "Dữ liệu đặt phòng không hợp lệ";
        return ResponseEntity.badRequest().body(new BookingErrorResponse(message));
    }

    @ExceptionHandler(RoomNotFoundException.class)
    public ResponseEntity<BookingErrorResponse> handleRoomNotFound(RoomNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new BookingErrorResponse(exception.getMessage()));
    }

    @ExceptionHandler(RoomUnavailableException.class)
    public ResponseEntity<BookingErrorResponse> handleRoomUnavailable(RoomUnavailableException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new BookingErrorResponse(exception.getMessage()));
    }

    @ExceptionHandler(ApplicablePriceNotFoundException.class)
    public ResponseEntity<BookingErrorResponse> handleMissingPrice(ApplicablePriceNotFoundException exception) {
        return ResponseEntity.unprocessableEntity()
                .body(new BookingErrorResponse(exception.getMessage()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<BookingErrorResponse> handleConflict(DataIntegrityViolationException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new BookingErrorResponse("Không thể tạo đặt phòng do dữ liệu đã tồn tại hoặc vừa thay đổi"));
    }
}
