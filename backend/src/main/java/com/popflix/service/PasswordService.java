package com.popflix.service;

import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.popflix.auth.AuthenticationService;
import com.popflix.config.customExceptions.TokenExpiredException;
import com.popflix.config.customExceptions.TooManyRequestsException;
import com.popflix.model.User;
import com.popflix.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordService {
    private UserRepository userRepository;
    private JavaMailSender javaMailSender;
    private PasswordEncoder passwordEncoder;
    private AuthenticationService authService;

    @Value("${ERR_PWD_REQUEST_EXCEEDED}")
    private String errorPasswordRequestExceeded;

    @Value("${AES_ALGORITHM}")
    private static String AES_ALGORITHM;

    @Value("${KEY_SIZE}")
    private static int KEY_SIZE;

    public boolean authenticateExistingEmail(String userEmail) {
        var user = this.userRepository.findByEmail(userEmail).orElse(null);
        return user != null;
    }

    public void sendPasswordRecoveryEmail(String email) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email or Password Not Found"));
        Integer resetCount = user.getPasswordResetRequests();
        if (resetCount != null) {
            resetCount += 1;
        } else {
            resetCount = 1;
        }
        user.setPasswordResetRequests(resetCount);
        resetCount = user.getPasswordResetRequests();

        if (resetCount <= 3) {
            String encryptedEmailToken = authService.encryptEmail(email);
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            String emailText = String.format(
                    "Dear user, to reset your password, click the following link: http:/localhost:3000/reset-password/%s%n"
                            + "If you didn't authorize this request, kindly ignore this email.%n"
                            + "Thanks for your support!%n"
                            + "The POPFLIX team",
                    encryptedEmailToken);

            helper.setFrom("POPFLIX <popflix.help@gmail.com>");
            helper.setTo(email);
            helper.setSubject("Password Reset Request");
            helper.setText(emailText);
            user.setPasswordResetRequestDate(new Date());

            userRepository.save(user);
            javaMailSender.send(message);
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
