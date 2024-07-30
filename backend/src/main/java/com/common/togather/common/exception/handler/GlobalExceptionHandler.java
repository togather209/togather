package com.common.togather.common.exception.handler;

import com.common.togather.api.error.EmailAlreadyExistsException;
import com.common.togather.api.error.InsufficientBalanceException;
import com.common.togather.api.error.NicknameAlreadyExistsException;
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
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Server Error", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 잔액이 부족할 경우
    @ExceptionHandler(InsufficientBalanceException.class)
    public final ResponseEntity<ErrorResponseDto> handleInsufficientBalanceException(InsufficientBalanceException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Insufficient Balance", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Pay 계좌가 존재 하지 않을 경우
    @ExceptionHandler(PayAccountNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handlePayAccountNotFoundException(PayAccountNotFoundException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Pay Account Not Found", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDto> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Email Already Exists", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(NicknameAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDto> handleNicknameAlreadyExistsException(NicknameAlreadyExistsException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Nickname Already Exists", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }
}
