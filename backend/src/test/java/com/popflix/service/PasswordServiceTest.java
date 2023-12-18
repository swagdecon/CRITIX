package com.popflix.service;

import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Date;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.popflix.auth.AuthenticationService;
import com.popflix.config.customExceptions.TooManyRequestsException;
import com.popflix.model.User;
import com.popflix.repository.UserRepository;

import jakarta.mail.internet.MimeMessage;

public class PasswordServiceTest {

    @Test
    public void test_send_password_recovery_email_successfully() throws Exception {
        UserRepository userRepository = Mockito.mock(UserRepository.class);
        JavaMailSender javaMailSender = Mockito.mock(JavaMailSender.class);
        PasswordEncoder passwordEncoder = Mockito.mock(PasswordEncoder.class);
        AuthenticationService authService = Mockito.mock(AuthenticationService.class);

        PasswordService passwordService = new PasswordService(userRepository, javaMailSender, passwordEncoder,
                authService);

        User user = new User();
        user.setEmail("test@example.com");
        user.setPasswordResetRequests(2);

        Mockito.when(userRepository.findByEmail(Mockito.anyString())).thenReturn(Optional.of(user));

        Mockito.when(authService.encryptEmail(Mockito.anyString())).thenReturn("encryptedToken");

        MimeMessage message = Mockito.mock(MimeMessage.class);
        Mockito.when(javaMailSender.createMimeMessage()).thenReturn(message);

        Mockito.doNothing().when(javaMailSender).send(Mockito.any(MimeMessage.class));

        passwordService.sendPasswordRecoveryEmail("test@example.com");

        Mockito.verify(userRepository, Mockito.times(1)).save(user);
    }

    @Test
    public void test_handle_case_user_has_made_more_than_3_password_reset_requests() throws Exception {
        // Mock dependencies
        UserRepository userRepository = Mockito.mock(UserRepository.class);
        JavaMailSender javaMailSender = Mockito.mock(JavaMailSender.class);
        PasswordEncoder passwordEncoder = Mockito.mock(PasswordEncoder.class);
        AuthenticationService authService = Mockito.mock(AuthenticationService.class);

        PasswordService passwordService = new PasswordService(userRepository, javaMailSender, passwordEncoder,
                authService);

        User user = new User();
        user.setEmail("test@example.com");
        user.setPasswordResetRequests(4);

        Mockito.when(userRepository.findByEmail(Mockito.anyString())).thenReturn(Optional.of(user));

        assertThrows(TooManyRequestsException.class,
                () -> passwordService.sendPasswordRecoveryEmail("test@example.com"));
    }

    @Test
    public void test_handle_case_user_email_not_found_in_database() throws Exception {
        // Mock dependencies
        UserRepository userRepository = Mockito.mock(UserRepository.class);
        JavaMailSender javaMailSender = Mockito.mock(JavaMailSender.class);
        PasswordEncoder passwordEncoder = Mockito.mock(PasswordEncoder.class);
        AuthenticationService authService = Mockito.mock(AuthenticationService.class);

        PasswordService passwordService = new PasswordService(userRepository, javaMailSender, passwordEncoder,
                authService);

        Mockito.when(userRepository.findByEmail(Mockito.anyString())).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
                () -> passwordService.sendPasswordRecoveryEmail("test@example.com"));
    }

    @Test
    public void test_resetUserPwd_linkNotExpired() throws Exception {
        UserRepository userRepository = Mockito.mock(UserRepository.class);
        JavaMailSender javaMailSender = Mockito.mock(JavaMailSender.class);
        PasswordEncoder passwordEncoder = Mockito.mock(PasswordEncoder.class);
        AuthenticationService authService = Mockito.mock(AuthenticationService.class);

        PasswordService passwordService = new PasswordService(userRepository, javaMailSender, passwordEncoder,
                authService);

        User user = new User();
        user.setEmail("test@example.com");
        user.setPasswordResetRequestDate(new Date());

        Mockito.when(authService.decryptToken(Mockito.anyString())).thenReturn("test@example.com");
        Mockito.when(userRepository.findByEmail(Mockito.anyString())).thenReturn(Optional.of(user));
        Mockito.when(authService.isAuthLinkExpired(Mockito.any())).thenReturn(false);

        // Act
        passwordService.resetUserPwd("encryptedEmail", "newPassword");

        // Assert
        Mockito.verify(userRepository, Mockito.times(1)).findByEmail(Mockito.anyString());
        Mockito.verify(passwordEncoder, Mockito.times(1)).encode("newPassword");
        Mockito.verify(userRepository, Mockito.times(1)).save(user);
    }
}
