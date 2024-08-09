package com.common.togather.api.controller;


import com.common.togather.api.response.ErrorResponseDto;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.PaymentApprovalService;
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
@RequestMapping("/api/teams/{teamId}/plans/{planId}/payments")
@RequiredArgsConstructor
public class PaymentApprovalController {

    //정산 요청
    private final JwtUtil jwtUtil;
    private final PaymentApprovalService paymentApprovalService;

    //정산 요청
    @Operation(summary = "정산 요청")
    @PostMapping("/approval")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "정산 요청을 성공했습니다."
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "정산 요청에 접근 권환이 없습니다.",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "해당 일정은 존재하지 않습니다.",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))
            ),

    })
    public ResponseEntity<ResponseDto<String>> savePaymentApprovalByPlanId(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable(name = "planId") int planId) {

        paymentApprovalService.findPaymentApprovalByPlanId(jwtUtil.getAuthMemberEmail(token), planId);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("정산 요청을 성공했습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}
