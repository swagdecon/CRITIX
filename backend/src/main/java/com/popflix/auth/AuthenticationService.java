package com.popflix.auth;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.popflix.config.EnvLoader;
import com.popflix.config.JwtService;
import com.popflix.config.customExceptions.TokenExpiredException;
import com.popflix.config.customExceptions.TooManyRequestsException;
import com.popflix.config.customExceptions.UserAlreadyExistsException;
import com.popflix.config.customExceptions.UserEmailNotAuthenticated;
import com.popflix.model.LoginEvents;
import com.popflix.model.Role;
import com.popflix.model.Token;
import com.popflix.model.TokenType;
import com.popflix.model.User;
import com.popflix.model.UserAuth;
import com.popflix.repository.TokenRepository;
import com.popflix.repository.UserRepository;
import com.popflix.service.EmailService;
import com.popflix.service.UserService;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
        private final UserRepository userRepository;
        private final TokenRepository tokenRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final UserService userService;
        private final AuthenticationManager authenticationManager;
        private final EmailService emailService;
        private final RestTemplate restTemplate = new RestTemplate();
        private EnvLoader envLoader = new EnvLoader();

        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        private static String AES_ALGORITHM = "AES";
        private static int KEY_SIZE = 256;
        private String DEFAULT_AVATAR_URL = envLoader.getEnv("DEFAULT_AVATAR_URL", dotenv);

        public RegistrationResponse register(RegisterRequest request) throws Exception {
                if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                        throw new UserAlreadyExistsException("A User With This Email Already Exists");
                } else {
                        UserAuth userAuth = UserAuth.builder()
                                        .accountAuthRequestDate(new Date())
                                        .emailAuthRequests(0)
                                        .passwordResetRequests(0)
                                        .passwordResetRequestDate(null)
                                        .emailResetRequests(0)
                                        .emailResetRequestDate(null)
                                        .lastLoginTime(null)
                                        .build();

                        var user = User.builder()
                                        .firstName(request.getFirstName())
                                        .lastName(request.getLastName())
                                        .email(request.getEmail())
                                        .userAuth(userAuth)
                                        .password(passwordEncoder.encode(request.getPassword()))
                                        .accountActive(false)
                                        .avatar(DEFAULT_AVATAR_URL)
                                        .role(Role.USER)
                                        .build();

                        var extraClaims = new HashMap<String, Object>();
                        extraClaims.put("firstName", request.getFirstName());
                        extraClaims.put("userId", user.getId());

                        var savedUser = userRepository.save(user);
                        var jwtToken = jwtService.generateToken(extraClaims, user);
                        var refreshToken = jwtService.generateRefreshToken(user);

                        saveAccessToken(savedUser, jwtToken);
                        saveRefreshToken(user, refreshToken);
                        AuthenticationResponse authenticationResponse = AuthenticationResponse.builder()
                                        .accessToken(jwtToken)
                                        .refreshToken(refreshToken)
                                        .build();
                        try {
                                sendPasswordAuthenticationEmail(request.getEmail());
                                return new RegistrationResponse(authenticationResponse,
                                                "Please check your email to verify your account.");
                        } catch (UserEmailNotAuthenticated e) {
                                e.printStackTrace();
                                throw new UserEmailNotAuthenticated("Failed to send authentication email.");
                        }

                }
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletRequest httpRequest) {
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UsernameNotFoundException("Email or Password Not Found"));

                if (user.getAccountActive()) {
                        try {

                                Date loginTime = new Date();
                                user.setLoggedIn(true);
                                user.getUserAuth().setLastLoginTime(loginTime);

                                LoginEvents loginEvents = user.getLoginEvents();

                                if (loginEvents == null) {
                                        loginEvents = new LoginEvents();
                                        user.setLoginEvents(loginEvents);
                                }

                                List<Date> timestamps = loginEvents.getTimestamps();

                                if (timestamps == null) {
                                        timestamps = new ArrayList<>();
                                }

                                timestamps.add(loginTime);
                                loginEvents.setTimestamps(timestamps);

                                userService.updateLoginCounts(loginEvents, loginTime);

                                userRepository.save(user);
                                String firstName = user.getFirstName();
                                var extraClaims = new HashMap<String, Object>();
                                extraClaims.put("firstName", firstName);
                                extraClaims.put("userId", user.getId());

                                authenticationManager.authenticate(
                                                new UsernamePasswordAuthenticationToken(
                                                                request.getEmail(),
                                                                request.getPassword()));

                                var accessToken = jwtService.generateToken(extraClaims, user);
                                var refreshToken = jwtService.generateRefreshToken(user,
                                                user.getUserAuth().getLastLoginTime());
                                revokeAllUserTokens(user);
                                saveAccessToken(user, accessToken);
                                saveRefreshToken(user, refreshToken);
                                return AuthenticationResponse.builder()
                                                .accessToken(accessToken)
                                                .refreshToken(refreshToken)
                                                .build();
                        } catch (Exception e) {
                                System.out.println(e);
                                return null;
                        }
                } else {
                        throw new UserEmailNotAuthenticated("Please check your email to verify your account");
                }
        }

        public boolean authenticateExistingToken(String authHeader) {

                String accessToken = authHeader.substring(7);
                String userEmail = jwtService.extractUsername(accessToken);
                var user = userRepository.findByEmail(userEmail).orElse(null);

                return (user != null && jwtService.isTokenValid(accessToken, user));
        }

        public boolean authenticateExistingEmail(String email) {
                String userEmail = email;
                var user = userRepository.findByEmail(userEmail).orElse(null);
                return user != null;
        }

        public boolean isAuthLinkExpired(Date lastResetPwdTime) {
                if (lastResetPwdTime == null) {
                        return true;
                }

                long currentTimeMillis = System.currentTimeMillis();
                long lastResetPwdTimeMillis = lastResetPwdTime.getTime();
                long timeElapsedMinutes = (currentTimeMillis - lastResetPwdTimeMillis) / (1000 * 60);

                return timeElapsedMinutes >= 30;
        }

        public String decryptToken(String encryptedToken) throws Exception {
                // Split the key and encrypted data
                String[] parts = encryptedToken.split(":");
                String keyString = parts[0];
                String encryptedEmail = parts[1];

                // Decode the key
                byte[] keyBytes = Base64.getUrlDecoder().decode(keyString);
                SecretKey secretKey = new SecretKeySpec(keyBytes, AES_ALGORITHM);

                // Decrypt using the key
                Cipher cipher = Cipher.getInstance(AES_ALGORITHM);
                cipher.init(Cipher.DECRYPT_MODE, secretKey);

                byte[] decryptedBytes = cipher.doFinal(Base64.getUrlDecoder().decode(encryptedEmail));
                return new String(decryptedBytes, StandardCharsets.UTF_8);
        }

        public void activateAccount(String encryptedEmail) throws Exception {
                String userEmail = decryptToken(encryptedEmail);
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new UsernameNotFoundException("Email or Password Not Found"));
                Boolean isExpired = isAuthLinkExpired(user.getUserAuth().getAccountAuthRequestDate());

                if (!isExpired) {
                        user.setAccountActive(true);
                        userRepository.save(user);
                } else {
                        throw new TokenExpiredException("This link is no longer valid, please try again.");
                }
        }

        public String encryptEmail(String email) throws Exception {
                SecretKey secretKey = generateSecretKey();
                Cipher cipher = Cipher.getInstance(AES_ALGORITHM);
                cipher.init(Cipher.ENCRYPT_MODE, secretKey);

                byte[] encryptedBytes = cipher.doFinal(email.getBytes(StandardCharsets.UTF_8));
                String encryptedToken = Base64.getUrlEncoder().withoutPadding().encodeToString(encryptedBytes);

                // Include the key in the token
                String keyString = Base64.getUrlEncoder().withoutPadding().encodeToString(secretKey.getEncoded());
                encryptedToken = keyString + ":" + encryptedToken;

                return encryptedToken;
        }

        public void sendPasswordAuthenticationEmail(String email) throws Exception {
                try {
                        User user = userRepository.findByEmail(email)
                                        .orElseThrow(() -> new UsernameNotFoundException(
                                                        "Email or Password Not Found"));
                        Integer emailCount = user.getUserAuth().getEmailAuthRequests();

                        if (emailCount == null) {
                                emailCount = 1;
                        }
                        user.getUserAuth().setEmailAuthRequests(emailCount);

                        emailCount = user.getUserAuth().getEmailAuthRequests();

                        if (emailCount <= 5) {
                                String encryptedEmailToken = encryptEmail(email);
                                String emailContent = String.format(
                                                "<html>"
                                                                + "<body style='background-color: black; color: white; font-family: Arial, sans-serif;'>"
                                                                + "<div style='text-align: center; padding: 20px;'>"
                                                                + "<img src='cid:logoIcon' alt='Popflix Logo' style='max-width: 200px;' />"
                                                                + "<h1>Activate Your Account</h1>"
                                                                + "<p>Dear user,</p>"
                                                                + "<p>To authenticate your account, click <a href='http:/localhost:3000/activate-account/%s' style='color: white;'>here</a>.</p>"
                                                                + "<p>If you didn't authorize this request, kindly ignore this email.</p>"
                                                                + "<p>Thanks for your support!<br/>The POPFLIX team</p>"
                                                                + "</div>"
                                                                + "</body>"
                                                                + "</html>",
                                                encryptedEmailToken);

                                emailService.sendEmail(email, "Activate your account", emailContent);
                                emailCount += 1;
                                user.getUserAuth().setAccountAuthRequestDate(new Date());
                                userRepository.save(user);
                        } else {
                                throw new TooManyRequestsException("Too many requests, please try again later.");
                        }
                } catch (Exception e) {
                        System.out.println(e);
                        throw new Exception("There was an error sending your account activation email.");
                }
        }

        @Scheduled(fixedRate = 3600000)
        public void resetAuthLinkRetryCount() {
                try {
                        // Find users with reset requests
                        List<User> users = userRepository.findUsersWithResetRequests();
                        // Reset password retry count for each user
                        for (User user : users) {
                                user.getUserAuth().setPasswordResetRequests(0);
                                user.getUserAuth().setEmailResetRequests(0);
                                userRepository.save(user);
                        }
                } catch (Exception e) {
                        e.printStackTrace();
                }
        }

        public User getUserDetails(String authHeader) throws Exception {
                try {
                        String accessToken = authHeader.substring(7);
                        String userEmail = jwtService.extractUsername(accessToken);
                        var user = userRepository.findByEmail(userEmail).orElse(null);

                        return user;
                } catch (Exception e) {
                        throw new Exception("User Not Found");
                }
        }

        public static SecretKey generateSecretKey() throws Exception {
                KeyGenerator keyGenerator = KeyGenerator.getInstance(AES_ALGORITHM);
                keyGenerator.init(KEY_SIZE);
                return keyGenerator.generateKey();
        }

        public void revokeAllUserTokens(User user) {
                var validUserTokens = tokenRepository.findAllValidTokensByUser(user.getId());
                if (validUserTokens.isEmpty())
                        return;
                validUserTokens.forEach(t -> {
                        t.setExpired(true);
                        t.setRevoked(true);
                });
                tokenRepository.saveAll(validUserTokens);
        }

        public void saveAccessToken(User user, String accessToken) {
                var token = Token.builder()
                                .user(user)
                                .userId(user.getId())
                                .token(accessToken)
                                .tokenType(TokenType.BEARER)
                                .expired(false)
                                .revoked(false)
                                .build();
                tokenRepository.save(token);
        }

        public void saveRefreshToken(User user, String refreshToken) {
                var token = Token.builder()
                                .user(user)
                                .userId(user.getId())
                                .token(refreshToken)
                                .tokenType(TokenType.REFRESH)
                                .expired(false)
                                .revoked(false)
                                .build();
                tokenRepository.save(token);
        }

        public JsonNode refreshToken(
                        HttpServletRequest request,
                        HttpServletResponse response)
                        throws IOException, JsonProcessingException {
                final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
                final String refreshToken;
                final String userEmail;

                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                        return null; // Returning null since JsonNode cannot be null
                }

                refreshToken = authHeader.substring(7);
                userEmail = jwtService.extractUsername(refreshToken);

                if (userEmail != null) {
                        var user = userRepository.findByEmail(userEmail)
                                        .orElseThrow();

                        if (jwtService.isTokenValid(refreshToken, user)) {
                                revokeAllUserTokens(user);

                                var extraClaims = new HashMap<String, Object>();
                                extraClaims.put("firstName", user.getFirstName());
                                extraClaims.put("userId", user.getId());
                                var accessToken = jwtService.generateToken(extraClaims, user);

                                var newRefreshToken = jwtService.generateRefreshToken(user,
                                                user.getUserAuth().getLastLoginTime());
                                saveAccessToken(user, accessToken);
                                saveRefreshToken(user, newRefreshToken);

                                var authResponse = AuthenticationResponse.builder()
                                                .accessToken(accessToken)
                                                .refreshToken(newRefreshToken)
                                                .build();

                                // Convert AuthenticationResponse to JsonNode
                                ObjectMapper mapper = new ObjectMapper();
                                String authResponseJson = mapper.writeValueAsString(authResponse);

                                return mapper.readTree(authResponseJson);
                        }
                }
                return null;
        }

        public void sendPasswordRecoveryEmail(String email) throws Exception {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException("Email or Password Not Found"));
                Integer resetCount = user.getUserAuth().getPasswordResetRequests();
                if (resetCount == null) {
                        resetCount = 1;
                }
                user.getUserAuth().setPasswordResetRequests(resetCount);
                resetCount = user.getUserAuth().getPasswordResetRequests();

                if (resetCount <= 3) {
                        String encryptedEmailToken = encryptEmail(email);

                        String emailContent = "<html>"
                                        + "<body style='background-color: black; color: white; font-family: Arial, sans-serif;'>"
                                        + "<div style='text-align: center; padding: 20px;'>"
                                        + "<img src='cid:logoIcon' alt='Popflix Logo' style='max-width: 200px;' />"
                                        + "<h1>Password Reset Request</h1>"
                                        + "<p>Dear user,</p>"
                                        + "<p>To reset your password, click <a href='http:/localhost:3000/reset-password/"
                                        + encryptedEmailToken + "' style='color: white;'>here</a>.</p>"
                                        + "<p>If you didn't authorize this request, kindly ignore this email.</p>"
                                        + "<p>Thanks for your support!<br/>The POPFLIX team</p>"
                                        + "</div>"
                                        + "</body>"
                                        + "</html>";

                        emailService.sendEmail(email, "Password Reset Request", emailContent);

                        user.getUserAuth().setPasswordResetRequestDate(new Date());
                        resetCount += 1;
                        user.getUserAuth().setPasswordResetRequests(resetCount);
                        userRepository.save(user);
                } else {
                        throw new TooManyRequestsException("Too many requests, please try again later.");
                }
        }

        public void resetUserPwd(String encryptedEmail, String newPassword) throws Exception {
                String userEmail = decryptToken(encryptedEmail);
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new UsernameNotFoundException("Email or Password Not Found"));

                Boolean isExpired = isAuthLinkExpired(user.getUserAuth().getPasswordResetRequestDate());

                if (!isExpired) {
                        var encodedPassword = passwordEncoder.encode(newPassword);
                        user.setPassword(encodedPassword);
                        userRepository.save(user);
                } else {
                        throw new TokenExpiredException("This link is no longer valid, please try again.");
                }
        }

        public void sendRecoveryEmail(String currentEmail) throws Exception {
                User user = userRepository.findByEmail(currentEmail)
                                .orElseThrow(() -> new UsernameNotFoundException("Email Not Found"));

                Integer resetCount = user.getUserAuth().getEmailResetRequests();
                if (resetCount == null) {
                        resetCount = 1;
                }
                user.getUserAuth().setEmailResetRequests(resetCount);
                resetCount = user.getUserAuth().getEmailResetRequests();

                if (resetCount <= 3) {
                        String encryptedEmailToken = encryptEmail(currentEmail);

                        String emailContent = "<html>"
                                        + "<body style='background-color: black; color: white; font-family: Arial, sans-serif;'>"
                                        + "<div style='text-align: center; padding: 20px;'>"
                                        + "<img src='cid:logoIcon' alt='Popflix Logo' style='max-width: 200px;' />"
                                        + "<h1>Email Change Request</h1>"
                                        + "<p>Dear user,</p>"
                                        + "<p>To reset your email, click <a href='http:/localhost:3000/reset-email/"
                                        + encryptedEmailToken + "' style='color: white;'>here</a>.</p>"
                                        + "<p>If you didn't authorize this request, kindly ignore this email.</p>"
                                        + "<p>Thanks for your support!<br/>The POPFLIX team</p>"
                                        + "</div>"
                                        + "</body>"
                                        + "</html>";

                        emailService.sendEmail(currentEmail, "Email Change Request", emailContent);

                        user.getUserAuth().setEmailResetRequestDate(new Date());
                        resetCount += 1;
                        user.getUserAuth().setEmailResetRequests(resetCount);
                        userRepository.save(user);
                } else {
                        throw new TooManyRequestsException("Too many requests, please try again later.");
                }
        }

        public void updateEmail(String currentEmail, String newEmail) throws Exception {
                String currentUserEmail = decryptToken(currentEmail);
                if (currentUserEmail == newEmail) {
                        throw new Error("New User Email cannot be existing email");
                }

                if (currentEmail != null && newEmail != null) {
                        User user = userRepository.findByEmail(currentUserEmail)
                                        .orElseThrow(() -> new UsernameNotFoundException(
                                                        "Email or Password Not Found"));
                        user.setEmail(newEmail);
                        userRepository.save(user);
                } else {
                        throw new Error("Something went wrong with updating the users email address");
                }
        }

        public ResponseEntity<ByteArrayResource> proxyImage(@RequestParam String url) {
                try {
                        // Create headers and HttpEntity
                        HttpHeaders headers = new HttpHeaders();
                        headers.set("Accept", "*/*"); // Accept any type of content
                        HttpEntity<String> entity = new HttpEntity<>(headers);

                        // Fetch the image from the external URL
                        ResponseEntity<byte[]> response = restTemplate.exchange(url, HttpMethod.GET, entity,
                                        byte[].class);

                        // Prepare the response with appropriate headers
                        HttpHeaders responseHeaders = new HttpHeaders();
                        responseHeaders.setContentType(response.getHeaders().getContentType());
                        ByteArrayResource resource = new ByteArrayResource(response.getBody());

                        return new ResponseEntity<>(resource, responseHeaders, response.getStatusCode());
                } catch (Exception e) {
                        // Handle errors
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                }
        }
}
