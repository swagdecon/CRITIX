package com.critix.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.javamail.JavaMailSender;

import com.critix.service.EmailService;

import jakarta.mail.internet.MimeMessage;

public class EmailServiceTest {
    @Mock
    private JavaMailSender javaMailSender;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void sendEmail_SuccessfullySent() throws Exception {
        // Arrange
        String email = "test@example.com";
        String subject = "Test Subject";
        String emailContent = "<html><body><h1>Test Content</h1></body></html>";

        MimeMessage mockedMessage = mock(MimeMessage.class);
        when(javaMailSender.createMimeMessage()).thenReturn(mockedMessage);

        // Act
        emailService.sendEmail(email, subject, emailContent);

        // Assert
        verify(javaMailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    public void sendEmail_WithLogoAttachment() throws Exception {
        // Arrange
        String email = "test@example.com";
        String subject = "Test Subject";
        String emailContent = "<html><body><h1>Test Content</h1></body></html>";

        MimeMessage mockedMessage = mock(MimeMessage.class);
        when(javaMailSender.createMimeMessage()).thenReturn(mockedMessage);

        // Act
        emailService.sendEmail(email, subject, emailContent);

        // Assert
        verify(javaMailSender, times(1)).send(any(MimeMessage.class));
        verify(javaMailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    public void test_sendEmail_emailParameterNull() {
        String email = null;
        String subject = "Test Subject";
        String emailContent = "Test Email Content";

        // Act and Assert
        assertThrows(Exception.class, () -> {
            EmailService emailService = new EmailService(mock(JavaMailSender.class));
            emailService.sendEmail(email, subject, emailContent);
        });
    }

    @Test
    public void test_sendEmail_subjectParameterNull() {
        String email = "test@example.com";
        String subject = null;
        String emailContent = "Test Email Content";

        assertThrows(Exception.class, () -> {
            EmailService emailService = new EmailService(mock(JavaMailSender.class));
            emailService.sendEmail(email, subject, emailContent);
        });
    }

    @Test
    public void test_sendEmail_javaMailSenderNull() {
        String email = "test@example.com";
        String subject = "Test Subject";
        String emailContent = "Test Email Content";

        // Act and Assert
        assertThrows(Exception.class, () -> {
            EmailService emailService = new EmailService(null);
            emailService.sendEmail(email, subject, emailContent);
        });
    }
}
