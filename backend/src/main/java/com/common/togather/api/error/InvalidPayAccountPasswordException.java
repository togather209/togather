package com.common.togather.api.error;

public class InvalidPayAccountPasswordException extends RuntimeException {
    public InvalidPayAccountPasswordException(String message) {
        super(message);
    }
}
