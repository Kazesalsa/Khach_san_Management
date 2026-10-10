package com.hotel.suongmai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.hotel.suongmai.dto.LoginRequest;
import com.hotel.suongmai.dto.LoginResponse;
import com.hotel.suongmai.dto.ProfileResponse;
import com.hotel.suongmai.security.TaiKhoanDetails;
import com.hotel.suongmai.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getCurrentProfile(
            @AuthenticationPrincipal TaiKhoanDetails accountDetails) {
        return ResponseEntity.ok(authService.getProfile(accountDetails));
    }
}
