package com.popflix.authTests;

import com.popflix.config.customExceptions.UserAlreadyExistsException;
import com.popflix.config.customExceptions.UserEmailNotAuthenticated;
import com.popflix.model.Role;
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
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Date;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
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

        ////////////////////////////////////////////////////////////////
        // register tests //////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////

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
                RegisterRequest request = new RegisterRequest();
                request.setEmail("john.doe@example.com");

                User existingUser = User.builder()
                                .email(request.getEmail())
                                .build();

                when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(existingUser));

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

                assertThrows(Exception.class, () -> authenticationService.register(request));
        }

        @Test
        public void test_register_empty_first_name() throws Exception {
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
                RegisterRequest request = new RegisterRequest();
                request.setFirstName("john");
                request.setLastName("");
                request.setEmail("john.doe@example.com");
                request.setPassword("password123");

                assertThrows(Exception.class, () -> authenticationService.register(request));
        }

        @Test
        public void test_register_empty_email() throws Exception {
                RegisterRequest request = new RegisterRequest();
                request.setFirstName("John");
                request.setLastName("Doe");
                request.setEmail("");
                request.setPassword("password123");

                assertThrows(Exception.class, () -> authenticationService.register(request));
        }

        @Test
        public void test_register_empty_pwd() throws Exception {
                RegisterRequest request = new RegisterRequest();
                request.setFirstName("John");
                request.setLastName("Doe");
                request.setEmail("john.doe@example.com");
                request.setPassword("");

                assertThrows(Exception.class, () -> authenticationService.register(request));
        }

        ////////////////////////////////////////////////////////////////
        // authenticate tests //////////////////////////////////////////
        ////////////////////////////////////////////////////////////////

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

                assertThrows(UserEmailNotAuthenticated.class, () -> {
                        spyAuthService.register(request);
                });
        }

        // Authenticates user with valid email and password, generates access and
        // refresh tokens, and saves them to the database
        @Test
        public void test_authenticate_valid_email_and_password() {
                User mockUser = new User();
                mockUser.setAccountActive(true);
                mockUser.setLoggedIn(false);
                mockUser.setLastLoginTime(null);
                when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

                when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                                .thenReturn(null);

                when(jwtService.generateToken(anyMap(), any(User.class))).thenReturn("access_token");

                when(jwtService.generateRefreshToken(any(User.class), any(Date.class))).thenReturn("refresh_token");

                AuthenticationRequest request = new AuthenticationRequest("test@example.com", "password");
                AuthenticationResponse response = authenticationService.authenticate(request, null);

                assertEquals("access_token", response.getAccessToken());
                assertEquals("refresh_token", response.getRefreshToken());

                assertNotNull(mockUser.getLastLoginTime());
                assertTrue(mockUser.getLoggedIn());

                verify(userRepository, times(1)).save(mockUser);
        }

        // Sets last login time and loggedIn flag for authenticated user
        @Test
        public void test_set_last_login_time_and_logged_in_flag() {
                User mockUser = new User();
                mockUser.setAccountActive(true);
                mockUser.setLoggedIn(false);
                mockUser.setLastLoginTime(null);
                when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));

                when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                                .thenReturn(null);

                when(jwtService.generateToken(anyMap(), any(User.class))).thenReturn("access_token");

                when(jwtService.generateRefreshToken(any(User.class), any(Date.class))).thenReturn("refresh_token");

                AuthenticationRequest request = new AuthenticationRequest("test@example.com", "password");
                authenticationService.authenticate(request, null);

                assertNotNull(mockUser.getLastLoginTime());
                assertTrue(mockUser.getLoggedIn());

                verify(userRepository, times(1)).save(mockUser);
        }

        @Test
        public void testAuthenticate_ThrowsException_IfEmailOrPasswordNotFound() {
                AuthenticationRequest request = new AuthenticationRequest();
                request.setEmail("test@test.com");
                request.setPassword("password");

                when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

                assertThrows(UsernameNotFoundException.class, () -> {
                        authenticationService.authenticate(request, new MockHttpServletRequest());
                });
        }

        @Test
        public void testAuthenticate_ThrowsException_IfAccountNotActive() {
                String email = "test@example.com";
                User user = new User();
                user.setAccountActive(false);
                AuthenticationRequest request = new AuthenticationRequest();
                request.setEmail(email);
                HttpServletRequest httpRequest = new MockHttpServletRequest();

                when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

                assertThrows(UserEmailNotAuthenticated.class,
                                () -> authenticationService.authenticate(request, httpRequest));
        }

        ////////////////////////////////////////////////////////////////
        // authenticateExistingToken tests /////////////////////////////
        ////////////////////////////////////////////////////////////////

        @Test
        public void testAuthenticateExistingToken_ValidAccessToken_ReturnsTrue() {
                String authHeader = "Bearer validAccessToken";
                User user = new User();
                user.setEmail("test@example.com");
                Mockito.when(userRepository.findByEmail(Mockito.anyString())).thenReturn(Optional.of(user));
                Mockito.when(jwtService.extractUsername(Mockito.anyString())).thenReturn("test@example.com");
                Mockito.when(jwtService.isTokenValid(Mockito.anyString(), Mockito.any(User.class))).thenReturn(true);

                boolean result = authenticationService.authenticateExistingToken(authHeader);

                assertTrue(result);
        }

        @Test
        public void test_invalid_access_token() {
                String authHeader = "Bearer invalidAccessToken";
                User user = new User();
                user.setEmail("test@example.com");
                Mockito.when(userRepository.findByEmail(Mockito.anyString())).thenReturn(Optional.of(user));
                Mockito.when(jwtService.extractUsername(Mockito.anyString())).thenReturn("test@example.com");
                Mockito.when(jwtService.isTokenValid(Mockito.anyString(), Mockito.any(User.class))).thenReturn(false);

                boolean result = authenticationService.authenticateExistingToken(authHeader);

                assertFalse(result);
        }

        ////////////////////////////////////////////////////////////////
        // authenticateExistingEmail tests /////////////////////////////
        ////////////////////////////////////////////////////////////////

        @Test
        public void test_email_exists() {
                when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(new User()));

                boolean result = authenticationService.authenticateExistingEmail("test@example.com");

                assertTrue(result);
        }

        @Test
        public void test_email_does_not_exist() {
                when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

                boolean result = authenticationService.authenticateExistingEmail("test@example.com");

                assertFalse(result);
        }

        ////////////////////////////////////////////////////////////////
        // isAuthLinkExpired tests /////////////////////////////////////
        ////////////////////////////////////////////////////////////////

        @Test
        public void test_null_last_reset_pwd_time_isAuthLinkExpired() {
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                boolean result = authenticationService.isAuthLinkExpired(null);
                assertTrue(result);
        }

        @Test
        public void test_less_than_1_minute_ago_isAuthLinkExpired() {
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                Date lastResetPwdTime = new Date(System.currentTimeMillis() - 50000);
                boolean result = authenticationService.isAuthLinkExpired(lastResetPwdTime);
                assertFalse(result);
        }

        @Test
        public void test_exactly_1_minute_ago_isAuthLinkExpired() {
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                Date lastResetPwdTime = new Date(System.currentTimeMillis() - 60000);
                boolean result = authenticationService.isAuthLinkExpired(lastResetPwdTime);
                assertTrue(result);
        }

        @Test
        public void test_exactly_1_minute_in_future_isAuthLinkExpired() {
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                Date lastResetPwdTime = new Date(System.currentTimeMillis() + 60000);
                boolean result = authenticationService.isAuthLinkExpired(lastResetPwdTime);
                assertTrue(result);
        }

        @Test
        public void test_more_than_1_minute_in_future_isAuthLinkExpired() {
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                Date lastResetPwdTime = new Date(System.currentTimeMillis() + 120000);
                boolean result = authenticationService.isAuthLinkExpired(lastResetPwdTime);
                assertFalse(result);
        }

        @Test
        public void test_more_than_1_minute_ago_isAuthLinkExpired() {
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                Date lastResetPwdTime = new Date(System.currentTimeMillis() - 120000);
                boolean result = authenticationService.isAuthLinkExpired(lastResetPwdTime);
                assertTrue(result);
        }
        ////////////////////////////////////////////////////////////////
        // decryptToken tests //////////////////////////////////////////
        ////////////////////////////////////////////////////////////////

        @Test
        public void test_valid_encrypted_token() throws Exception {
                // Arrange
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                String encryptedToken = "95Or_YFh8yS8hVtwmaOxql6Ikji_fdq0FTAIxgeb9ek:pdBK5WgeuA8i5OEn7iVWnIekLCLYjqZMySbtu8voh_s";
                String expectedEmail = "test@example.com";

                // Act
                String decryptedEmail = authenticationService.decryptToken(encryptedToken);

                // Assert
                assertEquals(expectedEmail, decryptedEmail);
        }

        @Test
        public void test_null_encrypted_token() {
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                ;
                String encryptedToken = null;

                assertThrows(Exception.class, () -> {
                        authenticationService.decryptToken(encryptedToken);
                });
        }

        @Test
        public void test_invalid_encrypted_token_format() {
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                String encryptedToken = "invalid_token_format";

                assertThrows(Exception.class, () -> {
                        authenticationService.decryptToken(encryptedToken);
                });
        }

        ////////////////////////////////////////////////////////////////
        // decryptToken tests //////////////////////////////////////////
        ////////////////////////////////////////////////////////////////

        @Test
        public void test_activate_account_success() throws Exception {
                AuthenticationService authenticationService = Mockito.mock(AuthenticationService.class);

                String encryptedEmail = "95Or_YFh8yS8hVtwmaOxql6Ikji_fdq0FTAIxgeb9ek:pdBK5WgeuA8i5OEn7iVWnIekLCLYjqZMySbtu8voh_s";
                User user = User.builder()
                                .email("test@example.com")
                                .accountActive(false)
                                .accountAuthRequestDate(new Date())
                                .build();

                when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
                when(authenticationService.decryptToken(encryptedEmail)).thenReturn("test@example.com");
                when(authenticationService.isAuthLinkExpired(user.getAccountAuthRequestDate())).thenReturn(false);

                authenticationService.activateAccount(encryptedEmail);

                // Get the user from the repository after activation
                User updatedUser = userRepository.findByEmail("test@example.com")
                                .orElseThrow(() -> new UsernameNotFoundException("Email or Password Not Found"));

                assertTrue(updatedUser.getAccountActive()); // Verify the updated user from the repository
                verify(userRepository, times(1)).save(updatedUser); // Verify the save method call
        }

}
