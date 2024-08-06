package com.common.togather.api.error;

public class PlaceAlreadyExistsException extends RuntimeException{
    public PlaceAlreadyExistsException(String message) {
        super(message);
    }
}
