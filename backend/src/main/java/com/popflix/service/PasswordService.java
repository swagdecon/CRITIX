package com.popflix.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
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

import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordService {
    private final UserRepository userRepository;
    private final JavaMailSender javaMailSender;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationService authService;

    @Value("${ERR_PWD_REQUEST_EXCEEDED}")
    private String errorPasswordRequestExceeded;

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
            try {
                String encryptedEmailToken = authService.encryptEmail(email);
                MimeMessage message = javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                // HTML content for the email
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

                // Set email properties
                helper.setFrom("POPFLIX <popflix.help@gmail.com>");
                helper.setTo(email);
                helper.setSubject("Password Reset Request");
                MimeMultipart multipart = new MimeMultipart("related");

                MimeBodyPart messageBodyPart = new MimeBodyPart();
                messageBodyPart.setContent(emailContent, "text/html; charset=utf-8");
                multipart.addBodyPart(messageBodyPart);

                FileSystemResource logo = new FileSystemResource("src/main/resources/POPFLIX_LOGO_OFFICIAL.png");
                if (logo.exists()) {
                    MimeBodyPart imagePart = new MimeBodyPart();
                    imagePart.attachFile(logo.getFile());
                    imagePart.setContentID("<logoIcon>");
                    imagePart.setDisposition(MimeBodyPart.ATTACHMENT);
                    multipart.addBodyPart(imagePart);
                }

                message.setContent(multipart);

                javaMailSender.send(message);
                user.setPasswordResetRequestDate(new Date());
                resetCount += 1;
                user.setPasswordResetRequests(resetCount);
                userRepository.save(user);
            } catch (Exception e) {
                throw new Exception("Something went wrong while sending email.");
            }
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
