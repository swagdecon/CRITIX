package com.popflix.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RegistrationResponse {
    private final AuthenticationResponse authenticationResponse;
    private final String message;
}
