package com.popflix.config;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import io.github.cdimascio.dotenv.Dotenv;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@ExtendWith(MockitoExtension.class)
public class JwtServiceTest {

    private JwtService jwtService;

    @Mock
    private UserDetails userDetails;

    private final Long mockJwtExpiration = 1500L;

    @BeforeEach
    public void setup() {
        jwtService = new JwtService();

        Dotenv dotenv = Dotenv.load();
        String SECRET_KEY = dotenv.get("SECRET_KEY");
        Long jwtExpiration = Long.parseLong(dotenv.get("SECRET_KEY_EXPIRATION"));
        Long refreshExpiration = Long.parseLong(dotenv.get("REFRESH_TOKEN_EXPIRATION"));
        Mockito.when(userDetails.getUsername()).thenReturn("testUser");
    }

    private String generateTokenWithSubject(String subject) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("extraClaim", "value");
        return jwtService.buildToken(extraClaims, userDetails, mockJwtExpiration);
    }

    private String generateExpiredTokenWithSubject(String subject) {
        long expirationMillis = System.currentTimeMillis() - 10000L; // Set expiration to 10 seconds ago
        return generateTokenWithExpiration(subject, expirationMillis);
    }

    private String generateTokenWithExpiration(String subject, long expirationMillis) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("extraClaim", "value");
        return jwtService.buildToken(extraClaims, userDetails, expirationMillis);
    }

    @Test
    public void testExtractUsername() {
        String token = generateTokenWithSubject("testUser");
        String extractedUsername = jwtService.extractUsername(token);
        Assertions.assertEquals("testUser", extractedUsername);
    }

    @Test
    public void testGenerateToken() {
        String token = jwtService.generateToken(userDetails);
        Assertions.assertNotNull(token);
        Assertions.assertTrue(token.length() > 0);
    }

    @Test
    public void testGenerateRefreshToken() {
        String refreshToken = jwtService.generateRefreshToken(userDetails);
        Assertions.assertNotNull(refreshToken);
        Assertions.assertTrue(refreshToken.length() > 0);
    }

    @Test
    public void testIsTokenValid() {
        String token = generateTokenWithSubject("testUser");
        boolean isValid = jwtService.isTokenValid(token, userDetails);
        Assertions.assertTrue(isValid);
    }

    @Test
    public void testIsTokenNonExpired() {
        String expiredToken = generateExpiredTokenWithSubject("testUser");
        boolean isExpired = jwtService.isTokenExpired(expiredToken);
        Assertions.assertFalse(isExpired);
    }

    // @Test
    // public void testTokenExpiration() {
    // String validToken = generateTokenWithExpiration(3600L);
    // boolean isExpired = jwtService.isTokenExpired(validToken);
    // Assertions.assertFalse(isExpired);

    // String expiredToken = generateTokenWithExpiration(-3599L);
    // isExpired = jwtService.isTokenExpired(expiredToken);
    // Assertions.assertTrue(isExpired);
    // }

    // @Test
    // public void testIsTokenValidWithExpiredToken() {
    // String expiredToken = generateTokenWithExpiration(-3600L);
    // boolean isValid = jwtService.isTokenValid(expiredToken, userDetails);
    // Assertions.assertFalse(isValid);
    // }

    // private String generateTokenWithExpiration(long expirationSeconds) {
    // Map<String, Object> extraClaims = new HashMap<>();
    // extraClaims.put("extraClaim", "value");

    // Date expirationDate = new Date(System.currentTimeMillis() +
    // (expirationSeconds * 1000));

    // return jwtService.buildToken(extraClaims, userDetails, expirationSeconds *
    // 1000);
    // }
}