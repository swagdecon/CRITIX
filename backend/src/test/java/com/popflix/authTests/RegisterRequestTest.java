package com.popflix.authTests;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import com.popflix.auth.RegisterRequest;

public class RegisterRequestTest {

    @Test
    public void testRegisterRequest() {
        // Create an instance of RegisterRequest
        RegisterRequest registerRequest = RegisterRequest.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("password123")
                .build();

        // Verify the values of the RegisterRequest instance
        Assertions.assertEquals("John", registerRequest.getFirstName());
        Assertions.assertEquals("Doe", registerRequest.getLastName());
        Assertions.assertEquals("john.doe@example.com", registerRequest.getEmail());
        Assertions.assertEquals("password123", registerRequest.getPassword());
    }
}
