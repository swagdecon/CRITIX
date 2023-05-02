package com.popflix.auth;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.popflix.config.customExceptions.UserAlreadyExistsException;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

        private final AuthenticationService service;

        @PostMapping("/register")
        public ResponseEntity<?> register(
                        @RequestBody RegisterRequest request) {
                try {
                        return ResponseEntity.ok(service.register(request));
                } catch (UserAlreadyExistsException ex) {
                        return ResponseEntity.badRequest().body("*A User With This Email Already Exists*");
                }
        }

        @PostMapping("/authenticate")
        public ResponseEntity<?> authenticate(
                        @RequestBody AuthenticationRequest request, HttpServletRequest httpRequest) {
                return ResponseEntity.ok(service.authenticate(request, httpRequest));

        }

        @PostMapping("/refresh-token")
        public void refreshToken(
                        HttpServletRequest request, HttpServletResponse response)
                        throws StreamWriteException, DatabindException, IOException, java.io.IOException {
                service.refreshToken(request, response);

        }
}