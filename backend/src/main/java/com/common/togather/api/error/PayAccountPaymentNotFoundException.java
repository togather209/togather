package com.common.togather.api.error;

public class PayAccountPaymentNotFoundException extends RuntimeException {
    public PayAccountPaymentNotFoundException(String message) {
        super(message);
    }
}
