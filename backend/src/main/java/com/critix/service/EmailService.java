package com.critix.service;

import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;

    public void sendEmail(String email, String subject, String emailContent) throws Exception {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("CRITIX <popflix.help@gmail.com>");
            helper.setTo(email);
            helper.setSubject(subject);

            MimeMultipart multipart = new MimeMultipart("related");

            MimeBodyPart messageBodyPart = new MimeBodyPart();
            messageBodyPart.setContent(emailContent, "text/html; charset=utf-8");
            multipart.addBodyPart(messageBodyPart);

            FileSystemResource logo = new FileSystemResource("src/main/resources/CRITIX_LOGO_OFFICIAL.png");
            if (logo.exists()) {
                MimeBodyPart imagePart = new MimeBodyPart();
                imagePart.attachFile(logo.getFile());
                imagePart.setContentID("<logoIcon>");
                imagePart.setDisposition(MimeBodyPart.ATTACHMENT);
                multipart.addBodyPart(imagePart);
            }

            message.setContent(multipart);

            javaMailSender.send(message);
        } catch (Exception e) {
            throw new Exception("Something went wrong while sending email: " + e.getMessage(), e);

        }
    }
}
