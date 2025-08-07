package com.example.demo.controller;

import com.example.demo.dto.ForgotPasswordRequest;
import com.example.demo.service.ForgotPasswordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
@CrossOrigin
public class ForgotPasswordController {
    private final ForgotPasswordService forgotPasswordService;

    public ForgotPasswordController(ForgotPasswordService forgotPasswordService) {
        this.forgotPasswordService = forgotPasswordService;
    }

    // Endpoint for sending OTP
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        boolean sent = forgotPasswordService.sentOtp(request.getEmail());
        return sent ? ResponseEntity.ok("OTP sent") : ResponseEntity.badRequest().body("Email Not Found");
    }

    // Endpoint for verifying OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody ForgotPasswordRequest request) {
        boolean verified = forgotPasswordService.verifyOtp(request.getEmail(), request.getOtp());
        return verified ? ResponseEntity.ok("OTP verified") : ResponseEntity.badRequest().body("Invalid OTP");
    }

    // Endpoint for resetting password
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ForgotPasswordRequest request) {
        boolean reset = forgotPasswordService.resetPassword(request.getEmail(), request.getOtp(), request.getPassword());
        return reset ? ResponseEntity.ok("Password Reset Successfully") : ResponseEntity.badRequest().body("Password Reset Failed");
    }
}
