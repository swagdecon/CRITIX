package com.popflix.auth;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.http.HttpHeaders;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.popflix.config.JwtService;
import com.popflix.config.customExceptions.BadRequestException;
import com.popflix.config.customExceptions.ErrSendEmail;
import com.popflix.config.customExceptions.TokenExpiredException;
import com.popflix.config.customExceptions.TooManyRequestsException;
import com.popflix.config.customExceptions.UserAlreadyExistsException;
import com.popflix.config.customExceptions.UserEmailNotAuthenticated;
import com.popflix.model.Role;
import com.popflix.model.Token;
import com.popflix.model.TokenType;
import com.popflix.model.User;
import com.popflix.repository.TokenRepository;
import com.popflix.repository.UserRepository;
import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.io.IOException;
import jakarta.mail.internet.MimeMessage;
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
        private final AuthenticationManager authenticationManager;
        private final JavaMailSender javaMailSender;

        static Dotenv dotenv = Dotenv.load();

        private static String AES_ALGORITHM = "AES";
        private static int KEY_SIZE = 256;

        private String DEFAULT_AVATAR_URL = dotenv.get("DEFAULT_AVATAR_URL");

        public RegistrationResponse register(RegisterRequest request) throws Exception {

                if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                        throw new UserAlreadyExistsException("A User With This Email Already Exists");
                }

                var user = User.builder()
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .email(request.getEmail())
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
                } catch (UserEmailNotAuthenticated e) {
                        e.printStackTrace();
                        throw new UserEmailNotAuthenticated("Failed to send authentication email.");

                }

                return new RegistrationResponse(authenticationResponse,
                                "Please check your email to verify your account.");
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletRequest httpRequest) {
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UsernameNotFoundException("Email or Password Not Found"));

                if (user.getAccountActive()) {
                        Date lastLoginTime = new Date();
                        user.setLoggedIn(true);
                        user.setLastLoginTime(lastLoginTime);
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
                        var refreshToken = jwtService.generateRefreshToken(user, user.getLastLoginTime());
                        revokeAllUserTokens(user);
                        saveAccessToken(user, accessToken);
                        saveRefreshToken(user, refreshToken);
                        return AuthenticationResponse.builder()
                                        .accessToken(accessToken)
                                        .refreshToken(refreshToken)
                                        .build();
                } else {
                        throw new UserEmailNotAuthenticated("Please check your email to verify your account");
                }
        }

        public boolean authenticateExistingToken(String authHeader) {

                String accessToken = authHeader.substring(7);
                String userEmail = jwtService.extractUsername(accessToken);
                var user = this.userRepository.findByEmail(userEmail).orElse(null);

                return (user != null && jwtService.isTokenValid(accessToken, user)) ? true : false;
        }

        public boolean authenticateExistingEmail(String email) {
                String userEmail = email;
                var user = this.userRepository.findByEmail(userEmail).orElse(null);
                return user != null;
        }

        public boolean isAuthLinkExpired(Date lastResetPwdTime) {
                if (lastResetPwdTime == null) {
                        return true;
                }

                long currentTimeMillis = System.currentTimeMillis();
                long lastResetPwdTimeMillis = lastResetPwdTime.getTime();
                long timeElapsedMinutes = (currentTimeMillis - lastResetPwdTimeMillis) / (1000 * 60);

                return timeElapsedMinutes > 1;
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
                Boolean isExpired = isAuthLinkExpired(user.getAccountAuthRequestDate());

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
                        Integer emailCount = user.getEmailAuthRequests();

                        if (user != null) {
                                throw new ErrSendEmail("TEST");
                        }
                        if (emailCount != null) {
                                emailCount += 1;
                        } else {
                                emailCount = 1;
                        }
                        user.setEmailAuthRequests(emailCount);
                        emailCount = user.getEmailAuthRequests();

                        if (emailCount <= 3) {
                                String encryptedEmailToken = encryptEmail(email);
                                MimeMessage message = javaMailSender.createMimeMessage();
                                MimeMessageHelper helper = new MimeMessageHelper(message, true);
                                String emailText = String.format(
                                                "Dear user, to authenticate your account, click the following link: http:/localhost:3000/activate-account/%s%n"
                                                                + "If you didn't authorize this request, kindly ignore this email.%n"
                                                                + "Thanks for your support!%n"
                                                                + "The POPFLIX team",
                                                encryptedEmailToken);

                                helper.setFrom("POPFLIX <popflix.help@gmail.com>");
                                helper.setTo(email);
                                helper.setSubject("Activate your account");
                                helper.setText(emailText);
                                user.setAccountAuthRequestDate(new Date());

                                userRepository.save(user);
                                javaMailSender.send(message);
                        } else {
                                throw new TooManyRequestsException("Too many requests, please try again later.");
                        }
                } catch (ErrSendEmail e) {
                        throw new ErrSendEmail("There was an error sending your account activation email.");
                }
        }

        @Scheduled(fixedRate = 3600000)
        public void resetAuthLinkRetryCount() {
                try {
                        // Find users with reset requests
                        List<User> users = this.userRepository.findUsersWithResetRequests();
                        // Reset password retry count for each user
                        for (User user : users) {
                                user.setPasswordResetRequests(0);
                                userRepository.save(user);
                        }
                } catch (Exception e) {
                        e.printStackTrace();
                }
        }

        public User getUserDetails(String accessToken) {
                User user = tokenRepository.findUserByToken(accessToken);
                return user;
        }

        private static SecretKey generateSecretKey() throws Exception {
                KeyGenerator keyGenerator = KeyGenerator.getInstance(AES_ALGORITHM);
                keyGenerator.init(KEY_SIZE);
                return keyGenerator.generateKey();
        }

        private void revokeAllUserTokens(User user) {
                var validUserTokens = tokenRepository.findAllValidTokensByUser(user.getId());
                if (validUserTokens.isEmpty())
                        return;
                validUserTokens.forEach(t -> {
                        t.setExpired(true);
                        t.setRevoked(true);
                });
                tokenRepository.saveAll(validUserTokens);
        }

        private void saveAccessToken(User user, String accessToken) {
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

        private void saveRefreshToken(User user, String refreshToken) {
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

        public void refreshToken(
                        HttpServletRequest request,
                        HttpServletResponse response)
                        throws IOException, StreamWriteException, DatabindException, java.io.IOException {
                final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
                final String refreshToken;
                final String userEmail;
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                        return;
                }
                refreshToken = authHeader.substring(7);
                userEmail = jwtService.extractUsername(refreshToken);
                if (userEmail != null) {
                        var user = this.userRepository.findByEmail(userEmail)
                                        .orElseThrow();
                        if (jwtService.isTokenValid(refreshToken, user)) {
                                revokeAllUserTokens(user);
                                var accessToken = jwtService.generateToken(user);
                                var newRefreshToken = jwtService.generateRefreshToken(user, user.getLastLoginTime());

                                saveAccessToken(user, accessToken);
                                saveRefreshToken(user, newRefreshToken);
                                var authResponse = AuthenticationResponse.builder()
                                                .accessToken(accessToken)
                                                .refreshToken(newRefreshToken)
                                                .build();
                                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
                        }
                }
        }
}
