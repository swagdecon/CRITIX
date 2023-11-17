package com.popflix.config.customExceptions;

public class UserEmailNotAuthenticated extends RuntimeException {
    public UserEmailNotAuthenticated(String message) {
        super(message);
    }
}
