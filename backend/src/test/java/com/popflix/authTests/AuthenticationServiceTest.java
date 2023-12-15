package com.popflix.authTests;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import javax.crypto.SecretKey;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.popflix.auth.AuthenticationRequest;
import com.popflix.auth.AuthenticationResponse;
import com.popflix.auth.AuthenticationService;
import com.popflix.auth.RegisterRequest;
import com.popflix.auth.RegistrationResponse;
import com.popflix.config.JwtService;
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

import io.jsonwebtoken.io.IOException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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
        public void test_less_than_30_minutes_ago_isAuthLinkExpired() {
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                Date lastResetPwdTime = new Date(System.currentTimeMillis() - 1500000); // 25 minutes ago
                boolean result = authenticationService.isAuthLinkExpired(lastResetPwdTime);
                assertFalse(result);
        }

        @Test
        public void test_exactly_30_minutes_ago_isAuthLinkExpired() {
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                Date lastResetPwdTime = new Date(System.currentTimeMillis() - 1800000); // 30 minutes ago
                boolean result = authenticationService.isAuthLinkExpired(lastResetPwdTime);
                assertTrue(result);
        }

        @Test
        public void test_more_than_30_minutes_in_future_isAuthLinkExpired() {
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                Date lastResetPwdTime = new Date(System.currentTimeMillis() + 1900000); // 31 minutes in the future
                boolean result = authenticationService.isAuthLinkExpired(lastResetPwdTime);
                assertFalse(result);
        }

        @Test
        public void test_more_than_30_minutes_ago_isAuthLinkExpired() {
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                Date lastResetPwdTime = new Date(System.currentTimeMillis() - 1900000); // 31 minutes ago
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

                String decryptedEmail = authenticationService.decryptToken(encryptedToken);

                assertEquals(expectedEmail, decryptedEmail);
        }

        @Test
        public void test_null_encrypted_token() {
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);

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
        // activateAccount tests ///////////////////////////////////////
        ////////////////////////////////////////////////////////////////

        @Test
        public void test_activates_account_when_valid_encrypted_email_is_provided() throws Exception {
                UserRepository userRepository = mock(UserRepository.class);
                TokenRepository tokenRepository = mock(TokenRepository.class);
                PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
                JwtService jwtService = mock(JwtService.class);
                AuthenticationManager authenticationManager = mock(AuthenticationManager.class);
                JavaMailSender javaMailSender = mock(JavaMailSender.class);

                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                String encryptedEmail = "95Or_YFh8yS8hVtwmaOxql6Ikji_fdq0FTAIxgeb9ek:pdBK5WgeuA8i5OEn7iVWnIekLCLYjqZMySbtu8voh_s";
                User user = new User();
                user.setAccountAuthRequestDate(new Date(System.currentTimeMillis() - (29 * 60 * 1000)));
                when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

                authenticationService.activateAccount(encryptedEmail);

                assertTrue(user.getAccountActive());
        }

        @Test
        public void test_throws_token_expired_exception_when_activation_link_is_expired() throws Exception {
                UserRepository userRepository = mock(UserRepository.class);
                TokenRepository tokenRepository = mock(TokenRepository.class);
                PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
                JwtService jwtService = mock(JwtService.class);
                AuthenticationManager authenticationManager = mock(AuthenticationManager.class);
                JavaMailSender javaMailSender = mock(JavaMailSender.class);

                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                String encryptedEmail = "95Or_YFh8yS8hVtwmaOxql6Ikji_fdq0FTAIxgeb9ek:pdBK5WgeuA8i5OEn7iVWnIekLCLYjqZMySbtu8voh_s";

                User user = new User();
                user.setAccountAuthRequestDate(new Date(System.currentTimeMillis() - (31 * 60 * 1000)));
                when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

                assertThrows(TokenExpiredException.class, () -> authenticationService.activateAccount(encryptedEmail));
                assertNull(userRepository.findByEmail("userEmail").get().getAccountActive());

        }

        @Test
        public void test_throws_username_not_found_exception_when_invalid_encrypted_email_is_provided()
                        throws Exception {
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                String encryptedEmail = "95Or_YFh8yS8hVtwmaOxql6Ikji_fdq0FTAIxgeb9ek:pdBK5WgeuA8i5OEn7iVWnIekLCLYjqZMySbtu8voh_s";

                assertThrows(UsernameNotFoundException.class,
                                () -> authenticationService.activateAccount(encryptedEmail));
        }

        ////////////////////////////////////////////////////////////////
        // encryptEmail tests //////////////////////////////////////////
        ////////////////////////////////////////////////////////////////

        @Test
        public void test_encrypt_email_successfully() throws Exception {
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                String email = "test@example.com";

                String encryptedToken = authenticationService.encryptEmail(email);

                assertNotNull(encryptedToken);
                assertTrue(encryptedToken.contains(":"));
                assertTrue(encryptedToken instanceof String);

        }

        @Test
        public void test_raise_exception_if_email_is_null() {
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                String email = null;

                assertThrows(Exception.class, () -> {
                        authenticationService.encryptEmail(email);
                });
        }

        ////////////////////////////////////////////////////////////////
        // sendPasswordAuthenticationEmail tests ///////////////////////
        ////////////////////////////////////////////////////////////////

        @Test
        public void test_send_email_with_activation_link() throws Exception {
                String email = "test@example.com";
                User user = new User();
                user.setEmail(email);
                user.setEmailAuthRequests(0);

                when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

                MimeMessage mimeMessageMock = mock(MimeMessage.class);
                when(javaMailSender.createMimeMessage()).thenReturn(mimeMessageMock);

                authenticationService.sendPasswordAuthenticationEmail(email);

                verify(javaMailSender, times(1)).send(any(MimeMessage.class));
                assertEquals(1, user.getEmailAuthRequests().intValue());
                assertNotNull(user.getAccountAuthRequestDate());
        }

        @Test
        public void test_account_auth_request_date_not_null() throws Exception {
                String email = "test@example.com";
                AuthenticationService authenticationService = new AuthenticationService(
                                userRepository, tokenRepository, passwordEncoder, jwtService, authenticationManager,
                                javaMailSender);
                User mockUser = new User();
                mockUser.setEmail(email);
                mockUser.setEmailAuthRequests(0);
                MimeMessage mimeMessageMock = mock(MimeMessage.class);
                when(javaMailSender.createMimeMessage()).thenReturn(mimeMessageMock);
                when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));
                authenticationService.sendPasswordAuthenticationEmail(email);

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException("Email or Password Not Found"));

                assertNotNull(user.getAccountAuthRequestDate());
        }

        @Test
        public void test_throw_tooManyRequestException() throws Exception {
                // Arrange
                String email = "test@example.com";
                AuthenticationService authenticationService = new AuthenticationService(
                                userRepository, tokenRepository, passwordEncoder, jwtService, authenticationManager,
                                javaMailSender);

                User user = new User();
                user.setEmail(email);
                user.setEmailAuthRequests(10);
                when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

                assertThrows(TooManyRequestsException.class, () -> {
                        authenticationService.sendPasswordAuthenticationEmail(email);
                });
        }

        @Test
        public void test_throw_err_send_email_exception() throws Exception {
                String email = "test@example.com";
                AuthenticationService authenticationService = new AuthenticationService(
                                userRepository, tokenRepository, passwordEncoder, jwtService, authenticationManager,
                                javaMailSender);

                User user = new User();
                user.setEmail(email);
                user.setEmailAuthRequests(0);
                when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

                MimeMessage mimeMessageMock = mock(MimeMessage.class);
                when(javaMailSender.createMimeMessage()).thenReturn(mimeMessageMock);
                doThrow(new ErrSendEmail("Simulated mail sending error")).when(javaMailSender)
                                .send(mimeMessageMock);

                assertThrows(ErrSendEmail.class, () -> {
                        authenticationService.sendPasswordAuthenticationEmail(email);
                });
        }

        ////////////////////////////////////////////////////////////////
        // resetAuthLinkRetryCount tests ///////////////////////////////
        ////////////////////////////////////////////////////////////////

        @Test
        public void test_resetAuthLinkRetryCount_Success() {
                List<User> usersWithResetRequests = new ArrayList<>();
                User user1 = new User();
                user1.setPasswordResetRequests(3);
                User user2 = new User();
                user2.setPasswordResetRequests(2);
                usersWithResetRequests.add(user1);
                usersWithResetRequests.add(user2);
                Mockito.when(userRepository.findUsersWithResetRequests()).thenReturn(usersWithResetRequests);

                authenticationService.resetAuthLinkRetryCount();

                ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
                verify(userRepository, times(2)).save(userCaptor.capture());

                List<User> capturedUsers = userCaptor.getAllValues();
                assertEquals(0, capturedUsers.get(0).getPasswordResetRequests());
                assertEquals(0, capturedUsers.get(1).getPasswordResetRequests());
        }

        @Test
        public void test_resetAuthLinkRetryCount_NoExceptions() {
                Mockito.when(userRepository.findUsersWithResetRequests()).thenReturn(new ArrayList<>());

                assertDoesNotThrow(() -> authenticationService.resetAuthLinkRetryCount());
        }

        @Test
        public void test_resetAuthLinkRetryCount_NoUsersWithResetRequests() {
                Mockito.when(userRepository.findUsersWithResetRequests()).thenReturn(new ArrayList<>());

                authenticationService.resetAuthLinkRetryCount();

                Mockito.verify(userRepository, Mockito.never()).save(Mockito.any(User.class));
        }

        @Test
        public void test_resetAuthLinkRetryCount_RepositoryException() {

                Mockito.when(userRepository.findUsersWithResetRequests())
                                .thenThrow(new RuntimeException("Repository exception"));

                assertDoesNotThrow(() -> authenticationService.resetAuthLinkRetryCount());
        }

        @Test
        public void test_resetAuthLinkRetryCount_ResetOnlyUsersWithResetRequests() {

                List<User> usersWithResetRequests = new ArrayList<>();
                User user1 = new User();
                user1.setPasswordResetRequests(3);

                User user2 = new User();
                user2.setPasswordResetRequests(2);

                usersWithResetRequests.add(user1);
                usersWithResetRequests.add(user2);

                List<User> allUsers = new ArrayList<>();
                User user3 = new User();
                user3.setPasswordResetRequests(1);

                allUsers.add(user1);
                allUsers.add(user2);
                allUsers.add(user3);

                Mockito.when(userRepository.findUsersWithResetRequests()).thenReturn(usersWithResetRequests);

                authenticationService.resetAuthLinkRetryCount();

                assertEquals(0, user1.getPasswordResetRequests());
                assertEquals(0, user2.getPasswordResetRequests());
                assertEquals(1, user3.getPasswordResetRequests());
        }

        ////////////////////////////////////////////////////////////////
        // getUserDetails tests ////////////////////////////////////////
        ////////////////////////////////////////////////////////////////

        @Test
        public void test_valid_access_token() {
                String accessToken = "valid_access_token";
                User expectedUser = new User();
                Mockito.when(tokenRepository.findUserByToken(accessToken)).thenReturn(expectedUser);

                User actualUser = authenticationService.getUserDetails(accessToken);

                assertEquals(expectedUser, actualUser);
        }

        @Test
        public void test_invalid_access_token_userDetails() {
                String accessToken = "invalid_access_token";
                Mockito.when(tokenRepository.findUserByToken(accessToken)).thenReturn(null);

                User actualUser = authenticationService.getUserDetails(accessToken);

                assertNull(actualUser);
        }

        @Test
        public void test_null_or_empty_access_token() {
                String nullAccessToken = null;
                String emptyAccessToken = "";
                User actualUserWithNullJwt = authenticationService.getUserDetails(nullAccessToken);
                User actualUserWithEmptyJwt = authenticationService.getUserDetails(emptyAccessToken);

                assertNull(actualUserWithNullJwt);
                assertNull(actualUserWithEmptyJwt);

        }

        ////////////////////////////////////////////////////////////////
        // generateSecretKey tests /////////////////////////////////////
        ////////////////////////////////////////////////////////////////

        @Test
        public void test_generate_secret_key() throws Exception {

                SecretKey secretKey = AuthenticationService.generateSecretKey();
                assertNotNull(secretKey);
        }

        @Test
        public void test_revoke_all_user_tokens() {
                User user = new User();
                List<Token> validUserTokens = new ArrayList<>();
                Token token1 = new Token();
                Token token2 = new Token();
                validUserTokens.add(token1);
                validUserTokens.add(token2);

                when(tokenRepository.findAllValidTokensByUser(user.getId())).thenReturn(validUserTokens);

                authenticationService.revokeAllUserTokens(user);

                assertTrue(token1.isExpired());
                assertTrue(token1.isRevoked());
                assertTrue(token2.isExpired());
                assertTrue(token2.isRevoked());

                verify(tokenRepository, times(1)).saveAll(validUserTokens);
        }

        ////////////////////////////////////////////////////////////////
        // saveAccessToken tests ///////////////////////////////////////
        ////////////////////////////////////////////////////////////////

        @Test
        public void test_save_access_token() {
                User user = new User();
                String accessToken = "access_token";

                authenticationService.saveAccessToken(user, accessToken);

                ArgumentCaptor<Token> tokenCaptor = ArgumentCaptor.forClass(Token.class);
                verify(tokenRepository, times(1)).save(tokenCaptor.capture());

                Token savedToken = tokenCaptor.getValue();
                assertEquals(user, savedToken.getUser());
                assertEquals(user.getId(), savedToken.getUserId());
                assertEquals(accessToken, savedToken.getToken());
                assertEquals(TokenType.BEARER, savedToken.getTokenType());
        }

        ////////////////////////////////////////////////////////////////
        // saveRefreshToken tests //////////////////////////////////////
        ////////////////////////////////////////////////////////////////

        @Test
        public void test_saveRefreshToken_Success() {
                // Arrange
                User user = new User();
                user.setId("1");
                String refreshToken = "refreshToken";
                Token expectedToken = Token.builder()
                                .user(user)
                                .userId(user.getId())
                                .token(refreshToken)
                                .tokenType(TokenType.REFRESH)
                                .expired(false)
                                .revoked(false)
                                .build();

                Mockito.when(tokenRepository.save(Mockito.any(Token.class))).thenReturn(expectedToken);

                authenticationService.saveRefreshToken(user, refreshToken);

                Mockito.verify(tokenRepository, Mockito.times(1)).save(expectedToken);
        }

        ////////////////////////////////////////////////////////////////
        // refreshToken tests //////////////////////////////////////////
        ////////////////////////////////////////////////////////////////

        @Test
        public void test_valid_refresh_token() throws IOException, JsonProcessingException {
                // Arrange
                HttpServletRequest request = mock(HttpServletRequest.class);
                HttpServletResponse response = mock(HttpServletResponse.class);
                AuthenticationService authenticationService = new AuthenticationService(userRepository, tokenRepository,
                                passwordEncoder, jwtService, authenticationManager, javaMailSender);
                String refreshToken = "valid_refresh_token";
                String userEmail = "test@example.com";
                User user = User.builder()
                                .email(userEmail)
                                .build();
                when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer " + refreshToken);
                when(jwtService.extractUsername(refreshToken)).thenReturn(userEmail);
                when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
                when(jwtService.isTokenValid(refreshToken, user)).thenReturn(true);
                String accessToken = "new_access_token";
                String newRefreshToken = "new_refresh_token";
                when(jwtService.generateToken(user)).thenReturn(accessToken);
                when(jwtService.generateRefreshToken(user, user.getLastLoginTime())).thenReturn(newRefreshToken);

                JsonNode result = authenticationService.refreshToken(request, response);

                assertNotNull(result);
                System.out.println(result);
                assertEquals(accessToken, result.get("access_token").asText());
                assertEquals(newRefreshToken, result.get("refresh_token").asText());
        }

        @Test
        public void test_missing_or_invalid_authorization_header() throws IOException, JsonProcessingException {
                HttpServletRequest request = mock(HttpServletRequest.class);
                HttpServletResponse response = mock(HttpServletResponse.class);
                when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);

                JsonNode result = authenticationService.refreshToken(request, response);

                assertNull(result);
        }

        @Test
        public void test_user_email_extracted_from_refresh_token_is_null() throws IOException, JsonProcessingException {
                HttpServletRequest request = mock(HttpServletRequest.class);
                HttpServletResponse response = mock(HttpServletResponse.class);
                String authHeader = "Bearer refreshToken";
                when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(authHeader);
                when(jwtService.extractUsername("refreshToken")).thenReturn(null);

                JsonNode result = authenticationService.refreshToken(request, response);

                assertNull(result);
        }
}
