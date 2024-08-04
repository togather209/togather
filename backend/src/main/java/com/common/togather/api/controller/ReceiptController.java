package com.common.togather.api.controller;

import com.common.togather.api.response.ErrorResponseDto;
import com.common.togather.api.response.ReceiptFindByReceiptIdResponse;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.ReceiptService;
import com.common.togather.common.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams/{teamId}/plans/{planId}")
@RequiredArgsConstructor
public class ReceiptController {

    private final ReceiptService receiptService;
    private final JwtUtil jwtUtil;

    // 영수증 상세 조회
    @Operation(summary = "영수증 상세 조회")
    @GetMapping("/receipts/{receiptId}")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "영수증 상세 조회를 성공했습니다."
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "2팀에 user1@example.com유저가 존재하지 않습니다.",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "3번 영수증이 존재하지 않습니다.",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))
            )
    })
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
