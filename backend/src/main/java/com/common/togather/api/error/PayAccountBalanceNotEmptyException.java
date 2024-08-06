package com.common.togather.api.error;

public class PayAccountBalanceNotEmptyException extends RuntimeException {
    public PayAccountBalanceNotEmptyException(String message) {
        super(message);
    }
}
