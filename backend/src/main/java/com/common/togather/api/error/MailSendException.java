package com.common.togather.api.error;

public class MailSendException extends RuntimeException {
    public MailSendException(String message) {
        super(message);
    }
}
