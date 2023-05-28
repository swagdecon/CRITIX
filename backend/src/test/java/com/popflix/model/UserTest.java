package com.popflix.model;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collection;
import static org.junit.jupiter.api.Assertions.*;

public class UserTest {

    @Test
    public void testGetAuthorities() {
        User user = new User();
        user.setRole(Role.ADMIN);

        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();
        assertEquals(1, authorities.size());
        assertTrue(authorities.contains(new SimpleGrantedAuthority(Role.ADMIN.name())));
    }

    @Test
    public void testIsAccountNonExpired() {
        User user = new User();
        assertTrue(user.isAccountNonExpired());
    }

    @Test
    public void testIsAccountNonLocked() {
        User user = new User();
        assertTrue(user.isAccountNonLocked());
    }

    @Test
    public void testIsCredentialsNonExpired() {
        User user = new User();
        assertTrue(user.isCredentialsNonExpired());
    }

    @Test
    public void testIsEnabled() {
        User user = new User();
        assertTrue(user.isEnabled());
    }
}
