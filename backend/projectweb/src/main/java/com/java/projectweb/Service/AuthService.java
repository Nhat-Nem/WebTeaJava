package com.java.projectweb.Service;

import com.java.projectweb.Entity.User;
import com.java.projectweb.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Date;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public void forgotPassword(String email) {

        email = email.trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Email không tồn tại"));

        // sinh token
        String resetToken = UUID.randomUUID().toString();

        // hash token
        String hashedToken = sha256(resetToken);

        user.setResetPasswordToken(hashedToken);
        user.setResetPasswordExpire(
                new Date(System.currentTimeMillis() + 10 * 60 * 1000)
        );

        userRepository.save(user);

        String resetUrl =
                "http://localhost:5173/reset-password/" + resetToken;

        emailService.sendResetEmail(
                user.getEmail(),
                resetUrl
        );
    }

    private String sha256(String value) {

        try {

            MessageDigest md = MessageDigest.getInstance("SHA-256");

            byte[] hash = md.digest(value.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder();

            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }

            return sb.toString();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void resetPassword(String token, String password) {

        String hashedToken = sha256(token);

        User user = userRepository.findByResetPasswordToken(hashedToken)
                .orElseThrow(() ->
                        new RuntimeException("Token không hợp lệ"));

        if (user.getResetPasswordExpire().before(new Date())) {
            throw new RuntimeException("Token đã hết hạn");
        }

        user.setPassword(passwordEncoder.encode(password));

        user.setResetPasswordToken(null);
        user.setResetPasswordExpire(null);

        userRepository.save(user);
    }
}
