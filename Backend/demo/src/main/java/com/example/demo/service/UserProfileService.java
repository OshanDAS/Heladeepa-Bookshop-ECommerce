package com.example.demo.service;

import com.example.demo.dto.PasswordChangeDTO;
import com.example.demo.dto.UserProfileDTO;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public UserProfileDTO getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapUserToDTO(user);
    }

    @Transactional
    public UserProfileDTO updateUserProfile(String email, UserProfileDTO profileDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(profileDTO.getName());
        user.setPhone(profileDTO.getPhone());
        user.setAddress(profileDTO.getAddress());

        User updatedUser = userRepository.save(user);
        return mapUserToDTO(updatedUser);
    }

    @Transactional
    public void changePassword(String email, PasswordChangeDTO passwordDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(passwordDTO.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (passwordDTO.getNewPassword().length() < 8) {
            throw new RuntimeException("New password must be at least 8 characters long");
        }

        user.setPassword(passwordEncoder.encode(passwordDTO.getNewPassword()));
        userRepository.save(user);
    }

    private UserProfileDTO mapUserToDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        return dto;
    }
}