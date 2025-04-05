package com.critix.repository;

import com.critix.model.Token;
import com.critix.repository.TokenRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TokenRepositoryTest {

    @Mock
    private TokenRepository tokenRepository;

    @Test
    void testFindAllValidTokensByUser() {
        String userId = "123";
        Token token1 = new Token();
        Token token2 = new Token();
        List<Token> tokens = new ArrayList<>();
        tokens.add(token1);
        tokens.add(token2);

        when(tokenRepository.findAllValidTokensByUser(userId)).thenReturn(tokens);

        List<Token> result = tokenRepository.findAllValidTokensByUser(userId);

        assertEquals(tokens, result);
        verify(tokenRepository, times(1)).findAllValidTokensByUser(userId);
    }

    @Test
    void testFindByToken() {
        String tokenValue = "abc123";
        Token token = new Token();

        when(tokenRepository.findByToken(tokenValue)).thenReturn(Optional.of(token));

        Optional<Token> result = tokenRepository.findByToken(tokenValue);

        assertEquals(Optional.of(token), result);
        verify(tokenRepository, times(1)).findByToken(tokenValue);
    }
}
