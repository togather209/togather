package com.common.togather.api.error;

public class MemberNotInTeamException extends RuntimeException {
    public MemberNotInTeamException(String message) {
        super(message);
    }
}
