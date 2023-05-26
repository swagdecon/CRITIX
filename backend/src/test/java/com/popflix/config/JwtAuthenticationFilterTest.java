package com.popflix.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import com.popflix.model.Token;
import com.popflix.repository.TokenRepository;
import static org.mockito.Mockito.*;

class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;
    @Mock
    private UserDetailsService userDetailsService;
    @Mock
    private TokenRepository tokenRepository;
    @Mock
    private HttpServletRequest request;
    @Mock
    private HttpServletResponse response;
    @Mock
    private FilterChain filterChain;

    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        jwtAuthenticationFilter = new JwtAuthenticationFilter(jwtService, userDetailsService, tokenRepository);
    }

    @Test
    void doFilterInternal_withValidToken_shouldAuthenticateUser() throws ServletException, IOException {
        // Arrange
        // Define test inputs and mocks
        String token = "valid_token"; // Sample token
        String userEmail = "test@example.com"; // Sample user email
        UserDetails userDetails = mock(UserDetails.class); // Mock UserDetails
        UsernamePasswordAuthenticationToken authToken = mock(UsernamePasswordAuthenticationToken.class); // Mock
                                                                                                         // UsernamePasswordAuthenticationToken
        WebAuthenticationDetails details = new WebAuthenticationDetails(request); // Create WebAuthenticationDetails
                                                                                  // using the request

        // Mocking the static method
        try (MockedStatic<SecurityContextHolder> mockedSecurityContextHolder = Mockito
                .mockStatic(SecurityContextHolder.class)) {
            SecurityContext securityContext = mock(SecurityContext.class); // Mock SecurityContext
            mockedSecurityContextHolder.when(SecurityContextHolder::getContext).thenReturn(securityContext); // Configure
                                                                                                             // SecurityContextHolder.getContext()
                                                                                                             // to
                                                                                                             // return
                                                                                                             // the mock
                                                                                                             // securityContext

            // Configure the behavior of mocked objects
            when(request.getHeader("Authorization")).thenReturn("Bearer " + token); // Configure request.getHeader() to
                                                                                    // return the token
            when(jwtService.extractUsername(token)).thenReturn(userEmail); // Configure jwtService.extractUsername() to
                                                                           // return the user email
            when(userDetailsService.loadUserByUsername(userEmail)).thenReturn(userDetails); // Configure
                                                                                            // userDetailsService.loadUserByUsername()
                                                                                            // to return the mocked
                                                                                            // UserDetails
            when(tokenRepository.findByToken(token)).thenReturn(Optional.of(mock(Token.class))); // Configure
                                                                                                 // tokenRepository.findByToken()
                                                                                                 // to return an
                                                                                                 // Optional containing
                                                                                                 // a mocked Token
            when(jwtService.isTokenValid(token, userDetails)).thenReturn(true); // Configure jwtService.isTokenValid()
                                                                                // to return true
            when(authToken.getDetails()).thenReturn(details); // Configure authToken.getDetails() to return the mocked
                                                              // WebAuthenticationDetails
            when(securityContext.getAuthentication()).thenReturn(null); // Configure securityContext.getAuthentication()
                                                                        // to return null

            // Act
            // Invoke the method under test
            jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

            // Assert
            // Verify the expected interactions
            verify(securityContext).setAuthentication(any(UsernamePasswordAuthenticationToken.class)); // Verify that
                                                                                                       // securityContext.setAuthentication()
                                                                                                       // is called with
                                                                                                       // any instance
                                                                                                       // of
                                                                                                       // UsernamePasswordAuthenticationToken
            verify(filterChain).doFilter(request, response); // Verify that filterChain.doFilter() is called with the
                                                             // request and response objects
            verifyNoMoreInteractions(filterChain); // Verify that there are no more interactions with filterChain
        }
    }

    @Test
    void doFilterInternal_withInvalidToken_shouldSendUnauthorizedResponse() throws ServletException, IOException {
        // Arrange
        String token = "invalid_token";

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.extractUsername(token)).thenReturn(null);

        // Act
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
        verifyNoMoreInteractions(filterChain);
    }

    @Test
    void doFilterInternal_withExpiredToken_shouldSendUnauthorizedResponse() throws ServletException, IOException {
        // Arrange
        String token = "expired_token";
        String userEmail = "test@example.com";
        UserDetails userDetails = mock(UserDetails.class);

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.extractUsername(token)).thenReturn(userEmail);
        when(userDetailsService.loadUserByUsername(userEmail)).thenReturn(userDetails);
        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(mock(Token.class)));
        when(jwtService.isTokenValid(token, userDetails)).thenReturn(false);

        // Act
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
        verifyNoMoreInteractions(filterChain);
    }

    @Test
    void doFilterInternal_withoutToken_shouldContinueFilterChain() throws ServletException, IOException {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn(null);
    
        // Act
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);
    
        // Assert
        verify(filterChain).doFilter(request, response);
        verifyNoMoreInteractions(filterChain);
    }

    @Test
    void doFilterInternal_withTokenAndAlreadyAuthenticated_shouldContinueFilterChain()
            throws ServletException, IOException {
        // Arrange
        String token = "valid_token";
        String userEmail = "test@example.com";
        UserDetails userDetails = mock(UserDetails.class);

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.extractUsername(token)).thenReturn(userEmail);
        when(userDetailsService.loadUserByUsername(userEmail)).thenReturn(userDetails);
        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(mock(Token.class)));
        when(jwtService.isTokenValid(token, userDetails)).thenReturn(true);
        SecurityContextHolder.getContext().setAuthentication(mock(Authentication.class));

        // Act
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verifyNoInteractions(filterChain);
    }

}
