
package com.popflix.authTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.popflix.auth.AuthenticationController;
import com.popflix.auth.AuthenticationRequest;
import com.popflix.auth.AuthenticationResponse;
import com.popflix.auth.AuthenticationService;
import com.popflix.auth.RecaptchaRequest;
import com.popflix.auth.RegisterRequest;
import com.popflix.auth.RegistrationResponse;
import com.popflix.config.customExceptions.TooManyRequestsException;
import com.popflix.config.customExceptions.UserAlreadyExistsException;
import com.popflix.config.customExceptions.UserAlreadyLoggedInException;
import com.popflix.service.PasswordService;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

class AuthenticationControllerTest {

    @Mock
    private AuthenticationService service;

    @Mock
    private PasswordService passwordService;

    @Mock
    private HttpServletRequest httpRequest;

    @Mock
    private HttpServletResponse httpResponse;

    @InjectMocks
    private AuthenticationController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    ////////////////////////////////////////////////////////////////
    // register tests //////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////

    @Test
    void testRegister() throws Exception {
        RegisterRequest request = new RegisterRequest();
        RegistrationResponse registrationResponse = new RegistrationResponse(
                new AuthenticationResponse("AccessToken", "RefreshToken"),
                "User registered successfully");

        when(service.register(any(RegisterRequest.class))).thenReturn(registrationResponse);

        ResponseEntity<?> response = controller.register(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(registrationResponse, response.getBody());
    }

    @Test
    void testRegisteredUserAlreadyExists() throws Exception {
        RegisterRequest request = new RegisterRequest();
        when(service.register(request))
                .thenThrow(new UserAlreadyExistsException("A User With This Email Already Exists"));
        ResponseEntity<?> response = controller.register(request);
        assertEquals(ResponseEntity.badRequest().body("A User With This Email Already Exists"), response);
    }

    ////////////////////////////////////////////////////////////////
    // authenticate tests //////////////////////////////////////////
    ////////////////////////////////////////////////////////////////

    @Test
    void testAuthenticate() throws UsernameNotFoundException, UserAlreadyLoggedInException {

        AuthenticationRequest request = new AuthenticationRequest();
        when(service.authenticate(request, httpRequest))
                .thenReturn(new AuthenticationResponse("Authentication Successful", null));
        ResponseEntity<?> response = controller.authenticate(request, httpRequest);
        assertEquals(ResponseEntity.ok(new AuthenticationResponse("Authentication Successful", null)), response);
    }

    @Test
    void testAuthenticatedUserNotFound() throws UsernameNotFoundException, UserAlreadyLoggedInException {
        AuthenticationRequest request = new AuthenticationRequest();
        when(service.authenticate(request, httpRequest)).thenThrow(new UsernameNotFoundException("User not found"));
        ResponseEntity<?> response = controller.authenticate(request, httpRequest);
        assertEquals(ResponseEntity.badRequest().body("User not found"), response);
    }

    @Test
    void testAuthenticatedUserAlreadyLoggedIn() throws UsernameNotFoundException, UserAlreadyLoggedInException {
        AuthenticationRequest request = new AuthenticationRequest();
        when(service.authenticate(request, httpRequest))
                .thenThrow(new UserAlreadyLoggedInException("User is already logged in"));
        ResponseEntity<?> response = controller.authenticate(request, httpRequest);
        assertEquals(ResponseEntity.badRequest().body("User is already logged in"), response);
    }

    ////////////////////////////////////////////////////////////////
    // refresh token tests /////////////////////////////////////////
    ////////////////////////////////////////////////////////////////

    @Test
    public void refresh_token_happy_path() throws IOException, JsonProcessingException {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        JsonNode expectedJsonNode = mock(JsonNode.class);
        when(service.refreshToken(request, response)).thenReturn(expectedJsonNode);

        // Act
        JsonNode result = service.refreshToken(request, response);

        assertNotNull(result);
        assertEquals(expectedJsonNode, result);
    }

    @Test
    public void refresh_token_json_error()
            throws IOException, JsonProcessingException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);

        when(service.refreshToken(request, response)).thenThrow(JsonProcessingException.class);

        assertThrows(JsonProcessingException.class, () -> service.refreshToken(request, response));
    }

    ////////////////////////////////////////////////////////////////
    // authenticateExistingToken tests /////////////////////////////
    ////////////////////////////////////////////////////////////////

    @Test
    public void test_valid_token() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        AuthenticationService authService = mock(AuthenticationService.class);
        AuthenticationController controller = new AuthenticationController(authService, null);
        String authHeader = "valid_token";

        when(request.getHeader("Authorization")).thenReturn(authHeader);
        when(authService.authenticateExistingToken(authHeader)).thenReturn(true);
        ResponseEntity<?> response = controller.authenticateExistingToken(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Token is valid", response.getBody());
    }

    @Test
    public void test_invalid_token() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        AuthenticationService authService = mock(AuthenticationService.class);
        AuthenticationController controller = new AuthenticationController(authService, null);
        String authHeader = "invalid_token";

        when(request.getHeader("Authorization")).thenReturn(authHeader);
        when(authService.authenticateExistingToken(authHeader)).thenReturn(false);
        ResponseEntity<?> response = controller.authenticateExistingToken(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid token", response.getBody());
    }

    ////////////////////////////////////////////////////////////////
    // authenticateExistingToken tests /////////////////////////////
    ////////////////////////////////////////////////////////////////

    private String stripWhitespace(String input) {
        return input.replaceAll("\\s", "");
    }

    @Test
    public void test_sendPostRequestToRecaptchaAPI() throws IOException, InterruptedException, java.io.IOException {

        String recaptchaValue = "recaptchaValue";
        String expectedResponse = "{\"success\":false,\"error-codes\":[\"invalid-input-response\"]}";
        RecaptchaRequest recaptchaRequest = new RecaptchaRequest(recaptchaValue);

        HttpClient client = mock(HttpClient.class);
        HttpResponse<String> response = mock(HttpResponse.class);

        when(response.body()).thenReturn(expectedResponse);
        when(client.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class))).thenReturn(response);

        AuthenticationController authenticationController = new AuthenticationController(service, passwordService);
        String actualResponse = authenticationController.authenticateRecaptchaToken(recaptchaRequest);

        assertEquals(stripWhitespace(expectedResponse), stripWhitespace(actualResponse));
    }

    ////////////////////////////////////////////////////////////////
    // sendPasswordRecoveryEmail tests /////////////////////////////
    ////////////////////////////////////////////////////////////////

    @Test
    public void send_pwd_auth_email_happy_path() {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", "test@example.com");

        ResponseEntity<String> response = controller.sendPasswordAuthenticationEmail(requestBody);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Please check your email to confirm your account", response.getBody());
    }

    @Test
    public void test_sendPasswordAuthenticationEmail_exceptionThrown() throws Exception {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", "test@example.com");

        doThrow(new RuntimeException("Test exception")).when(service).sendPasswordAuthenticationEmail(anyString());

        ResponseEntity<String> response = controller.sendPasswordAuthenticationEmail(requestBody);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Test exception", response.getBody());
    }

    @Test
    public void test_sendPasswordAuthenticationEmail_nullEmail() {
        ResponseEntity<String> response = controller.sendPasswordAuthenticationEmail(null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    public void test_sendPasswordAuthenticationEmail_emptyEmail() {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", "");

        ResponseEntity<String> response = controller.sendPasswordAuthenticationEmail(requestBody);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    public void test_sendPasswordAuthenticationEmail_invalidEmailFormat() {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", "test");

        ResponseEntity<String> response = controller.sendPasswordAuthenticationEmail(requestBody);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    /// //////////////////////////////////////////////////////////////
    // activateAccount tests ////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    // Feel this is sufficiently covered in auth service tests

    /// //////////////////////////////////////////////////////////////
    // sendPasswordRecoveryEmail tests //////////////////////////////
    ////////////////////////////////////////////////////////////////

    // Testing error paths, success path covered in service tests
    @Test
    public void test_invalid_email_not_found() {
        String email = "invalid_email";
        AuthenticationService authService = mock(AuthenticationService.class);
        PasswordService passwordService = mock(PasswordService.class);
        AuthenticationController controller = new AuthenticationController(authService, passwordService);
        when(authService.authenticateExistingEmail(email)).thenReturn(false);

        ResponseEntity<String> response = controller.sendPasswordRecoveryEmail(email);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Email not found", response.getBody());
        verify(authService).authenticateExistingEmail(email);
        verifyNoInteractions(passwordService);
    }

    @Test
    public void test_too_many_requests() {
        // Arrange
        String email = "valid_email@example.com";
        AuthenticationService authService = mock(AuthenticationService.class);
        PasswordService passwordService = mock(PasswordService.class);
        AuthenticationController controller = new AuthenticationController(authService, passwordService);
        when(authService.authenticateExistingEmail(email)).thenThrow(new TooManyRequestsException("Too many requests"));

        // Act
        ResponseEntity<String> response = controller.sendPasswordRecoveryEmail(email);

        // Assert
        assertEquals(HttpStatus.TOO_MANY_REQUESTS, response.getStatusCode());
        assertEquals("Too many requests", response.getBody());
        verify(authService).authenticateExistingEmail(email);
        verifyNoInteractions(passwordService);
    }

    /// //////////////////////////////////////////////////////////////
    // resetUserPwd tests ///////////////////////////////////////////
    ////////////////////////////////////////////////////////////////

    @Test
    public void test_resetPassword_validEmailAndPassword() {
        // Arrange

        String encryptedPwd = "valid_encrypted_email";
        String newPwd = "new_password";

        try {
            passwordService.resetUserPwd(encryptedPwd, newPwd);
        } catch (Exception e) {
            fail("An error occurred: " + e.getMessage());
        }
    }
}
