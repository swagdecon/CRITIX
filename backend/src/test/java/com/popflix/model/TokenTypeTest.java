package com.popflix.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class TokenTypeTest {

    @Test
    public void testTokenTypeBearer() {
        TokenType tokenType = TokenType.BEARER;
        assertEquals("BEARER", tokenType.name());
        assertEquals(0, tokenType.ordinal());
    }

    @Test
    public void testTokenTypeRefresh() {
        TokenType tokenType = TokenType.REFRESH;
        assertEquals("REFRESH", tokenType.name());
        assertEquals(1, tokenType.ordinal());
    }
}
