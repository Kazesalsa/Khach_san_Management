package com.hotel.suongmai.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.hotel.suongmai.dto.AuthErrorResponse;
import com.hotel.suongmai.controller.AuthController;

@RestControllerAdvice(assignableTypes = AuthController.class)
public class AuthExceptionHandler {

    @ExceptionHandler({BadCredentialsException.class, UsernameNotFoundException.class})
    public ResponseEntity<AuthErrorResponse> handleInvalidCredentials(RuntimeException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthErrorResponse("Tên đăng nhập hoặc mật khẩu không chính xác"));
    }

    @ExceptionHandler({LockedException.class, DisabledException.class})
    public ResponseEntity<AuthErrorResponse> handleLockedAccount(RuntimeException exception) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new AuthErrorResponse("Tài khoản đã bị khóa"));
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<AuthErrorResponse> handleMissingAuthentication(
            InsufficientAuthenticationException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthErrorResponse("Token không hợp lệ hoặc đã hết hạn"));
    }

    @ExceptionHandler(ProfileNotFoundException.class)
    public ResponseEntity<AuthErrorResponse> handleProfileNotFound(ProfileNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new AuthErrorResponse(exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<AuthErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest()
                .body(new AuthErrorResponse("Dữ liệu đăng nhập không hợp lệ", errors));
    }
}
