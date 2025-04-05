package com.critix.repository;

import com.critix.model.User;
import com.critix.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserRepositoryTest {

    @Mock
    private UserRepository userRepository;

    @Test
    void testFindByEmail() {
        String email = "test@example.com";
        User user = new User();
        user.setId("1");
        user.setEmail(email);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        Optional<User> result = userRepository.findByEmail(email);

        assertEquals(Optional.of(user), result);
        verify(userRepository, times(1)).findByEmail(email);
    }
}
