package com.common.togather.api.error;

public class VerificationCodeSendException extends RuntimeException {
    public VerificationCodeSendException(String message) {
        super(message);
    }
}
