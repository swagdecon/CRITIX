package com.popflix.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class TokenTypeTest {

    @Test
    void testTokenTypeBearer() {
        TokenType tokenType = TokenType.BEARER;
        assertEquals("BEARER", tokenType.name());
        assertEquals(0, tokenType.ordinal());
    }

    @Test
    void testTokenTypeRefresh() {
        TokenType tokenType = TokenType.REFRESH;
        assertEquals("REFRESH", tokenType.name());
        assertEquals(1, tokenType.ordinal());
    }
}
