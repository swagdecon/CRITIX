// package com.popflix.config;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import org.springframework.security.core.userdetails.UserDetails;

// import io.github.cdimascio.dotenv.Dotenv;
// import io.jsonwebtoken.Claims;

// import java.security.Key;
// import java.util.*;

// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.Mockito.*;

// class JwtServiceTest {
// @Mock
// private UserDetails userDetails;

// private JwtService jwtService;
// private static Dotenv dotenv;

// @BeforeEach
// void setUp() {
// dotenv =
// Dotenv.configure().directory("backend/src/main/resources/.env").load();

// MockitoAnnotations.openMocks(this);
// jwtService = new JwtService();
// }

// @Test
// void extractUsername_shouldReturnUsernameFromToken() {
// // Arrange
// String token = "valid_token";
// String expectedUsername = "test@example.com";
// Claims claims = mock(Claims.class);
// when(jwtService.extractAllClaims(token)).thenReturn(claims);
// when(claims.getSubject()).thenReturn(expectedUsername);

// // Act
// String extractedUsername = jwtService.extractUsername(token);

// // Assert
// assertEquals(expectedUsername, extractedUsername);
// verify(jwtService).extractAllClaims(token);
// verify(claims).getSubject();
// }

// @Test
// void extractClaim_shouldReturnClaimValueFromToken() {
// // Arrange
// String token = "valid_token";
// String claimName = "claim";
// String expectedClaimValue = "value";
// Claims claims = mock(Claims.class);
// when(jwtService.extractAllClaims(token)).thenReturn(claims);
// when(claims.get(claimName)).thenReturn(expectedClaimValue);

// // Act
// Object extractedClaimValue = jwtService.extractClaim(token, c ->
// c.get(claimName));

// // Assert
// assertEquals(expectedClaimValue, extractedClaimValue);
// verify(jwtService).extractAllClaims(token);
// verify(claims).get(claimName);
// }

// @Test
// void generateToken_shouldGenerateTokenWithNoExtraClaims() {
// // Arrange
// String expectedToken = "generated_token";

// // Mock the buildToken method to return the expected token
// when(jwtService.buildToken(any(), eq(userDetails),
// anyLong())).thenReturn(expectedToken);

// // Act
// String generatedToken = jwtService.generateToken(userDetails);

// // Assert
// assertEquals(expectedToken, generatedToken);
// verify(jwtService).buildToken(any(), eq(userDetails), anyLong());
// }

// @Test
// void generateToken_shouldGenerateTokenWithExtraClaims() {
// // Arrange
// String expectedToken = "generated_token";
// Map<String, Object> extraClaims = new HashMap<>();

// // Mock the buildToken method to return the expected token
// when(jwtService.buildToken(eq(extraClaims), eq(userDetails),
// anyLong())).thenReturn(expectedToken);

// // Act
// String generatedToken = jwtService.generateToken(extraClaims, userDetails);

// // Assert
// assertEquals(expectedToken, generatedToken);
// verify(jwtService).buildToken(eq(extraClaims), eq(userDetails), anyLong());
// }

// @Test
// void generateRefreshToken_shouldGenerateRefreshToken() {
// // Arrange
// String expectedRefreshToken = "refresh_token";

// // Mock the buildToken method to return the expected refresh token
// when(jwtService.buildToken(any(), eq(userDetails),
// anyLong())).thenReturn(expectedRefreshToken);

// // Act
// String generatedRefreshToken = jwtService.generateRefreshToken(userDetails);

// // Assert
// assertEquals(expectedRefreshToken, generatedRefreshToken);
// verify(jwtService).buildToken(any(), eq(userDetails), anyLong());
// }

// @Test
// void isTokenValid_withValidTokenAndMatchingUserDetails_shouldReturnTrue() {
// // Arrange
// String token = "valid_token";
// String username = "test@example.com";
// when(jwtService.extractUsername(token)).thenReturn(username);
// when(userDetails.getUsername()).thenReturn(username);
// when(jwtService.isTokenExpired(token)).thenReturn(false);

// // Act
// boolean isValid = jwtService.isTokenValid(token, userDetails);

// // Assert
// assertTrue(isValid);
// verify(jwtService).extractUsername(token);
// verify(jwtService).isTokenExpired(token);
// verify(userDetails).getUsername();
// }

// @Test
// void isTokenValid_withExpiredToken_shouldReturnFalse() {
// // Arrange
// String token = "expired_token";
// when(jwtService.isTokenExpired(token)).thenReturn(true);

// // Act
// boolean isValid = jwtService.isTokenValid(token, userDetails);

// // Assert
// assertFalse(isValid);
// verify(jwtService).isTokenExpired(token);
// verifyNoInteractions(jwtService, userDetails);
// }

// @Test
// void isTokenValid_withInvalidUsername_shouldReturnFalse() {
// // Arrange
// String token = "valid_token";
// String tokenUsername = "invalid@example.com";
// String userDetailsUsername = "test@example.com";
// when(jwtService.extractUsername(token)).thenReturn(tokenUsername);
// when(userDetails.getUsername()).thenReturn(userDetailsUsername);
// when(jwtService.isTokenExpired(token)).thenReturn(false);

// // Act
// boolean isValid = jwtService.isTokenValid(token, userDetails);

// // Assert
// assertFalse(isValid);
// verify(jwtService).extractUsername(token);
// verify(jwtService).isTokenExpired(token);
// verify(userDetails).getUsername();
// }

// @Test
// void isTokenExpired_withValidTokenNotExpired_shouldReturnFalse() {
// // Arrange
// String token = "valid_token";
// Date expirationDate = new Date(System.currentTimeMillis() + 10000);
// when(jwtService.extractExpiration(token)).thenReturn(expirationDate);
// Date currentDate = new Date();

// // Act
// boolean isExpired = jwtService.isTokenExpired(token);

// // Assert
// assertFalse(isExpired);
// verify(jwtService).extractExpiration(token);
// verifyNoMoreInteractions(jwtService);
// }

// @Test
// void isTokenExpired_withExpiredToken_shouldReturnTrue() {
// // Arrange
// String token = "expired_token";
// Date expirationDate = new Date(System.currentTimeMillis() - 10000);
// when(jwtService.extractExpiration(token)).thenReturn(expirationDate);
// Date currentDate = new Date();

// // Act
// boolean isExpired = jwtService.isTokenExpired(token);

// // Assert
// assertTrue(isExpired);
// verify(jwtService).extractExpiration(token);
// verifyNoMoreInteractions(jwtService);
// }

// @Test
// void extractExpiration_shouldReturnExpirationDateFromToken() {
// // Arrange
// String token = "valid_token";
// Date expectedExpirationDate = new Date(System.currentTimeMillis() + 10000);
// Claims claims = mock(Claims.class);
// when(jwtService.extractAllClaims(token)).thenReturn(claims);
// when(claims.getExpiration()).thenReturn(expectedExpirationDate);

// // Act
// Date extractedExpirationDate = jwtService.extractExpiration(token);

// // Assert
// assertEquals(expectedExpirationDate, extractedExpirationDate);
// verify(jwtService).extractAllClaims(token);
// verify(claims).getExpiration();
// }

// // Additional test cases can be added for edge cases and other scenarios
// }
