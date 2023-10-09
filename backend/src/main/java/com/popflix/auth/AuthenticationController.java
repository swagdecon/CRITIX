package com.popflix.auth;

import lombok.RequiredArgsConstructor;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.popflix.config.customExceptions.UserAlreadyExistsException;
import com.popflix.config.customExceptions.UserAlreadyLoggedInException;
import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

        private final AuthenticationService service;

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
                Dotenv dotenv = Dotenv.load();
                String recaptchaKey = dotenv.get("RECAPTCHA_SECRET_KEY");
                String recaptchaValue = recaptchaRequest.getRecaptchaValue();
                String recaptchaSecretKey = recaptchaKey;
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

        @PostMapping("/password-recovery-email")
        public HttpResponse<String> sendPasswordRecoveryEmail(@RequestBody String username)
                        throws java.io.IOException, InterruptedException {
                HttpClient client = HttpClient.newHttpClient();

                String requestBody = "{\"userName\": \"" + username + "\", " +
                                "\"account\": \"Popflix\", " +
                                "\"projectFullName\": \"POPFLIX\", " +
                                "\"subject\": \"Please reset your POPFLIX password\", " +
                                "\"redirectUrl\": \"https://forio.com/app/acme-simulations/supply-chain-game\"}";

                HttpRequest request = HttpRequest.newBuilder()
                                .uri(URI.create("https://api.forio.com/v2/password/recovery"))
                                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                                .setHeader("Content-Type", "application/json")
                                .build();

                return client.send(request, HttpResponse.BodyHandlers.ofString());
        }

        @PostMapping("/password-reset")
        public HttpResponse<String> resetUserPassword(@RequestBody String password, String recoveryToken)
                        throws java.io.IOException, InterruptedException {
                HttpClient client = HttpClient.newHttpClient();

                String requestBody = "{\"password\": \"" + password + "\"}";

                HttpRequest request = HttpRequest.newBuilder()
                                .uri(URI.create("https://api.forio.com/v2/password/set/" + recoveryToken))
                                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                                .setHeader("Content-Type", "application/json")
                                .build();

                return client.send(request, HttpResponse.BodyHandlers.ofString());
        }

}