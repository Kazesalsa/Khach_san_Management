package com.hotel.suongmai.exception;

import com.hotel.suongmai.controller.RevenueController;
import com.hotel.suongmai.dto.RevenueErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice(assignableTypes = RevenueController.class)
@Slf4j
public class RevenueExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<RevenueErrorResponse> handleInvalidDateRange(
            IllegalArgumentException exception) {
        return ResponseEntity.badRequest()
                .body(new RevenueErrorResponse(exception.getMessage()));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<RevenueErrorResponse> handleMissingParameter(
            MissingServletRequestParameterException exception) {
        return ResponseEntity.badRequest()
                .body(new RevenueErrorResponse(
                        "Thiếu tham số bắt buộc: " + exception.getParameterName()));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<RevenueErrorResponse> handleInvalidParameterFormat(
            MethodArgumentTypeMismatchException exception) {
        return ResponseEntity.badRequest()
                .body(new RevenueErrorResponse(
                        "Tham số " + exception.getName() + " không đúng định dạng"));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<RevenueErrorResponse> handleDatabaseError(
            DataAccessException exception) {
        log.error("Không thể truy vấn báo cáo doanh thu", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RevenueErrorResponse(
                        "Không thể truy vấn báo cáo doanh thu. Vui lòng thử lại sau."));
    }
}
