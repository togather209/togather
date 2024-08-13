package com.common.togather.api.error;

public class LoginMethodMismatchException extends RuntimeException{
    public LoginMethodMismatchException(String message) {
        super(message);
    }
}
