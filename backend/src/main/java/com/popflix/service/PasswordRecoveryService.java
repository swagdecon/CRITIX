package com.popflix.service;

import java.security.SecureRandom;
import java.util.Base64;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import com.popflix.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordRecoveryService {

    private final UserRepository userRepository;
    private final JavaMailSender javaMailSender;

    public boolean authenticateExistingEmail(String email) {
        String userEmail = email;
        var user = this.userRepository.findByEmail(userEmail).orElse(null);
        return user != null;
    }

    private String generateRandomToken() {
        byte[] randomBytes = new byte[32]; // 32 bytes to generate a sufficiently long token
        new SecureRandom().nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    public void sendPasswordRecoveryEmail(String email) {
        try {
            String token = generateRandomToken();
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            String emailText = String.format(
                    "Dear user, to reset your password, click the following link: http://popflix.com/v1/auth/password/reset-password?token=%s%n"
                            + "If you didn't authorize this request, kindly ignore this email.%n"
                            + "Thanks for your support!%n"
                            + "The POPFLIX team",
                    token);

            helper.setFrom("POPFLIX <popflix.help@gmail.com>");
            helper.setTo(email);
            helper.setSubject("Password Reset Request");
            helper.setText(emailText);

            javaMailSender.send(message);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
