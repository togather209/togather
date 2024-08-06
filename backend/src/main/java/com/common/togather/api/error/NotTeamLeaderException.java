package com.common.togather.api.error;

public class NotTeamLeaderException extends RuntimeException {
    public NotTeamLeaderException(String message) {
        super(message);
    }
}

