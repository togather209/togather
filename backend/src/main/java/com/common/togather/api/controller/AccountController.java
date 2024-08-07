package com.common.togather.api.controller;

import com.common.togather.api.request.AccountVerificationRequest;
import com.common.togather.api.response.PayAccountFindByMemberIdResponse;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.AccountService;
import com.common.togather.common.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final JwtUtil jwtUtil;

    // 가상 계좌 인증
    @Operation(summary = "가상 계좌 인증")
    @PostMapping("/verify")
    public ResponseEntity<ResponseDto<String>> verifyAccount(@RequestHeader(value = "Authorization", required = false) String token, @RequestBody AccountVerificationRequest requestDto) {
        accountService.verifyAccount(jwtUtil.getAuthMemberEmail(token), requestDto);
        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("계좌인증을 성공했습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}
