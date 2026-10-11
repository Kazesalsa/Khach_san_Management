package com.hotel.suongmai.exception;

import com.hotel.suongmai.controller.PriceListController;
import com.hotel.suongmai.dto.PriceListErrorResponse;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice(assignableTypes = PriceListController.class)
public class PriceListExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<PriceListErrorResponse> handleValidation(
            MethodArgumentNotValidException exception) {
        Map<String, String> errors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));

        return ResponseEntity.badRequest()
                .body(new PriceListErrorResponse("Dữ liệu bảng giá không hợp lệ", errors));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<PriceListErrorResponse> handleUnreadableRequest(
            HttpMessageNotReadableException exception) {
        return ResponseEntity.badRequest()
                .body(new PriceListErrorResponse("Dữ liệu bảng giá không hợp lệ"));
    }

    @ExceptionHandler(PriceListOverlapException.class)
    public ResponseEntity<PriceListErrorResponse> handleOverlap(
            PriceListOverlapException exception) {
        return ResponseEntity.badRequest()
                .body(new PriceListErrorResponse(exception.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<PriceListErrorResponse> handleInvalidReference(
            IllegalArgumentException exception) {
        return ResponseEntity.badRequest()
                .body(new PriceListErrorResponse(exception.getMessage()));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<PriceListErrorResponse> handleDatabaseError(
            DataAccessException exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new PriceListErrorResponse("Không thể lưu bảng giá. Vui lòng thử lại."));
    }
}
