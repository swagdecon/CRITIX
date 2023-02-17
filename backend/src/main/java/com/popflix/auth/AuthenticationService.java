package com.popflix.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mongodb.MongoWriteException;
import com.popflix.config.JwtService;
import com.popflix.model.Role;
import com.popflix.model.User;
import com.popflix.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthenticationResponse register(RegisterRequest request) throws Exception {
                try {
                        var user = User.builder()
                                        .firstname(request.getFirstname())
                                        .lastname(request.getLastname())
                                        .email(request.getEmail())
                                        .password(passwordEncoder.encode(request.getPassword()))
                                        .role(Role.USER)
                                        .build();
                        repository.save(user);
                        var jwtToken = jwtService.generateToken(user);
                        return AuthenticationResponse.builder()
                                        .token(jwtToken)
                                        .build();
                } catch (MongoWriteException ex) {
                        throw new Exception("Error: Unable to save user. " + ex.getMessage());

                }
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UsernameNotFoundException("Email or Password Not Found"));
                var jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .build();
        }
}
