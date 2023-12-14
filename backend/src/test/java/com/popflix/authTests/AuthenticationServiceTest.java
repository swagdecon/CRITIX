package com.popflix.authTests;

import com.popflix.config.customExceptions.UserAlreadyExistsException;
import com.popflix.config.customExceptions.UserAlreadyLoggedInException;
import com.popflix.config.customExceptions.UserEmailNotAuthenticated;
import com.popflix.model.Role;
import com.popflix.model.Token;
import com.popflix.model.User;
import com.popflix.repository.TokenRepository;
import com.popflix.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import com.popflix.auth.AuthenticationRequest;
import com.popflix.auth.AuthenticationResponse;
import com.popflix.auth.AuthenticationService;
import com.popflix.auth.RegisterRequest;
import com.popflix.auth.RegistrationResponse;
import com.popflix.config.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthenticationServiceTest {

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

        @Mock
        private JavaMailSender javaMailSender;

        @Mock
        private AuthenticationService authService;

        @InjectMocks
        private AuthenticationService authenticationService;

        String DEFAULT_AVATAR_URL = "test";

        // Registering a new user with valid input should create a new user in the
        // database and return an access token.
        @Test
        public void test_register_success() throws Exception {
                // Arrange
                RegisterRequest request = new RegisterRequest();
                request.setFirstName("John");
                request.setLastName("Doe");
                request.setEmail("john.doe@example.com");
                request.setPassword("password");
                AuthenticationService spyAuthService = spy(authenticationService);

                User user = User.builder()
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .accountActive(false)
                                .avatar(DEFAULT_AVATAR_URL)
                                .role(Role.USER)
                                .build();

                String jwtToken = "access_token";
                String refreshToken = "refresh_token";

                when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
                when(userRepository.save(any(User.class))).thenReturn(user);
                when(jwtService.generateToken(anyMap(), any(User.class))).thenReturn("access_token");
                when(jwtService.generateRefreshToken(any(User.class))).thenReturn("refresh_token");
                doNothing().when(spyAuthService).sendPasswordAuthenticationEmail(request.getEmail());

                RegistrationResponse response = spyAuthService.register(request);
                assertNotNull(response);
                assertEquals(jwtToken, response.getAuthenticationResponse().getAccessToken());
                assertEquals(refreshToken, response.getAuthenticationResponse().getRefreshToken());
                assertEquals("Please check your email to verify your account.", response.getMessage());
        }

        // Attempting to register a user with an email that already exists in the
        // database
        @Test
        public void test_register_existing_user() throws Exception {
                // Arrange
                RegisterRequest request = new RegisterRequest();
                request.setEmail("john.doe@example.com");

                User existingUser = User.builder()
                                .email(request.getEmail())
                                .build();

                when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(existingUser));

                // Act and Assert
                assertThrows(UserAlreadyExistsException.class, () -> authenticationService.register(request));
        }

        @Test
        public void test_register_password_special_characters() throws Exception {
                // Arrange
                RegisterRequest request = new RegisterRequest();
                request.setFirstName("John");
                request.setLastName("Doe");
                request.setEmail("john.doe@example.com");
                request.setPassword("password!@#");

                when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

                // Act and Assert
                assertThrows(Exception.class, () -> authenticationService.register(request));
        }

        @Test
        public void test_register_empty_first_name() throws Exception {
                // Arrange
                RegisterRequest request = new RegisterRequest();
                request.setFirstName("");
                request.setLastName("Doe");
                request.setEmail("john.doe@example.com");
                request.setPassword("password123");

                // Act and Assert
                assertThrows(Exception.class, () -> authenticationService.register(request));
        }

        @Test
        public void test_register_empty_last_name() throws Exception {
                // Arrange
                RegisterRequest request = new RegisterRequest();
                request.setFirstName("john");
                request.setLastName("");
                request.setEmail("john.doe@example.com");
                request.setPassword("password123");

                // Act and Assert
                assertThrows(Exception.class, () -> authenticationService.register(request));
        }

        @Test
        public void test_register_empty_email() throws Exception {
                // Arrange
                RegisterRequest request = new RegisterRequest();
                request.setFirstName("John");
                request.setLastName("Doe");
                request.setEmail("");
                request.setPassword("password123");

                // Act and Assert
                assertThrows(Exception.class, () -> authenticationService.register(request));
        }

        @Test
        public void test_register_empty_pwd() throws Exception {
                // Arrange
                RegisterRequest request = new RegisterRequest();
                request.setFirstName("John");
                request.setLastName("Doe");
                request.setEmail("john.doe@example.com");
                request.setPassword("");

                // Act and Assert
                assertThrows(Exception.class, () -> authenticationService.register(request));
        }

        @Test
        public void testUserNeedsEmailAuthentication() throws Exception {
                RegisterRequest request = new RegisterRequest();
                request.setFirstName("John");
                request.setLastName("Doe");
                request.setEmail("john.doe@example.com");
                request.setPassword("password");

                AuthenticationService spyAuthService = spy(authenticationService);

                User user = User.builder()
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .accountActive(false)
                                .avatar(DEFAULT_AVATAR_URL)
                                .role(Role.USER)
                                .build();

                when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
                when(userRepository.save(any(User.class))).thenReturn(user);
                when(jwtService.generateToken(anyMap(), any(User.class))).thenReturn("access_token");
                when(jwtService.generateRefreshToken(any(User.class))).thenReturn("refresh_token");
                doThrow(UserEmailNotAuthenticated.class).when(spyAuthService)
                                .sendPasswordAuthenticationEmail(request.getEmail());

                // Act and Assert
                assertThrows(UserEmailNotAuthenticated.class, () -> {
                        spyAuthService.register(request);
                });
        }

        // Authenticates user with valid email and password, generates access and
        // refresh tokens, and saves them to the database
        @Test
        public void test_authenticate_valid_email_and_password() {
                // Mock userRepository.findByEmail() to return a User object
                User mockUser = new User();
                mockUser.setAccountActive(true);
                mockUser.setLoggedIn(false);
                mockUser.setLastLoginTime(null);
                when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

                // Mock authenticationManager.authenticate() to return an Authentication object
                when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                                .thenReturn(null);

                // Mock jwtService.generateToken() to return a valid access token
                when(jwtService.generateToken(anyMap(), any(User.class))).thenReturn("access_token");

                // Mock jwtService.generateRefreshToken() to return a valid refresh token
                when(jwtService.generateRefreshToken(any(User.class), any(Date.class))).thenReturn("refresh_token");

                // Invoke the authenticate() method
                AuthenticationRequest request = new AuthenticationRequest("test@example.com", "password");
                AuthenticationResponse response = authenticationService.authenticate(request, null);

                // Verify that the access and refresh tokens are generated and saved
                assertEquals("access_token", response.getAccessToken());
                assertEquals("refresh_token", response.getRefreshToken());

                // Verify that the user's last login time and loggedIn flag are set
                assertNotNull(mockUser.getLastLoginTime());
                assertTrue(mockUser.getLoggedIn());

                // Verify that userRepository.save() is called to save the user object
                verify(userRepository, times(1)).save(mockUser);
        }

        // Sets last login time and loggedIn flag for authenticated user
        @Test
        public void test_set_last_login_time_and_logged_in_flag() {
                // Mock userRepository.findByEmail() to return a User object
                User mockUser = new User();
                mockUser.setAccountActive(true);
                mockUser.setLoggedIn(false);
                mockUser.setLastLoginTime(null);
                when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

                // Mock authenticationManager.authenticate() to return an Authentication object
                when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                                .thenReturn(null);

                // Mock jwtService.generateToken() to return a valid access token
                when(jwtService.generateToken(anyMap(), any(User.class))).thenReturn("access_token");

                // Mock jwtService.generateRefreshToken() to return a valid refresh token
                when(jwtService.generateRefreshToken(any(User.class), any(Date.class))).thenReturn("refresh_token");

                // Invoke the authenticate() method
                AuthenticationRequest request = new AuthenticationRequest("test@example.com", "password");
                authenticationService.authenticate(request, null);

                // Verify that the user's last login time and loggedIn flag are set
                assertNotNull(mockUser.getLastLoginTime());
                assertTrue(mockUser.getLoggedIn());

                // Verify that userRepository.save() is called to save the user object
                verify(userRepository, times(1)).save(mockUser);
        }

        // Revokes all user's previous tokens before generating new ones
        @Test
        public void testRevokePreviousTokens() {
                // Mock userRepository.findByEmail() to return a User object
                User mockUser = new User();
                mockUser.setAccountActive(true);
                mockUser.setLoggedIn(false);
                mockUser.setLastLoginTime(null);
                AuthenticationService spyAuthService = spy(authenticationService);

                when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

                // Mock authenticationManager.authenticate() to return an Authentication object
                when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                                .thenReturn(null);

                // Mock jwtService.generateToken() to return a valid access token
                when(jwtService.generateToken(anyMap(), any(User.class))).thenReturn("access_token");

                // Mock jwtService.generateRefreshToken() to return a valid refresh token
                when(jwtService.generateRefreshToken(any(User.class), any(Date.class))).thenReturn("refresh_token");

                // Invoke the authenticate() method
                AuthenticationRequest request = new AuthenticationRequest("test@example.com", "password");
                authenticationService.authenticate(request, null);

                // Verify that revokeAllUserTokens() is called to revoke previous tokens
                verify(spyAuthService, times(1)).revokeAllUserTokens(any(User.class));
        }
}
