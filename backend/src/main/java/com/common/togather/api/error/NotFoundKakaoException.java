package com.common.togather.api.error;

public class NotFoundKakaoCodeException extends RuntimeException {
    public NotFoundKakaoCodeException(String message) {
        super(message);
    }
}
