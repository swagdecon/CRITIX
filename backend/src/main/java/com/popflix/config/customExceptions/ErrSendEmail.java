package com.popflix.config.customExceptions;

public class ErrSendEmail extends RuntimeException {
    public ErrSendEmail(String message) {
        super(message);
    }
}
