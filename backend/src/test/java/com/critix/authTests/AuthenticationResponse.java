package com.critix.authTests;

import com.critix.auth.AuthenticationResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AuthenticationResponseTest {

    @Test
    void testAuthenticationResponseConstructor() {
        String accessToken = "access_token";
        String refreshToken = "refresh_token";
        AuthenticationResponse response = new AuthenticationResponse(accessToken, refreshToken);
        assertEquals(accessToken, response.getAccessToken());
        assertEquals(refreshToken, response.getRefreshToken());
    }

    @Test
    void testAuthenticationResponseGettersAndSetters() {
        String accessToken = "access_token";
        String refreshToken = "refresh_token";
        AuthenticationResponse response = new AuthenticationResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        assertEquals(accessToken, response.getAccessToken());
        assertEquals(refreshToken, response.getRefreshToken());
    }
}