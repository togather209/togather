package com.common.togather.common.exception.handler;

import com.common.togather.api.error.*;
import com.common.togather.api.response.ErrorResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

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

    // Pay 계좌가 비밀번호가 틀린 경우
    @ExceptionHandler(InvalidPayAccountPasswordException.class)
    public ResponseEntity<ErrorResponseDto> handleInvalidPayAccountPasswordException(InvalidPayAccountPasswordException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Invalid Pay Account Password", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Pay 계좌에 금액이 존재하는 경우
    @ExceptionHandler(PayAccountBalanceNotEmptyException.class)
    public ResponseEntity<ErrorResponseDto> handlePayAccountBalanceNotEmptyException(PayAccountBalanceNotEmptyException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Pay Account Balance Not Empty", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // 해당 거래내역을 찾을 수 없는 경우
    @ExceptionHandler(TransactionNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleTransactionNotFoundException(TransactionNotFoundException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Transaction Not Found", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // 모임을 찾을 수 없는 경우
    @ExceptionHandler(TeamNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleTeamNotFoundException(TeamNotFoundException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Team Not Found", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    
    // 가입된 이메일이 이미 있는 경우
    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDto> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Email Already Exists", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }
    
    // 가입된 닉네임이 이미 있는 경우
    @ExceptionHandler(NicknameAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDto> handleNicknameAlreadyExistsException(NicknameAlreadyExistsException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Nickname Already Exists", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    // 가입되지 않은 이메일인 경우
    @ExceptionHandler(EmailNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleEmailNotFoundException(EmailNotFoundException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Email Not Found", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // 비밀번호가 일치하지 않는 경우
    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ErrorResponseDto> handleInvalidPasswordException(InvalidPasswordException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Invalid Password", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    // 토큰을 찾을 수 없는 경우
    @ExceptionHandler(MissingTokenException.class)
    public ResponseEntity<ErrorResponseDto> handleMissingTokenException(MissingTokenException ex) {
        ErrorResponseDto error = new ErrorResponseDto("Token Not Found", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    // 인증코드 메일 전송 실패한 경우
    @ExceptionHandler(VerificationCodeSendException.class)
    public ResponseEntity<ErrorResponseDto> handleVerificationCodeSendException(VerificationCodeSendException ex) {
        ErrorResponseDto error = new ErrorResponseDto("Verification Code Send", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 입력한 이메일 주소가 잘못 되었을 때
    @ExceptionHandler(InvalidEmailPatternException.class)
    public ResponseEntity<ErrorResponseDto> handleInvalidEmailPatternException(InvalidEmailPatternException ex) {
        ErrorResponseDto error = new ErrorResponseDto("Invalid Email Pattern", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    
    // 유효성 에러
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponseDto error = new ErrorResponseDto("Validation Exception", errors);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }


}
