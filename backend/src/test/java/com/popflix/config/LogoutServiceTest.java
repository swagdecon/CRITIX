package com.popflix.config;

import com.popflix.model.Token;
import com.popflix.model.User;
import com.popflix.repository.TokenRepository;
import com.popflix.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.openMocks;

public class LogoutServiceTest {
    private LogoutService logoutService;

    @Mock
    private TokenRepository tokenRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private Authentication authentication;
    @Mock
    private SecurityContextHolder securityContextHolder;

    @BeforeEach
    void setup() {
        openMocks(this);
        logoutService = new LogoutService(tokenRepository, userRepository);
    }

    @Test
    void logout_withValidToken_shouldUpdateUserAndToken() {
        // Arrange
        String jwt = "valid_token";
        Token storedToken = new Token();
        User user = new User();
        storedToken.setUser(user);

        when(request.getHeader("Authorization")).thenReturn("Bearer " + jwt);
        when(tokenRepository.findByToken(jwt)).thenReturn(Optional.of(storedToken));

        // Act
        logoutService.logout(request, response, authentication);

        // Assert
        verify(tokenRepository).findByToken(jwt);
        verify(userRepository).save(user);
        verify(tokenRepository).save(storedToken);
        SecurityContextHolder.clearContext();
    }

    @Test
    void logout_withInvalidToken_shouldNotUpdateUserAndToken() {
        // Arrange
        String jwt = "invalid_token";

        when(request.getHeader("Authorization")).thenReturn("Bearer " + jwt);
        when(tokenRepository.findByToken(jwt)).thenReturn(Optional.empty());

        // Act
        logoutService.logout(request, response, authentication);

        // Assert
        verify(tokenRepository).findByToken(jwt);
        verifyNoInteractions(userRepository);
        verifyNoMoreInteractions(tokenRepository);
        verifyNoMoreInteractions(userRepository);
        verifyNoInteractions(securityContextHolder);
    }

    @Test
    void logout_withMissingAuthorizationHeader_shouldNotUpdateUserAndToken() {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn(null);

        // Act
        logoutService.logout(request, response, authentication);

        // Assert
        verifyNoInteractions(tokenRepository);
        verifyNoInteractions(userRepository);
        verifyNoInteractions(securityContextHolder);
    }

    @Test
    void logout_withMalformedAuthorizationHeader_shouldNotUpdateUserAndToken() {
        // Arrange
        String jwt = "malformed_token";

        when(request.getHeader("Authorization")).thenReturn(jwt);

        // Act
        logoutService.logout(request, response, authentication);

        // Assert
        verifyNoInteractions(tokenRepository);
        verifyNoInteractions(userRepository);
        verifyNoInteractions(mock(SecurityContextHolder.class));
    }

}
