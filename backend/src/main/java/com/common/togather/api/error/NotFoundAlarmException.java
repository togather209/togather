package com.common.togather.api.error;

public class NotFoundAlarmException extends RuntimeException {
    public NotFoundAlarmException(String message) {
        super(message);
    }
}
