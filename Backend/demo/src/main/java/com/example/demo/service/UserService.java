package com.example.demo.service;

import com.example.demo.dto.UserDTO;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JWTUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JWTUtil jwtUtil;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService , JWTUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public User registerUser(String name, String email, String password, Role role) {
        String encryptedPassword = passwordEncoder.encode(password);
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(encryptedPassword);
        user.setRole(role);

        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setTokenExpiry(LocalDateTime.now().plusHours(24));
        user.setEnabled(false);

        User savedUser = userRepository.save(user);

        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + token;
        emailService.sendVerificationEmail(savedUser.getEmail(), verificationLink);

        return savedUser;
    }

    @Transactional
    public boolean verifyEmail(String token) {
        Optional<User> userOptional = userRepository.findByVerificationToken(token);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification token has expired.");
            }

            user.setEnabled(true);
            user.setVerificationToken(null);
            user.setTokenExpiry(null);
            userRepository.save(user);

            return true;
        }
        return false;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Email not verified yet.");
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .disabled(!user.isEnabled())
                .build();
    }

    public String generateVerificationToken() {
        return UUID.randomUUID().toString();
    }

    @Transactional
    public void resendVerificationEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        if (user.isEnabled()) {
            throw new RuntimeException("Email is already verified");
        }

        String newToken = generateVerificationToken();
        user.setVerificationToken(newToken);
        user.setTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + newToken;
        emailService.sendVerificationEmail(user.getEmail(), verificationLink);
    }

    public String authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email).orElse(null);
        if(!user.isEnabled()){
            throw new RuntimeException("You must verify your account first");
        }
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return jwtUtil.generateAccessToken(user);
        }
        return null;
    }

    public List<UserDTO> getAllUsers(){
        return userRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO createUser(UserDTO userDTO) {
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setName(userDTO.getUsername());
        user.setPassword(passwordEncoder.encode("defaultPassword")); // Set a default password
        user.setRole(userDTO.getRole());
        user.setAddress(userDTO.getAddress());
        user.setPhone(userDTO.getPhone());
        user.setEnabled(true);
        userRepository.save(user);
        return toDTO(userRepository.save(user));
    }

    public UserDTO updateUser(Long id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getUsername());
        user.setRole(dto.getRole());
        user.setAddress(dto.getAddress());
        user.setPhone(dto.getPhone());

        return toDTO(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getName());
        dto.setRole(user.getRole());
        dto.setAddress(user.getAddress());
        dto.setPhone(user.getPhone());
        return dto;
    }
}