package com.critix.config;

import org.mockito.Mock;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import com.critix.config.ApplicationConfig;
import com.critix.model.User;
import com.critix.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Optional;

class ApplicationConfigTest {
    @Mock
    private UserRepository userRepository;

    @BeforeEach
    public void setup() {
        userRepository = Mockito.mock(UserRepository.class);
    }

    @Test
    void testUserDetailsService() {
        ApplicationConfig applicationConfig = new ApplicationConfig(userRepository);

        // Mock the behavior of UserRepository.findByEmail
        Mockito.when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(new User()));

        // Test the UserDetailsService
        Assertions.assertThrows(UsernameNotFoundException.class,
                () -> applicationConfig.userDetailsService().loadUserByUsername(null));
    }

    @Test
    void testAuthenticationProvider() {
        ApplicationConfig applicationConfig = new ApplicationConfig(userRepository);

        // Test the AuthenticationProvider
        Assertions.assertNotNull(applicationConfig.authenticationProvider());
    }

    @Test
    void testPasswordEncoder() {
        ApplicationConfig applicationConfig = new ApplicationConfig(userRepository);

        // Test the PasswordEncoder
        Assertions.assertNotNull(applicationConfig.passwordEncoder());
        Assertions.assertTrue(applicationConfig.passwordEncoder() instanceof BCryptPasswordEncoder);
    }

    @Test
    void testAuthenticationManager() throws Exception {
        ApplicationConfig applicationConfig = new ApplicationConfig(userRepository);

        // Mock the behavior of AuthenticationConfiguration.getAuthenticationManager
        AuthenticationManager authenticationManager = Mockito.mock(AuthenticationManager.class);
        AuthenticationConfiguration authenticationConfiguration = Mockito.mock(AuthenticationConfiguration.class);
        Mockito.when(authenticationConfiguration.getAuthenticationManager())
                .thenReturn(authenticationManager);

        // Test the AuthenticationManager
        Assertions.assertNotNull(applicationConfig.authenticationManager(authenticationConfiguration));
    }
}
