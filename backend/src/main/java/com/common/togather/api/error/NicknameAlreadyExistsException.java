package com.common.togather.api.error;

public class NicknameAlreadyExistsException extends RuntimeException{
    public NicknameAlreadyExistsException(String message) {
        super(message);
    }
}
