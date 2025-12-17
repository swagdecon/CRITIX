package com.critix.config.customExceptions;

public class UserEmailNotAuthenticated extends RuntimeException {
    public UserEmailNotAuthenticated(String message) {
        super(message);
    }
}
