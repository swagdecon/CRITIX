package com.popflix.auth;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.popflix.config.customExceptions.BadRequestException;
import com.popflix.config.customExceptions.TooManyRequestsException;
import com.popflix.config.customExceptions.UserAlreadyExistsException;
import com.popflix.config.customExceptions.UserAlreadyLoggedInException;
import com.popflix.service.PasswordRecoveryService;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

        private final AuthenticationService service;
        private final PasswordRecoveryService passwordRecoveryService;

        Dotenv dotenv = Dotenv.load();
        String recaptchaSecretKey = dotenv.get("RECAPTCHA_SECRET_KEY");
        JSONObject requestBody = new JSONObject();
        HttpClient client = HttpClient.newHttpClient();

        @PostMapping("/register")
        public ResponseEntity<?> register(
                        @RequestBody RegisterRequest request) {
                try {
                        return ResponseEntity.ok(service.register(request));
                } catch (UserAlreadyExistsException ex) {
                        return ResponseEntity.badRequest().body("A User With This Email Already Exists");
                }
        }

        @PostMapping("/authenticate")
        public ResponseEntity<?> authenticate(
                        @RequestBody AuthenticationRequest request, HttpServletRequest httpRequest) {
                try {
                        return ResponseEntity.ok(service.authenticate(request, httpRequest));
                } catch (UsernameNotFoundException ex) {
                        return ResponseEntity.badRequest().body("Email or Password Not Found");
                } catch (UserAlreadyLoggedInException ex) {
                        return ResponseEntity.badRequest().body("User is already logged in");
                }
        }

        @PostMapping("/refresh-token")
        public void refreshToken(
                        HttpServletRequest request, HttpServletResponse response)
                        throws StreamWriteException, DatabindException, IOException, java.io.IOException {
                service.refreshToken(request, response);

        }

        @PostMapping("/authenticate-existing-token")
        public ResponseEntity<?> authenticateExistingToken(HttpServletRequest request) {
                String authHeader = request.getHeader("Authorization");

                if (service.authenticateExistingToken(authHeader)) {
                        return ResponseEntity.ok("Token is valid");
                } else {
                        return ResponseEntity.badRequest().body("Invalid token");
                }
        }

        @PostMapping("/check-recaptcha-token")
        public String authenticateRecaptchaToken(@RequestBody RecaptchaRequest recaptchaRequest)
                        throws java.io.IOException, InterruptedException {
                String recaptchaValue = recaptchaRequest.getRecaptchaValue();

                HttpRequest request = HttpRequest.newBuilder()
                                .uri(URI.create(
                                                "https://www.google.com/recaptcha/api/siteverify"
                                                                + "?secret=" + recaptchaSecretKey
                                                                + "&response=" + recaptchaValue))
                                .method("POST", HttpRequest.BodyPublishers.noBody())
                                .build();

                HttpResponse<String> response = HttpClient.newHttpClient().send(request,
                                HttpResponse.BodyHandlers.ofString());

                return response.body();
        }

        @PostMapping("/send-password-recovery-email")
        public ResponseEntity<String> sendPasswordRecoveryEmail(@RequestBody String email) {
                try {
                        if (passwordRecoveryService.authenticateExistingEmail(email)) {
                                passwordRecoveryService.sendPasswordRecoveryEmail(email);
                                return ResponseEntity.ok("Password recovery email sent successfully");
                        } else {
                                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found");
                        }
                } catch (TooManyRequestsException e) {
                        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(e.getMessage());
                } catch (BadRequestException | UsernameNotFoundException e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body("Failed to send password recovery email");
                }
        }

        @PostMapping("/reset-password")
        public void resetPassword(@RequestBody Map<String, String> requestBody) {
                String encrypedEmail = requestBody.get("emaiL");
                String newPassword = requestBody.get("password");
                passwordRecoveryService.resetUserPwd(encrypedEmail, newPassword);
        }
}