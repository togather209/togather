package com.common.togather.api.error;

public class AccountVerificationException extends RuntimeException {
    public AccountVerificationException(String message) {
        super(message);
    }
}
