package com.example.demo.controller;

import com.example.demo.dto.PasswordChangeDTO;
import com.example.demo.dto.UserProfileDTO;
import com.example.demo.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @GetMapping
    public ResponseEntity<UserProfileDTO> getUserProfile(Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO profile = userProfileService.getUserProfile(email);
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<UserProfileDTO> updateUserProfile(
            @Valid @RequestBody UserProfileDTO profileDTO,
            Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO updatedProfile = userProfileService.updateUserProfile(email, profileDTO);
        return ResponseEntity.ok(updatedProfile);
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody PasswordChangeDTO passwordDTO,
            Authentication authentication) {
        String email = authentication.getName();
        userProfileService.changePassword(email, passwordDTO);
        return ResponseEntity.ok().body(new MessageResponse("Password updated successfully"));
    }

    private static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

}
