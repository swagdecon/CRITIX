package com.popflix.config.customExceptions;

public class FingerprintGeneratorException extends RuntimeException {
    public FingerprintGeneratorException(String message, Throwable cause) {
        super(message, cause);
    }
}
