package com.popflix.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class WatchlistTest {

    @Test
    public void testConstructorWithParameters() {
        Long userId = 1L;
        Integer movieId = 123;

        Watchlist watchlist = new Watchlist(userId, movieId);

        assertNull(watchlist.getId());
        assertEquals(userId, watchlist.getUserid());
        assertEquals(movieId, watchlist.getMovieid());
    }

    @Test
    public void testConstructorWithIdParameter() {
        Long id = 1L;
        Long userId = 1L;
        Integer movieId = 123;

        Watchlist watchlist = new Watchlist(id, userId, movieId);

        assertEquals(id, watchlist.getId());
        assertEquals(userId, watchlist.getUserid());
        assertEquals(movieId, watchlist.getMovieid());
    }

    @Test
    public void testDefaultConstructor() {
        Watchlist watchlist = new Watchlist();

        assertNull(watchlist.getId());
        assertNull(watchlist.getUserid());
        assertNull(watchlist.getMovieid());
    }

    @Test
    public void testSettersAndGetters() {
        Watchlist watchlist = new Watchlist();

        Long id = 1L;
        Long userId = 1L;
        Integer movieId = 123;

        watchlist.setId(id);
        watchlist.setUserid(userId);
        watchlist.setMovieid(movieId);

        assertEquals(id, watchlist.getId());
        assertEquals(userId, watchlist.getUserid());
        assertEquals(movieId, watchlist.getMovieid());
    }
}
