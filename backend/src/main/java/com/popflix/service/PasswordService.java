package com.popflix.service;

import java.util.Date;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.popflix.auth.AuthenticationService;
import com.popflix.config.customExceptions.TokenExpiredException;
import com.popflix.config.customExceptions.TooManyRequestsException;
import com.popflix.model.User;
import com.popflix.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationService authService;
    private final EmailService emailService;

    public void sendPasswordRecoveryEmail(String email) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email or Password Not Found"));
        Integer resetCount = user.getPasswordResetRequests();
        if (resetCount == null) {
            resetCount = 1;
        }
        user.setPasswordResetRequests(resetCount);
        resetCount = user.getPasswordResetRequests();

        if (resetCount <= 3) {
            String encryptedEmailToken = authService.encryptEmail(email);

            String emailContent = "<html>"
                    + "<body style='background-color: black; color: white; font-family: Arial, sans-serif;'>"
                    + "<div style='text-align: center; padding: 20px;'>"
                    + "<img src='cid:logoIcon' alt='Popflix Logo' style='max-width: 200px;' />"
                    + "<h1>Password Reset Request</h1>"
                    + "<p>Dear user,</p>"
                    + "<p>To reset your password, click <a href='http:/localhost:3000/reset-password/"
                    + encryptedEmailToken + "' style='color: white;'>here</a>.</p>"
                    + "<p>If you didn't authorize this request, kindly ignore this email.</p>"
                    + "<p>Thanks for your support!<br/>The POPFLIX team</p>"
                    + "</div>"
                    + "</body>"
                    + "</html>";

            emailService.sendEmail(email, "Password Reset Request", emailContent);

            user.setPasswordResetRequestDate(new Date());
            resetCount += 1;
            user.setPasswordResetRequests(resetCount);
            userRepository.save(user);
        } else {
            throw new TooManyRequestsException("Too many requests, please try again later.");
        }
    }

    public void resetUserPwd(String encryptedEmail, String newPassword) throws Exception {
        String userEmail = authService.decryptToken(encryptedEmail);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Email or Password Not Found"));

        Boolean isExpired = authService.isAuthLinkExpired(user.getPasswordResetRequestDate());

        if (!isExpired) {
            var encodedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encodedPassword);
            userRepository.save(user);
        } else {
            throw new TokenExpiredException("This link is no longer valid, please try again.");
        }
    }
}
