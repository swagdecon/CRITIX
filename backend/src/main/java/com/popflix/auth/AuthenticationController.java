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
import com.fasterxml.jackson.databind.JsonNode;
import com.popflix.config.customExceptions.BadRequestException;
import com.popflix.config.customExceptions.ErrSendEmail;
import com.popflix.config.customExceptions.TokenExpiredException;
import com.popflix.config.customExceptions.TooManyRequestsException;
import com.popflix.config.customExceptions.UserAlreadyExistsException;
import com.popflix.config.customExceptions.UserAlreadyLoggedInException;
import com.popflix.config.customExceptions.UserEmailNotAuthenticated;
import com.popflix.service.PasswordService;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

        private final AuthenticationService authService;
        private final PasswordService passwordService;

        Dotenv dotenv = Dotenv.load();
        String recaptchaSecretKey = dotenv.get("RECAPTCHA_SECRET_KEY");
        JSONObject requestBody = new JSONObject();
        HttpClient client = HttpClient.newHttpClient();

        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
                try {
                        RegistrationResponse registrationResponse = authService.register(request);
                        return ResponseEntity.ok(registrationResponse);
                } catch (UserEmailNotAuthenticated e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                } catch (UserAlreadyExistsException e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                } catch (ErrSendEmail e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                } catch (Exception e) {
                        System.out.println(e);
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body("An error occurred during registration");
                }
        }

        @PostMapping("/authenticate")
        public ResponseEntity<?> authenticate(
                        @RequestBody AuthenticationRequest request, HttpServletRequest httpRequest) {
                try {
                        return ResponseEntity.ok(authService.authenticate(request, httpRequest));
                } catch (UsernameNotFoundException e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                } catch (UserAlreadyLoggedInException e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(e.getMessage());
                }
        }

        @PostMapping("/refresh-token")
        public JsonNode refreshToken(
                        HttpServletRequest request, HttpServletResponse response)
                        throws StreamWriteException, DatabindException, IOException, java.io.IOException {
                return authService.refreshToken(request, response);

        }

        @PostMapping("/authenticate-existing-token")
        public ResponseEntity<?> authenticateExistingToken(HttpServletRequest request) {
                String authHeader = request.getHeader("Authorization");

                if (authService.authenticateExistingToken(authHeader)) {
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

        @PostMapping("/send-password-authentication-email")
        public ResponseEntity<String> sendPasswordAuthenticationEmail(@RequestBody Map<String, String> requestBody) {
                if (requestBody == null || requestBody.get("email") == null || requestBody.get("email").isEmpty()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email cannot be empty or null");
                } else {
                        String email = requestBody.get("email");

                        // Regular expression for basic email format validation
                        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
                        Pattern pattern = Pattern.compile(emailRegex);
                        Matcher matcher = pattern.matcher(email);

                        if (!matcher.matches()) {
                                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email format");
                        }

                        try {
                                authService.sendPasswordAuthenticationEmail(email);
                                return ResponseEntity.ok("Please check your email to confirm your account");
                        } catch (Exception e) {
                                e.printStackTrace();
                                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
                        }
                }
        }

        @PostMapping("/activate-account")
        public ResponseEntity<String> activateAccount(@RequestBody String encrypedEmail) {
                try {
                        authService.activateAccount(encrypedEmail);
                        return ResponseEntity.ok("Account Activated.");
                } catch (TokenExpiredException e) {
                        return ResponseEntity.status(HttpStatus.GONE)
                                        .body(e.getMessage());
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(e.getMessage());
                }
        }

        @PostMapping("/send-password-recovery-email")
        public ResponseEntity<String> sendPasswordRecoveryEmail(@RequestBody String email) {
                try {
                        if (authService.authenticateExistingEmail(email)) {
                                passwordService.sendPasswordRecoveryEmail(email);
                                return ResponseEntity.ok("Password recovery email sent successfully.");
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
                                        .body(e.getMessage());
                }
        }

        @PostMapping("/reset-password")
        public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> requestBody) {
                try {
                        String encrypedEmail = requestBody.get("emaiL");
                        String newPassword = requestBody.get("password");
                        passwordService.resetUserPwd(encrypedEmail, newPassword);
                        return ResponseEntity.ok("Password successfully updated.");
                } catch (TokenExpiredException e) {
                        return ResponseEntity.status(HttpStatus.GONE)
                                        .body(e.getMessage());
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body("Something went wrong, please try again.");
                }
        }
}