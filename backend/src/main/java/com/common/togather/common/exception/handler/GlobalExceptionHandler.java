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

    // 모임 요청을 벌써 했을 경우
    @ExceptionHandler(TeamJoinRequestAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDto> handleTeamJoinRequestAlreadyExistsException(TeamJoinRequestAlreadyExistsException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Join Request Already Exists", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    // 모임에 벌써 가입된 경우
    @ExceptionHandler(AlreadyJoinedTeamException.class)
    public ResponseEntity<ErrorResponseDto> handleAlreadyJoinedTeamException(AlreadyJoinedTeamException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Already Joined Team", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    // 모임에 요청을 할 수 없는 경우
    @ExceptionHandler(TeamJoinBlockedException.class)
    public ResponseEntity<ErrorResponseDto> handleTeamJoinBlockedException(TeamJoinBlockedException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Join Blocked", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    // 모임의 방장이 아닐 경우
    @ExceptionHandler(NotTeamLeaderException.class)
    public ResponseEntity<ErrorResponseDto> handleNotTeamLeaderException(NotTeamLeaderException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("permission error", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    // 정산 내역이 없는 경우
    @ExceptionHandler(PaymentNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handlePaymentNotFoundException(PaymentNotFoundException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Payment Not Found", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // 정산 되지 않은 일정이 존재하는 경우
    @ExceptionHandler(PlansExistException.class)
    public ResponseEntity<ErrorResponseDto> handlePlansExistException(PlansExistException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Plans Exist", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // 멤버가 팀에 없을 경우
    @ExceptionHandler(MemberNotInTeamException.class)
    public ResponseEntity<ErrorResponseDto> handleMemberNotInTeamException(MemberNotInTeamException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Member Not in Team", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // 계좌 인증이 실패한 경우
    @ExceptionHandler(AccountVerificationException.class)
    public ResponseEntity<ErrorResponseDto> handleAccountVerificationException(AccountVerificationException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Account verification failed", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
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
    @ExceptionHandler(MailSendException.class)
    public ResponseEntity<ErrorResponseDto> handleVerificationCodeSendException(MailSendException ex) {
        ErrorResponseDto error = new ErrorResponseDto("Failed to send email", ex.getMessage());
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

    // 유저가 존재하지 않는 경우
    @ExceptionHandler(MemberNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleMemberNotFoundException(MemberNotFoundException ex) {
        ErrorResponseDto error = new ErrorResponseDto("member Not Found", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // 유저가 모임에 존재하지 않는 경우
    @ExceptionHandler(MemberTeamNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleMemberTeamNotFoundException(MemberTeamNotFoundException ex) {
        ErrorResponseDto error = new ErrorResponseDto("Member Team Not Found", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // 영수증이 존재하지 않는 경우
    @ExceptionHandler(ReceiptNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleReceiptNotFoundException(ReceiptNotFoundException ex) {
        ErrorResponseDto error = new ErrorResponseDto("receipt Not Found", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // 북마크가 존재하지 않는 경우
    @ExceptionHandler(BookmarkNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleBookmarkNotFoundException(BookmarkNotFoundException ex) {
        ErrorResponseDto error = new ErrorResponseDto("bookmark Not Found", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // 일정이 존재하지 않는 경우
    @ExceptionHandler(PlanNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handlePlanNotFoundException(PlanNotFoundException ex) {
        ErrorResponseDto error = new ErrorResponseDto("plan Not Found", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // 접근 권한이 없는 경우
    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<ErrorResponseDto> handleUnauthorizedAccessException(UnauthorizedAccessException ex) {
        ErrorResponseDto error = new ErrorResponseDto("Unauthorized Access", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    // 삭제 조건이 맞지 않는 경우
    @ExceptionHandler(DeletionNotAllowedException.class)
    public ResponseEntity<ErrorResponseDto> handleDeletionNotAllowedException(DeletionNotAllowedException ex) {
        ErrorResponseDto error = new ErrorResponseDto("Deletion Not Allowed", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    // 이미 북마크에 있는 장소인 경우
    @ExceptionHandler(PlaceAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDto> handlePlaceAlreadyExistsException(PlaceAlreadyExistsException ex) {
        ErrorResponseDto error = new ErrorResponseDto("Place Already Exists", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    // 수정이 불가능한 경우 (영수증이 등록된 장소는 찜으로 이동 불가)
    @ExceptionHandler(UpdateNotAllwedException.class)
    public ResponseEntity<ErrorResponseDto> handleUpdateNotAllwedException(UpdateNotAllwedException ex) {
        ErrorResponseDto error = new ErrorResponseDto("Update Not Allwed", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    // 정산 요청이 존재하지 않는 경우
    @ExceptionHandler(NotFoundPaymentApprovalException.class)
    public ResponseEntity<ErrorResponseDto> handleNotFoundPaymentApprovalException(PlanNotFoundException ex) {
        ErrorResponseDto error = new ErrorResponseDto("payment approval Not Found", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // 정산 상태가 잘못된 경우
    @ExceptionHandler(InvalidPlanStatusException.class)
    public ResponseEntity<ErrorResponseDto> handleInvalidPlanStatusException(InvalidPlanStatusException ex) {
        ex.printStackTrace();
        ErrorResponseDto error = new ErrorResponseDto("Invalid plan status Password", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // 카카오 코드가 존재하지 않는 경우(유저가 동의 화면에서 카카오 로그인 취소했을 경우)
    @ExceptionHandler(NotFoundKakaoException.class)
    public ResponseEntity<ErrorResponseDto> handleNotFoundKakaoCodeException(PlanNotFoundException ex) {
        ErrorResponseDto error = new ErrorResponseDto("Kakao Code Not Found", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
}
