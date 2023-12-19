package com.popflix.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import java.util.Date;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.popflix.auth.AuthenticationService;
import com.popflix.config.customExceptions.TooManyRequestsException;
import com.popflix.model.User;
import com.popflix.repository.UserRepository;

import jakarta.mail.internet.MimeMessage;

public class PasswordServiceTest {

        private UserRepository userRepository;
        private PasswordEncoder passwordEncoder;
        private AuthenticationService authService;
        private EmailService emailService;
        private JavaMailSender javaMailSender;

        private PasswordService passwordService;

        @BeforeEach
        public void setUp() {
                userRepository = mock(UserRepository.class);
                passwordEncoder = mock(PasswordEncoder.class);
                authService = mock(AuthenticationService.class);
                emailService = mock(EmailService.class);
                javaMailSender = mock(JavaMailSender.class);

                passwordService = new PasswordService(userRepository, passwordEncoder, authService, emailService);
        }

        @Test
        public void testSendPasswordRecoveryEmailSuccessfully() throws Exception {
                User user = new User();
                user.setEmail("test@example.com");
                user.setPasswordResetRequests(2);

                when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
                when(authService.encryptEmail(anyString())).thenReturn("encryptedToken");
                when(javaMailSender.createMimeMessage()).thenReturn(mock(MimeMessage.class));
                doNothing().when(javaMailSender).send(any(MimeMessage.class));

                passwordService.sendPasswordRecoveryEmail("test@example.com");

                verify(userRepository, times(1)).save(user);
        }

        @Test
        public void testHandleCaseUserHasMadeMoreThan3PasswordResetRequests() {
                User user = new User();
                user.setEmail("test@example.com");
                user.setPasswordResetRequests(4);

                when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

                assertThrows(TooManyRequestsException.class,
                                () -> passwordService.sendPasswordRecoveryEmail("test@example.com"));
        }

        @Test
        public void testHandleCaseUserEmailNotFoundInDatabase() {
                when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

                assertThrows(UsernameNotFoundException.class,
                                () -> passwordService.sendPasswordRecoveryEmail("test@example.com"));
        }

        @Test
        public void testResetUserPwdLinkNotExpired() throws Exception {
                User user = new User();
                user.setEmail("test@example.com");
                user.setPasswordResetRequestDate(new Date());

                when(authService.decryptToken(anyString())).thenReturn("test@example.com");
                when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
                when(authService.isAuthLinkExpired(any())).thenReturn(false);

                passwordService.resetUserPwd("encryptedEmail", "newPassword");

                verify(userRepository, times(1)).findByEmail(anyString());
                verify(passwordEncoder, times(1)).encode("newPassword");
                verify(userRepository, times(1)).save(user);
        }
}
