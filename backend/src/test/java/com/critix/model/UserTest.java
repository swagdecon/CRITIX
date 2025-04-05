package com.critix.model;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.critix.model.Role;
import com.critix.model.User;

import java.util.Collection;
import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void testGetAuthorities() {
        User user = new User();
        user.setRole(Role.ADMIN);

        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();
        assertEquals(1, authorities.size());
        assertTrue(authorities.contains(new SimpleGrantedAuthority(Role.ADMIN.name())));
    }

    @Test
    void testIsAccountNonExpired() {
        User user = new User();
        assertTrue(user.isAccountNonExpired());
    }

    @Test
    void testIsAccountNonLocked() {
        User user = new User();
        assertTrue(user.isAccountNonLocked());
    }

    @Test
    void testIsCredentialsNonExpired() {
        User user = new User();
        assertTrue(user.isCredentialsNonExpired());
    }

    @Test
    void testIsEnabled() {
        User user = new User();
        assertTrue(user.isEnabled());
    }
}
