package com.popflix.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.access.method.P;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.popflix.config.customExceptions.BadRequestException;
import com.popflix.config.customExceptions.TokenExpiredException;
import com.popflix.config.customExceptions.TooManyRequestsException;
import com.popflix.model.User;
import com.popflix.repository.UserRepository;

import jakarta.mail.internet.MimeMessage;

@Service
public class PasswordRecoveryService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${ERR_PWD_REQUEST_EXCEEDED}")
    private String errorPasswordRequestExceeded;

    public PasswordRecoveryService() {
        System.out.println("PasswordRecoveryService initialized");

        // Schedule the resetPwdRetryCount method to run every hour
        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
        executor.scheduleAtFixedRate(this::resetPwdRetryCount, 0, 1, TimeUnit.HOURS);
    }

    public boolean authenticateExistingEmail(String userEmail) {
        var user = this.userRepository.findByEmail(userEmail).orElse(null);
        return user != null;
    }

    private static final String AES_ALGORITHM = "AES";
    private static final int KEY_SIZE = 256;

    public static String encryptEmail(String email) throws Exception {
        SecretKey secretKey = generateSecretKey();
        Cipher cipher = Cipher.getInstance(AES_ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);

        byte[] encryptedBytes = cipher.doFinal(email.getBytes(StandardCharsets.UTF_8));
        String encryptedToken = Base64.getUrlEncoder().withoutPadding().encodeToString(encryptedBytes);

        // Include the key in the token
        String keyString = Base64.getUrlEncoder().withoutPadding().encodeToString(secretKey.getEncoded());
        encryptedToken = keyString + ":" + encryptedToken;

        return encryptedToken;
    }

    public static String decryptToken(String encryptedToken) throws Exception {
        // Split the key and encrypted data
        String[] parts = encryptedToken.split(":");
        String keyString = parts[0];
        String encryptedEmail = parts[1];

        // Decode the key
        byte[] keyBytes = Base64.getUrlDecoder().decode(keyString);
        SecretKey secretKey = new SecretKeySpec(keyBytes, AES_ALGORITHM);

        // Decrypt using the key
        Cipher cipher = Cipher.getInstance(AES_ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, secretKey);

        byte[] decryptedBytes = cipher.doFinal(Base64.getUrlDecoder().decode(encryptedEmail));
        return new String(decryptedBytes, StandardCharsets.UTF_8);
    }

    private static SecretKey generateSecretKey() throws Exception {
        KeyGenerator keyGenerator = KeyGenerator.getInstance(AES_ALGORITHM);
        keyGenerator.init(KEY_SIZE);
        return keyGenerator.generateKey();
    }

    public void sendPasswordRecoveryEmail(String email) throws Exception {
        try {
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
                String encryptedEmailToken = encryptEmail(email);
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
                throw new TooManyRequestsException("Too many requests, please try again later");
            }
        } catch (Exception e) {
            throw new BadRequestException("Failed to send password recovery email. Please try again later.");
        }
    }

    public boolean isPasswordResetLinkExpired(Date lastResetPwdTime) {
        if (lastResetPwdTime == null) {
            return true;
        }

        long currentTimeMillis = System.currentTimeMillis();
        long lastResetPwdTimeMillis = lastResetPwdTime.getTime();
        long timeElapsedMinutes = (currentTimeMillis - lastResetPwdTimeMillis) / (1000 * 60);

        return timeElapsedMinutes > 1;
    }

    public void resetUserPwd(String encryptedEmail, String newPassword) {
        try {
            String userEmail = decryptToken(encryptedEmail);
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("Email or Password Not Found"));

            Boolean isExpired = isPasswordResetLinkExpired(user.getPasswordResetRequestDate());

            if (!isExpired) {
                var encodedPassword = passwordEncoder.encode(newPassword);
                user.setPassword(encodedPassword);
                userRepository.save(user);
            } else {
                throw new TokenExpiredException("This link is no longer valid, please try again.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new BadRequestException("Something went wrong. Please try again later.");
        }
    }

    public void resetPwdRetryCount() {
        try {
            // Find users with reset requests
            List<User> users = this.userRepository.findUsersWithResetRequests();
            // Reset password retry count for each user
            for (User user : users) {
                user.setPasswordResetRequests(0);
                userRepository.save(user);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
