package com.common.togather.api.controller;

import com.common.togather.api.request.*;
import com.common.togather.api.response.PayAccountFindByMemberIdResponse;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.PayAccountService;
import com.common.togather.common.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pay-accounts")
@RequiredArgsConstructor
public class PayAccountController {

    private final PayAccountService payAccountService;
    private final JwtUtil jwtUtil;

    // 나의 Pay 계좌 조회
    @Operation(summary = "나의 Pay 계좌 조회")
    @GetMapping("/members/me")
    public ResponseEntity<ResponseDto<PayAccountFindByMemberIdResponse>> findPayAccountByMemberId(@RequestHeader(value = "Authorization", required = false) String token) {

        ResponseDto<PayAccountFindByMemberIdResponse> responseDto = ResponseDto.<PayAccountFindByMemberIdResponse>builder()
                .status(HttpStatus.OK.value())
                .message("나의 계좌 조회를 성공했습니다.")
                .data(payAccountService.findPayAccountByMemberId(jwtUtil.getAuthMemberEmail(token)))
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // Pay 계좌 생성하기
    @Operation(summary = "Pay 계좌 생성하기")
    @PostMapping()
    public ResponseEntity<ResponseDto<String>> savePayAccount(@RequestBody PayAccountSaveRequest requestDto, @RequestHeader(value = "Authorization", required = false) String token) {

         payAccountService.savePayAccount(jwtUtil.getAuthMemberEmail(token), requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("계좌 생성에 성공했습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // Pay 계좌 삭제하기
    @Operation(summary = "Pay 계좌 삭제하기")
    @DeleteMapping("/members/me")
    public ResponseEntity<ResponseDto<String>> deletePayAccount(@RequestBody PayAccountDeleteRequest requestDto, @RequestHeader(value = "Authorization", required = false) String token) {

        payAccountService.deletePayAccount(jwtUtil.getAuthMemberEmail(token), requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("계좌 삭제에 성공했습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // Pay 계좌 충전하기

    @Operation(summary = "Pay 계좌 충전하기")
    @PostMapping("/recharge")
    public ResponseEntity<ResponseDto<String>> rechargePayAccount(@RequestBody PayAccountRechargeRequest requestDto, @RequestHeader(value = "Authorization", required = false) String token) {
        payAccountService.rechargePayAccount(jwtUtil.getAuthMemberEmail(token), requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("충전을 성공했습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 송금하기
    @Operation(summary = "송금하기")
    @PostMapping("/transfer")
    public ResponseEntity<ResponseDto<String>> transferPayAccount(@RequestBody PayAccountTransferRequest requestDto, @RequestHeader(value = "Authorization", required = false) String token) {
        payAccountService.transferPayAccount(jwtUtil.getAuthMemberEmail(token), requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("송금을 성공했습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 출금하기
    @Operation(summary = "출금하기")
    @PostMapping("/withdraw")
    public ResponseEntity<ResponseDto<String>> withdrawPayAccount(@RequestBody PayAccountWithdrawRequest requestDto, @RequestHeader(value = "Authorization", required = false) String token) {
        payAccountService.withDrawPayAccount(jwtUtil.getAuthMemberEmail(token), requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("출금을 성공했습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}