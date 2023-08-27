package com.popflix.auth;

import lombok.RequiredArgsConstructor;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.popflix.config.customExceptions.UserAlreadyExistsException;
import com.popflix.config.customExceptions.UserAlreadyLoggedInException;

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
                        return ResponseEntity.badRequest().body("A User With This Email Already Exists");
                }
        }

        @PostMapping("/authenticate")
        public ResponseEntity<?> authenticate(
                        @RequestBody AuthenticationRequest request, HttpServletRequest httpRequest) {
                try {
                        return ResponseEntity.ok(service.authenticate(request, httpRequest));
                } catch (UsernameNotFoundException ex) {
                        return ResponseEntity.badRequest().body("Email or Password Not Found");
                } catch (UserAlreadyLoggedInException ex) {
                        return ResponseEntity.badRequest().body("User is already logged in");
                }
        }

        @PostMapping("/refresh-token")
        public void refreshToken(
                        HttpServletRequest request, HttpServletResponse response)
                        throws StreamWriteException, DatabindException, IOException, java.io.IOException {
                service.refreshToken(request, response);

        }

        @PostMapping("/authenticate-existing-token")
        public ResponseEntity<?> authenticateExistingToken(HttpServletRequest request) {
                String authHeader = request.getHeader("Authorization");

                if (service.authenticateExistingToken(authHeader)) {
                        return ResponseEntity.ok("Token is valid");
                } else {
                        return ResponseEntity.badRequest().body("Invalid token");
                }
        }

}