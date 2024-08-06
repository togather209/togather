package com.common.togather.api.error;


public class PlansExistException extends RuntimeException {
    public PlansExistException(String message) {
        super(message);
    }
}
