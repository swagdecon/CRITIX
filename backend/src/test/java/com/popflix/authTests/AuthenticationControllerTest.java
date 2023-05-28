
package com.popflix.authTests;

import com.popflix.auth.AuthenticationController;
import com.popflix.auth.AuthenticationRequest;
import com.popflix.auth.AuthenticationResponse;
import com.popflix.auth.AuthenticationService;
import com.popflix.auth.RegisterRequest;
import com.popflix.config.customExceptions.UserAlreadyExistsException;
import com.popflix.config.customExceptions.UserAlreadyLoggedInException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

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

        // Tests user gets successfully registered
        RegisterRequest request = new RegisterRequest();
        when(service.register(request)).thenReturn(new AuthenticationResponse("Registration Successful", null));
        ResponseEntity<?> response = controller.register(request);
        assertEquals(ResponseEntity.ok(new AuthenticationResponse("Registration Successful", null)), response);
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
