package com.critix.config.customExceptions;

public class ErrSendEmail extends RuntimeException {
    public ErrSendEmail(String message) {
        super(message);
    }
}
