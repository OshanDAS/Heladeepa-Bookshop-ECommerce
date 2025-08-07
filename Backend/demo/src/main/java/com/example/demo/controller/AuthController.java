package com.example.demo.controller;

import com.example.demo.dto.UserRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;
import com.example.demo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("api/auth")
@CrossOrigin
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final EmailService emailService; // Inject EmailService

    public AuthController(UserService userService, UserRepository userRepository, EmailService emailService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.emailService = emailService; // Initialize the injected EmailService
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRequest request) {
        userService.registerUser(request.getName(), request.getEmail(), request.getPassword(), request.getRole());
        return ResponseEntity.ok("User registered successfully. Please check your email to verify your account.");
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyAccount(@RequestParam("token") String token) {
        Optional<User> userOpt = userRepository.findByVerificationToken(token);

        if (userOpt.isEmpty()) {
            String errorHtml = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verification Failed</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="flex items-center justify-center min-h-screen bg-red-50">
                <div class="bg-white p-6 rounded-2xl shadow-md text-center max-w-md">
                    <div class="flex justify-center mb-4">
                        <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
                    <p class="text-gray-700">Invalid verification token!</p>
                </div>
            </body>
            </html>
        """;
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_HTML)
                    .body(errorHtml);
        }

        User user = userOpt.get();

        if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            String expiredHtml = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Token Expired</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="flex items-center justify-center min-h-screen bg-yellow-50">
                <div class="bg-white p-6 rounded-2xl shadow-md text-center max-w-md">
                    <div class="flex justify-center mb-4">
                        <svg class="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-yellow-600 mb-2">Token Expired</h2>
                    <p class="text-gray-700">Your verification token has expired. Please request a new verification email.</p>
                </div>
            </body>
            </html>
        """;
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_HTML)
                    .body(expiredHtml);
        }

        user.setEnabled(true);
        user.setVerificationToken(null);
        user.setTokenExpiry(null);
        userRepository.save(user);

        String successHtml = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Success</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <meta http-equiv="refresh" content="5; url=http://localhost:5173/" /> <!-- Redirect after 5 seconds -->
        </head>
        <body class="flex items-center justify-center min-h-screen bg-green-50">
            <div class="bg-white p-6 rounded-2xl shadow-md text-center max-w-md">
                <div class="flex justify-center mb-4">
                    <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-green-600 mb-2">Account Verified!</h2>
                <p class="text-gray-700 mb-4">Your account has been successfully verified. You will be redirected to the login page shortly.</p>
                <a href="http://localhost:5173/" class="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Go to Login</a>
            </div>
        </body>
        </html>
    """;

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(successHtml);
    }


    @GetMapping("/checkEmailVerification")
    public ResponseEntity<String> checkEmailVerification(@RequestParam("email") String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.isEnabled()) {
                return ResponseEntity.ok("Email is verified.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email not verified.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }

    @PostMapping("/resendVerification")
    public ResponseEntity<String> resendVerification(@RequestParam("email") String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        User user = userOpt.get();

        if (user.isEnabled()) {
            return ResponseEntity.badRequest().body("Email is already verified.");
        }


        String newToken = userService.generateVerificationToken();
        user.setVerificationToken(newToken);
        user.setTokenExpiry(LocalDateTime.now().plusHours(24)); // Adjust as needed
        userRepository.save(user);


        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + newToken;


        emailService.sendVerificationEmail(user.getEmail(), verificationLink);

        return ResponseEntity.ok("Verification email has been resent. Please check your inbox.");
    }
}