package com.critix.service;

import java.io.InputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;

import io.github.cdimascio.dotenv.Dotenv;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
public class EmailService {

    private final Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
    private final OkHttpClient client = new OkHttpClient();
    private final Gson gson = new Gson();

    private String getEnv(String key) {
        String sysEnv = System.getenv(key);
        if (sysEnv != null && !sysEnv.isEmpty()) {
            return sysEnv;
        }
        return dotenv.get(key);
    }

    private String apiKey = getEnv("RESEND_API_KEY");
    private String fromEmail = getEnv("RESEND_FROM_EMAIL") != null
            ? getEnv("RESEND_FROM_EMAIL")
            : "onboarding@resend.dev";

    public void sendEmail(String email, String subject, String emailContent) throws Exception {
        try {
            Map<String, Object> emailData = new HashMap<>();
            emailData.put("from", "CRITIX <" + fromEmail + ">");
            emailData.put("to", new String[] { email });
            emailData.put("subject", subject);
            emailData.put("html", emailContent);

            // Add inline attachment with CID
            try {
                ClassPathResource logoResource = new ClassPathResource("CRITIX_LOGO_OFFICIAL.png");
                if (logoResource.exists()) {
                    try (InputStream logoStream = logoResource.getInputStream()) {
                        byte[] logoBytes = logoStream.readAllBytes();
                        String base64Logo = Base64.getEncoder().encodeToString(logoBytes);

                        Map<String, Object> attachment = new HashMap<>();
                        attachment.put("filename", "logo.png");
                        attachment.put("content", base64Logo);
                        attachment.put("content_id", "logoIcon");
                        emailData.put("attachments", new Object[] { attachment });
                        System.out.println("Logo attached inline with CID");
                    }
                }
            } catch (Exception logoError) {
                System.err.println("Warning: Could not attach logo: " + logoError.getMessage());
            }

            RequestBody body = RequestBody.create(
                    gson.toJson(emailData),
                    MediaType.parse("application/json"));

            Request request = new Request.Builder()
                    .url("https://api.resend.com/emails")
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .addHeader("Content-Type", "application/json")
                    .post(body)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                String responseBody = response.body() != null ? response.body().string() : "No response body";

                if (!response.isSuccessful()) {
                    throw new Exception("Resend API error (HTTP " + response.code() + "): " + responseBody);
                }

                System.out.println("Email sent successfully via Resend!");
            }
        } catch (Exception e) {
            System.err.println("Resend email error: " + e.getMessage());
            e.printStackTrace();
            throw new Exception("Something went wrong while sending email: " + e.getMessage(), e);
        }
    }
}