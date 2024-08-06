package com.common.togather.api.error;

public class MemberTeamNotFoundException extends RuntimeException {
    public MemberTeamNotFoundException(String message) {
        super(message);
    }
}
