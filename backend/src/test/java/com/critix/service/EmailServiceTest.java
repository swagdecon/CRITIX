package com.critix.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class EmailServiceTest {

    private EmailService emailService;
    private Path tempEnvFile;

    @BeforeEach
    public void setUp() throws IOException {
        tempEnvFile = Files.createTempFile(".env", "");
        try (FileWriter writer = new FileWriter(tempEnvFile.toFile())) {
            writer.write("RESEND_API_KEY=re_test_key_12345\n");
            writer.write("RESEND_FROM_EMAIL=test@resend.dev\n");
        }

        System.setProperty("user.dir", tempEnvFile.getParent().toString());

        emailService = new EmailService();
    }

    @AfterEach
    public void tearDown() throws IOException {
        if (tempEnvFile != null && Files.exists(tempEnvFile)) {
            Files.delete(tempEnvFile);
        }
    }

    @Test
    public void sendEmail_ValidatesRequiredParameters() {
        Exception exception1 = assertThrows(Exception.class, () -> {
            emailService.sendEmail(null, "Test Subject", "Test Content");
        });
        assertTrue(exception1.getMessage().contains("Something went wrong while sending email"));

        Exception exception2 = assertThrows(Exception.class, () -> {
            emailService.sendEmail("test@example.com", null, "Test Content");
        });
        assertTrue(exception2.getMessage().contains("Something went wrong while sending email"));

        Exception exception3 = assertThrows(Exception.class, () -> {
            emailService.sendEmail("test@example.com", "Test Subject", null);
        });
        assertTrue(exception3.getMessage().contains("Something went wrong while sending email"));
    }

    @Test
    public void sendEmail_HandlesLogoNotFound() {
        String email = "test@example.com";
        String subject = "Test Subject";
        String emailContent = "<html><body><img src='cid:logoIcon' alt='Logo'/><h1>Test</h1></body></html>";

        Exception exception = assertThrows(Exception.class, () -> {
            emailService.sendEmail(email, subject, emailContent);
        });
        assertTrue(exception.getMessage().contains("Something went wrong while sending email"));
    }

    @Test
    public void sendEmail_RemovesLogoTagWhenFileNotFound() {
        String email = "test@example.com";
        String subject = "Test Subject";
        String emailContent = "<html><body><img src='cid:logoIcon' /><p>Content</p></body></html>";

        Exception exception = assertThrows(Exception.class, () -> {
            emailService.sendEmail(email, subject, emailContent);
        });
        assertTrue(exception.getMessage().contains("Something went wrong while sending email"));
    }

    @Test
    public void sendEmail_WithInvalidApiKey_ThrowsException() {
        String email = "test@example.com";
        String subject = "Test Subject";
        String emailContent = "<html><body><h1>Test Content</h1></body></html>";

        Exception exception = assertThrows(Exception.class, () -> {
            emailService.sendEmail(email, subject, emailContent);
        });

        assertTrue(exception.getMessage().contains("Something went wrong while sending email"));
    }

    @Test
    public void sendEmail_HandlesHtmlContent() {
        String email = "test@example.com";
        String subject = "Test Subject";
        String emailContent = "<html><body style='background: black; color: white;'>" +
                "<h1>Welcome</h1><p>Test content</p></body></html>";

        Exception exception = assertThrows(Exception.class, () -> {
            emailService.sendEmail(email, subject, emailContent);
        });

        assertTrue(exception.getMessage().contains("Something went wrong while sending email"));
    }
}