package com.common.togather.api.error;

public class PayAccountNotFoundException extends RuntimeException {
    public PayAccountNotFoundException(String message) {
        super(message);
    }
}
