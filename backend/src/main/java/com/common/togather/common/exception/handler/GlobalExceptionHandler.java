package com.common.togather.common.exception.handler;

import com.common.togather.api.error.InsufficientBalanceException;
import com.common.togather.api.error.PayAccountNotFoundException;
import com.common.togather.api.response.ErrorResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 서버 에러
    @ExceptionHandler(Exception.class)
    public final ResponseEntity<ErrorResponseDto> handleAllExceptions(Exception ex) {
        ErrorResponseDto error = new ErrorResponseDto("Server Error", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 잔액 부족 예외 처리
    @ExceptionHandler(InsufficientBalanceException.class)
    public final ResponseEntity<ErrorResponseDto> handleInsufficientBalanceException(InsufficientBalanceException ex) {
        ErrorResponseDto error = new ErrorResponseDto("Insufficient Balance", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PayAccountNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handlePayAccountNotFoundException(PayAccountNotFoundException ex) {
        ErrorResponseDto error = new ErrorResponseDto("Pay Account Not Found", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
}
