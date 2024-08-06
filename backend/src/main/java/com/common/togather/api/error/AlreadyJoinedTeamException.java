package com.common.togather.api.error;

public class AlreadyJoinedTeamException extends RuntimeException {
    public AlreadyJoinedTeamException(String message) {
        super(message);
    }
}

