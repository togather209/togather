package com.common.togather.api.error;

public class NotFoundPaymentApprovalException extends RuntimeException {
    public NotFoundPaymentApprovalException(String message) {
        super(message);
    }
}
