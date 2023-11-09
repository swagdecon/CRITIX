package com.popflix.service;

import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.popflix.model.User;
import com.popflix.repository.UserRepository;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.mail.internet.MimeMessage;

@Service
public class PasswordRecoveryService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private String ALGORITHM = "AES";
    private String CHARSET = "UTF-8";
    Dotenv dotenv = Dotenv.load();

    private String SECRET_KEY = dotenv.get("PWD_RESET_TOKEN");

    public PasswordRecoveryService() {
        // Schedule the resetPwdRetryCount method to run every hour
        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
        executor.scheduleAtFixedRate(this::resetPwdRetryCount, 0, 1, TimeUnit.HOURS);
    }

    public boolean authenticateExistingEmail(String userEmail) {
        var user = this.userRepository.findByEmail(userEmail).orElse(null);
        return user != null;
    }

    public String generateEncryptedToken(String email) {
        try {
            SecretKey secretKey = new SecretKeySpec(SECRET_KEY.getBytes(CHARSET), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encryptedEmailBytes = cipher.doFinal(email.getBytes(CHARSET));
            return Base64.getEncoder().encodeToString(encryptedEmailBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String decryptToken(String encryptedToken) {
        try {
            SecretKey secretKey = new SecretKeySpec(SECRET_KEY.getBytes(CHARSET), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);

            byte[] encryptedEmailBytes = Base64.getDecoder().decode(encryptedToken);
            byte[] decryptedEmailBytes = cipher.doFinal(encryptedEmailBytes);

            return new String(decryptedEmailBytes, CHARSET);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public void sendPasswordRecoveryEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email or Password Not Found"));
        try {
            String encryptedEmailToken = generateEncryptedToken(email);
            if (encryptedEmailToken == null) {
                return;
            }

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
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public boolean isPasswordResetLinkExpired(Date lastResetPwdTime) {
        if (lastResetPwdTime == null) {
            // If the last reset password time is not set, consider it as expired
            return true;
        }

        long currentTimeMillis = System.currentTimeMillis();
        long lastResetPwdTimeMillis = lastResetPwdTime.getTime();
        long timeElapsedMinutes = (currentTimeMillis - lastResetPwdTimeMillis) / (1000 * 60);

        return timeElapsedMinutes > 30;
    }

    public String resetUserPwd(String encrypedEmail, String newPassword) {
        String userEmail = decryptToken(encrypedEmail);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Email or Password Not Found"));
        Integer resetCount = user.getPasswordResetRequests();
        if (resetCount != null) {
            resetCount += 1;
        } else {
            resetCount = 1;
        }

        Boolean isExpired = isPasswordResetLinkExpired(user.getPasswordResetRequestDate());
        user.setPasswordResetRequests(resetCount += 1);

        if (resetCount <= 3) {
            System.out.println("HERE I AM");
            if (!isExpired) {
                var encodedPassword = passwordEncoder.encode(newPassword);
                System.out.println("HERE IS ENCONDED PASSWORD" + encodedPassword);
                user.setPassword(encodedPassword);
                userRepository.save(user);
                return "Password Successfully Updated";
            } else {
                return "This page has expired, please send another password reset request";
            }
        } else {
            return "You have sent too many requests, please try again later";
        }
    }

    public void resetPwdRetryCount() {
        List<User> users = userRepository.findUsersWithResetRequestsInLastHour();
        for (User user : users) {
            user.setPasswordResetRequests(0);
            userRepository.save(user);
        }
    }
}
