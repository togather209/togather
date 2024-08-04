package com.common.togather.api.controller;

import com.common.togather.api.response.ReceiptFindByReceiptIdResponse;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.ReceiptService;
import com.common.togather.common.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groups/{teamId}/plans/{planId}")
@RequiredArgsConstructor
public class ReceiptController {

    private final ReceiptService receiptService;
    private final JwtUtil jwtUtil;

    // 영수증 상세 조회
    @Operation(summary = "영수증 상세 조회")
    @GetMapping("/receipts/{receiptId}")
    public ResponseEntity<ResponseDto<ReceiptFindByReceiptIdResponse>> findReceiptByReceiptId(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable(name = "teamId") int teamId,
            @PathVariable(name = "receiptId") int receiptId) {

        ResponseDto<ReceiptFindByReceiptIdResponse> responseDto = ResponseDto.<ReceiptFindByReceiptIdResponse>builder()
                .status(HttpStatus.OK.value())
                .message("영수증 상세 조회를 성공했습니다.")
                .data(receiptService.findReceiptByReceiptId(
                        jwtUtil.getAuthMemberEmail(token),
                        teamId,
                        receiptId))
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}
