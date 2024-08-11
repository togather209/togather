package com.common.togather.api.error;

public class InvalidPlanStatusException extends RuntimeException {
    public InvalidPlanStatusException(String message) {
        super(message);
    }
}