package com.popflix.auth;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.popflix.config.JwtService;
import com.popflix.config.customExceptions.UserAlreadyExistsException;
import com.popflix.config.customExceptions.UserAlreadyLoggedInException;
import com.popflix.model.Role;
import com.popflix.model.Token;
import com.popflix.model.TokenType;
import com.popflix.model.User;
import com.popflix.repository.TokenRepository;
import com.popflix.repository.UserRepository;

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
        private final AuthenticationManager authenticationManager;
        Dotenv dotenv = Dotenv.load();
        private String DEFAULT_AVATAR_URL = dotenv.get("DEFAULT_AVATAR_URL");

        public AuthenticationResponse register(RegisterRequest request) {

                if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                        throw new UserAlreadyExistsException("A User With This Email Already Exists");
                }

                var user = User.builder()
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
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
                return AuthenticationResponse.builder()
                                .accessToken(jwtToken)
                                .refreshToken(refreshToken)
                                .build();
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletRequest httpRequest) {
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UsernameNotFoundException("Email or Password Not Found"));
                // if (user.getLoggedIn()) {
                // throw new UserAlreadyLoggedInException("This User is already logged in");
                // }
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
        }

        public boolean authenticateExistingToken(String authHeader) {

                String accessToken = authHeader.substring(7);
                String userEmail = jwtService.extractUsername(accessToken);
                var user = this.userRepository.findByEmail(userEmail).orElse(null);

                if (user != null && jwtService.isTokenValid(accessToken, user)) {
                        return true;
                } else {
                        return false;
                }
        }

        public User getUserDetails(String accessToken) {
                User user = tokenRepository.findUserByToken(accessToken);
                return user;
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
