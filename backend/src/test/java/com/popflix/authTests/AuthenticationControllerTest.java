
package com.popflix.authTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.popflix.auth.AuthenticationController;
import com.popflix.auth.AuthenticationRequest;
import com.popflix.auth.AuthenticationResponse;
import com.popflix.auth.AuthenticationService;
import com.popflix.auth.RegisterRequest;
import com.popflix.auth.RegistrationResponse;
import com.popflix.config.customExceptions.UserAlreadyExistsException;
import com.popflix.config.customExceptions.UserAlreadyLoggedInException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

class AuthenticationControllerTest {

    @Mock
    private AuthenticationService service;

    @InjectMocks
    private AuthenticationController controller;

    @Mock
    private HttpServletRequest httpRequest;

    @Mock
    private HttpServletResponse httpResponse;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegister() throws UserAlreadyExistsException {

        // Mock the behavior of the service's register method
        RegisterRequest request = new RegisterRequest();
        RegistrationResponse registrationResponse = new RegistrationResponse(
                new AuthenticationResponse("AccessToken", "RefreshToken"),
                "User registered successfully");
        when(service.register(request)).thenReturn(registrationResponse);

        // Call the controller method under test
        ResponseEntity<?> response = controller.register(request);

        // Assert the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(registrationResponse, response.getBody());
    }

    @Test
    void testRegisteredUserAlreadyExists() throws UserAlreadyExistsException {
        // Functionality to check if user has already been registered
        RegisterRequest request = new RegisterRequest();
        when(service.register(request))
                .thenThrow(new UserAlreadyExistsException("A User With This Email Already Exists"));
        ResponseEntity<?> response = controller.register(request);
        assertEquals(ResponseEntity.badRequest().body("A User With This Email Already Exists"), response);
    }

    @Test
    void testAuthenticate() throws UsernameNotFoundException, UserAlreadyLoggedInException {

        // Tests that a user is found during login
        AuthenticationRequest request = new AuthenticationRequest();
        when(service.authenticate(request, httpRequest))
                .thenReturn(new AuthenticationResponse("Authentication Successful", null));
        ResponseEntity<?> response = controller.authenticate(request, httpRequest);
        assertEquals(ResponseEntity.ok(new AuthenticationResponse("Authentication Successful", null)), response);
    }

    @Test
    void testAuthenticatedUserNotFound() throws UsernameNotFoundException, UserAlreadyLoggedInException {
        // Tests the functionality to check if user is not found during login
        AuthenticationRequest request = new AuthenticationRequest();
        when(service.authenticate(request, httpRequest)).thenThrow(new UsernameNotFoundException("User not found"));
        ResponseEntity<?> response = controller.authenticate(request, httpRequest);
        assertEquals(ResponseEntity.badRequest().body("Email or Password Not Found"), response);
    }

    @Test
    void testAuthenticatedUserAlreadyLoggedIn() throws UsernameNotFoundException, UserAlreadyLoggedInException {
        // Tests if user is already logged in
        AuthenticationRequest request = new AuthenticationRequest();
        when(service.authenticate(request, httpRequest))
                .thenThrow(new UserAlreadyLoggedInException("User is already logged in"));
        ResponseEntity<?> response = controller.authenticate(request, httpRequest);
        assertEquals(ResponseEntity.badRequest().body("User is already logged in"), response);
    }

    // @Test
    // void testRefreshToken() throws Exception {
    // controller.refreshToken(httpRequest, httpResponse);
    // // Add assertions or verify some behavior if needed
    // }
}
