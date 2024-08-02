package com.common.togather.api.controller;

import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.response.TransactionAllFindByMemberIdResponse;
import com.common.togather.api.response.TransactionFindByTransactionIdResponse;
import com.common.togather.api.service.TransactionService;
import com.common.togather.common.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final JwtUtil jwtUtil;

    // 나의 거래내역 조회
    @Operation(summary = "나의 거래내역 조회")
    @GetMapping("/members/me")
    public ResponseEntity<ResponseDto<List<TransactionAllFindByMemberIdResponse>>> findAllTransaction(@RequestHeader(value = "Authorization", required = false) String token) {

        ResponseDto<List<TransactionAllFindByMemberIdResponse>> responseDto = ResponseDto.<List<TransactionAllFindByMemberIdResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("나의 거래내역 조회를 성공했습니다.")
                .data(transactionService.findAllTransaction(jwtUtil.getAuthMemberEmail(token)))
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 거래내역 상세 조회
    @Operation(summary = "거래내역 상세 조회")
    @GetMapping("/{transactionId}")
    public ResponseEntity<ResponseDto<TransactionFindByTransactionIdResponse>> findTransaction(@PathVariable int transactionId) {

        ResponseDto<TransactionFindByTransactionIdResponse> responseDto = ResponseDto.<TransactionFindByTransactionIdResponse>builder()
                .status(HttpStatus.OK.value())
                .message("거래내역 상세 조회를 성공했습니다.")
                .data(transactionService.findTransaction(transactionId))
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}
