package com.critix.config;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import com.critix.config.JwtService;

import java.util.HashMap;
import java.util.Map;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    private JwtService jwtService;

    @Mock
    private UserDetails userDetails;

    private final Long mockJwtExpiration = 1500L;

    @BeforeEach
    public void setup() {
        jwtService = new JwtService();
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
    void testExtractUsername() {
        String token = generateTokenWithSubject("testUser");
        String extractedUsername = jwtService.extractUsername(token);
        Assertions.assertEquals("testUser", extractedUsername);
    }

    @Test
    void testGenerateToken() {
        String token = jwtService.generateToken(userDetails);
        Assertions.assertNotNull(token);
        Assertions.assertTrue(token.length() > 0);
    }

    @Test
    void testGenerateRefreshToken() {
        String refreshToken = jwtService.generateRefreshToken(userDetails);
        Assertions.assertNotNull(refreshToken);
        Assertions.assertTrue(refreshToken.length() > 0);
    }

    @Test
    void testIsTokenValid() {
        String token = generateTokenWithSubject("testUser");
        boolean isValid = jwtService.isTokenValid(token, userDetails);
        Assertions.assertTrue(isValid);
    }

    @Test
    void testIsTokenNonExpired() {
        String expiredToken = generateExpiredTokenWithSubject("testUser");
        boolean isExpired = jwtService.isTokenExpired(expiredToken);
        Assertions.assertFalse(isExpired);
    }
}