package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class ForgotPasswordService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    private final Map<String,String> otpStorage = new HashMap<>();

    @Autowired
    public ForgotPasswordService(UserRepository userRepository, PasswordEncoder passwordEncoder, JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    public boolean sentOtp(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if(user == null) {
            return false;
        }

        String otp = generateOTP();
        otpStorage.put(email,otp);
        try {
            sendEmail(email,otp);
            return true;
        }catch (MessagingException e){
            return false;
        }
    }

    private String generateOTP() {
        Random random = new Random();
        return String.valueOf(100000+random.nextInt(10000));
    }

    private void sendEmail(String to, String otp) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message,true);
        helper.setTo(to);
        helper.setSubject("Password Reset OTP");
        helper.setText("Your OTP is: "+otp);
        mailSender.send(message);
    }

    public boolean verifyOtp(String email, String otp) {
        return otpStorage.containsKey(email) && otpStorage.get(email).equals(otp);
    }

    public boolean resetPassword(String email, String otp, String newPassword) {
        if(!verifyOtp(email, otp)) {
            return false;
        }
        User user = userRepository.findByEmail(email).orElse(null);
        if(user == null) {
            return false;
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        otpStorage.remove(email);
        return true;
    }


}
