package com.common.togather.api.error;

public class TeamJoinBlockedException extends RuntimeException {
    public TeamJoinBlockedException(String message) {
        super(message);
    }
}