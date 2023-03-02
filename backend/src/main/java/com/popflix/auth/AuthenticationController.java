package com.popflix.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.popflix.repository.UserAlreadyExistsException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

        private final AuthenticationService service;

        @PostMapping("/register")
        public ResponseEntity<?> register(
                        @RequestBody RegisterRequest request) {
                try {
                        return ResponseEntity.ok(service.register(request));
                } catch (UserAlreadyExistsException ex) {
                        return ResponseEntity.badRequest().body("*A User with this email already exists*");
                }
        }

        @PostMapping("/authenticate")
        public ResponseEntity<AuthenticationResponse> authenticate(
                        @RequestBody AuthenticationRequest request) {
                return ResponseEntity.ok(service.authenticate(request));
        }

}