package com.common.togather.api.error;

public class TeamJoinRequestAlreadyExistsException extends RuntimeException {
    public TeamJoinRequestAlreadyExistsException(String message) {
        super(message);
    }
}