package com.example.demo.controller; // Updated package name

import com.example.demo.dto.TokenResponse;
import com.example.demo.entity.User; // Updated import
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService; // Updated import
import com.example.demo.util.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;




    @PostMapping("/login")
public ResponseEntity<?> loginUser(@RequestBody User user) {
    try {
        String token = userService.authenticateUser(user.getEmail(), user.getPassword());
        if (token != null) {
            return ResponseEntity.ok().body(new TokenResponse(token));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    }
}


}