package com.critix.authTests;

import com.critix.auth.AuthenticationRequest;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AuthenticationRequestTest {

    @Test
    void testAuthenticationRequestConstructor() {
        String email = "test@example.com";
        String password = "password";
        AuthenticationRequest request = new AuthenticationRequest(email, password);
        assertEquals(email, request.getEmail());
        assertEquals(password, request.getPassword());
    }

    @Test
    void testAuthenticationRequestGettersAndSetters() {
        String email = "test@example.com";
        String password = "password";
        AuthenticationRequest request = new AuthenticationRequest();
        request.setEmail(email);
        request.setPassword(password);
        assertEquals(email, request.getEmail());
        assertEquals(password, request.getPassword());
    }
}