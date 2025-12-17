package com.critix.service;

import java.io.File;
import java.nio.file.Files;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

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
            System.out.println("=== RESEND EMAIL DEBUG ===");
            System.out.println("To: " + email);
            System.out.println("From: " + fromEmail);
            System.out.println("Subject: " + subject);
            System.out.println("API Key present: " + (apiKey != null && !apiKey.isEmpty()));
            System.out.println("=========================");

            Map<String, Object> emailData = new HashMap<>();
            emailData.put("from", "CRITIX <" + fromEmail + ">");
            emailData.put("to", new String[] { email });
            emailData.put("subject", subject);

            String finalEmailContent = emailContent;
            File logoFile = new File("src/main/resources/CRITIX_LOGO_OFFICIAL.png");

            if (logoFile.exists()) {
                try {
                    byte[] logoBytes = Files.readAllBytes(logoFile.toPath());
                    String base64Logo = Base64.getEncoder().encodeToString(logoBytes);

                    finalEmailContent = emailContent.replace(
                            "src='cid:logoIcon'",
                            "src='data:image/png;base64," + base64Logo + "'");

                    System.out.println("Logo embedded successfully");
                } catch (Exception logoError) {
                    System.err.println("Warning: Could not embed logo: " + logoError.getMessage());
                    finalEmailContent = emailContent.replaceAll("<img[^>]*cid:logoIcon[^>]*>", "");
                }
            } else {
                System.out.println("Logo file not found at: " + logoFile.getAbsolutePath());
                finalEmailContent = emailContent.replaceAll("<img[^>]*cid:logoIcon[^>]*>", "");
            }

            emailData.put("html", finalEmailContent);

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

                System.out.println("Resend API response code: " + response.code());
                System.out.println("Resend API response: " + responseBody);

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