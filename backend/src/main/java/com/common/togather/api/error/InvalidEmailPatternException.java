package com.common.togather.api.error;

public class InvalidEmailPatternException extends RuntimeException{
    public InvalidEmailPatternException(String message) {
        super(message);
    }
}
