package com.popflix.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.popflix.config.JwtService;
import com.popflix.config.customExceptions.UserAlreadyExistsException;
import com.popflix.model.Role;
import com.popflix.model.TokenType;
import com.popflix.model.User;
import com.popflix.model.Token;
import com.popflix.repository.TokenRepository;
import com.popflix.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
        private final UserRepository userRepository;
        private final TokenRepository tokenRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthenticationResponse register(RegisterRequest request) {

                if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                        throw new UserAlreadyExistsException("*A User With This Email Already Exists*");
                }

                var user = User.builder()
                                .firstname(request.getFirstname())
                                .lastname(request.getLastname())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(Role.USER)
                                .build();
                userRepository.save(user);
                var jwtToken = jwtService.generateToken(user);
                var savedUser = userRepository.save(user);

                saveUserToken(savedUser, jwtToken);

                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .build();
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletRequest httpRequest) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                var user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UsernameNotFoundException("Email or Password Not Found"));

                var jwtToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, jwtToken);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .build();

        }

        private void revokeAllUserTokens(User user) {
                var validUserTokens = tokenRepository.findAllValidTokensByUser(user.getId());
                if (validUserTokens.isEmpty())
                        return;
                validUserTokens.forEach(t -> {
                        t.setExpired(true);
                        t.setRevoked(true);
                });
                tokenRepository.saveAll(validUserTokens);
        }

        private void saveUserToken(User user, String jwtToken) {
                var token = Token.builder()
                                .user(user)
                                .userId(user.getId())
                                .token(jwtToken)
                                .tokenType(TokenType.BEARER)
                                .expired(false)
                                .revoked(false)
                                .build();
                tokenRepository.save(token);

        }
}
