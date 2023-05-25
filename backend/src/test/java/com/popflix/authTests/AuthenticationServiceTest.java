package com.popflix.authTests;

import com.popflix.config.customExceptions.UserAlreadyExistsException;
import com.popflix.config.customExceptions.UserAlreadyLoggedInException;
import com.popflix.model.Token;
import com.popflix.model.User;
import com.popflix.repository.TokenRepository;
import com.popflix.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import com.popflix.auth.AuthenticationRequest;
import com.popflix.auth.AuthenticationService;
import com.popflix.auth.RegisterRequest;
import com.popflix.config.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class AuthenticationServiceTest {

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenRepository tokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthenticationService authenticationService;

    @Test
    void testRegister() {
        // Test data
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");
        request.setFirstName("John");
        request.setLastName("Doe");

        // Mocking behavior
        when(userRepository.findByEmail(eq(request.getEmail()))).thenReturn(Optional.empty());
        when(passwordEncoder.encode(eq(request.getPassword()))).thenReturn("encodedPassword");
        when(jwtService.generateToken(ArgumentMatchers.any(User.class))).thenReturn("jwtToken");
        when(jwtService.generateRefreshToken(ArgumentMatchers.any(User.class))).thenReturn("refreshToken");
        when(userRepository.save(ArgumentMatchers.any(User.class))).thenReturn(new User());

        // Method invocation
        authenticationService.register(request);

        // Verify interactions
        verify(userRepository).save(ArgumentMatchers.any(User.class));
        verify(jwtService).generateToken(ArgumentMatchers.any(User.class));
        verify(jwtService).generateRefreshToken(ArgumentMatchers.any(User.class));
        verify(tokenRepository, times(2)).save(ArgumentMatchers.any(Token.class));
    }

    @Test
    void testRegisterUserAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");
        request.setFirstName("John");
        request.setLastName("Doe");

        when(userRepository.findByEmail(eq(request.getEmail()))).thenReturn(Optional.of(new User()));

        assertThrows(UserAlreadyExistsException.class, () -> authenticationService.register(request));
        verify(userRepository, never()).save(any(User.class));
        verify(tokenRepository, never()).save(any(Token.class));
    }

    @Test
    void testAuthenticate() {
        // Test data
        AuthenticationRequest request = new AuthenticationRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");

        User user = User.builder()
                .email("test@example.com")
                .loggedIn(false)
                .build();

        // Mocking behavior
        when(userRepository.findByEmail(eq(request.getEmail()))).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(eq(request.getPassword()))).thenReturn("encodedPassword");
        when(jwtService.generateToken(ArgumentMatchers.any(User.class))).thenReturn("jwtToken");
        when(jwtService.generateRefreshToken(ArgumentMatchers.any(User.class))).thenReturn("refreshToken");

        // Method invocation
        authenticationService.authenticate(request, mock(HttpServletRequest.class));

        // Verify interactions
        verify(userRepository).save(user);
        verify(authenticationManager).authenticate(
                eq(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())));
        verify(jwtService).generateToken(user);
        verify(jwtService).generateRefreshToken(user);
        verify(tokenRepository, times(2)).save(ArgumentMatchers.any(Token.class));
    }

    @Test
    void testAuthenticateUserAlreadyLoggedIn() {
        AuthenticationRequest request = new AuthenticationRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");

        User user = User.builder()
                .email("test@example.com")
                .loggedIn(true)
                .build();

        when(userRepository.findByEmail(eq(request.getEmail()))).thenReturn(Optional.of(user));

        assertThrows(UserAlreadyLoggedInException.class,
                () -> authenticationService.authenticate(request, mock(HttpServletRequest.class)));

        verify(userRepository, never()).save(any(User.class));
        verify(authenticationManager, never()).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(tokenRepository, never()).save(any(Token.class));
    }
}
