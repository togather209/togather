package com.common.togather.api.controller;

import com.common.togather.api.request.PayAccountRechargeRequest;
import com.common.togather.api.request.PayAccountTransferRequest;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.PayAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pay-accounts")
@RequiredArgsConstructor
public class PayAccountController {

    private final PayAccountService payAccountService;

    // Pay 계좌 충전하기
    @PostMapping("/recharge")
    public ResponseEntity<ResponseDto<String>> rechargePayAccount(@RequestBody PayAccountRechargeRequest requestDto) {
        payAccountService.rechargePayAccount(1, requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("충전을 성공했습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 송금하기
    @PostMapping("/transfer")
    public ResponseEntity<ResponseDto<String>> transferPayAccount(@RequestBody PayAccountTransferRequest requestDto) {
        payAccountService.transferPayAccount(1, requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("송금을 성공했습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}