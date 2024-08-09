package com.common.togather.api.controller;

import com.common.togather.api.request.PlanSaveRequest;
import com.common.togather.api.request.PlanUpdateRequest;
import com.common.togather.api.response.*;
import com.common.togather.api.service.PlanService;
import com.common.togather.common.util.JwtUtil;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
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
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;
    private final JwtUtil jwtUtil;

    @Operation(summary = "일정 생성")
    @PostMapping("/{teamId}/plans")
    public ResponseEntity<ResponseDto<PlanSaveResponse>> createPlan(@PathVariable(name = "teamId") int teamId, @RequestBody PlanSaveRequest planSaveRequest, @RequestHeader(value = "Authorization", required = false) String header) throws OpenViduJavaClientException, OpenViduHttpException {

        PlanSaveResponse response = planService.savePlan(teamId, jwtUtil.getAuthMemberEmail(header), planSaveRequest);

        ResponseDto<PlanSaveResponse> responseDto = ResponseDto.<PlanSaveResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("일정 생성에 성공했습니다.")
                .data(response)
                .build();
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @Operation(summary = "일정 상세 조회")
    @GetMapping("/{teamId}/plans/{planId}")
    public ResponseEntity<ResponseDto<PlanFindByPlanIdResponse>> getPlanDetail(@PathVariable(name = "teamId") int teamId, @PathVariable(name = "planId") int planId,
                                                                               @RequestHeader(value = "Authorization", required = false) String header) {

        PlanFindByPlanIdResponse response = planService.getPlanDetail(teamId, planId, jwtUtil.getAuthMemberEmail(header));

        ResponseDto<PlanFindByPlanIdResponse> responseDto = ResponseDto.<PlanFindByPlanIdResponse>builder()
                .status(HttpStatus.OK.value())
                .message("일정 상세 조회에 성공했습니다.")
                .data(response)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "일정 수정")
    @PatchMapping("/{teamId}/plans/{planId}")
    public ResponseEntity<ResponseDto<String>> updatePlan(@PathVariable(name = "teamId") int teamId,
                                                          @PathVariable(name = "planId") int planId,
                                                          @RequestHeader(value = "Authorization", required = false) String header,
                                                          @RequestBody PlanUpdateRequest planUpdateRequest) {

        planService.updatePlan(teamId, planId, jwtUtil.getAuthMemberEmail(header), planUpdateRequest);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("일정 수정을 성공했습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "일정 삭제")
    @DeleteMapping("/{teamId}/plans/{planId}")
    public ResponseEntity<ResponseDto<String>> deletePlan(@PathVariable(name = "teamId") int teamId, @PathVariable(name = "planId") int planId,
                                                          @RequestHeader(value = "Authorization", required = false) String header) {

        planService.deletePlan(teamId, planId, jwtUtil.getAuthMemberEmail(header));
        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("일정 삭제를 성공했습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 일정 권한 조회 확인
    @Operation(summary = "일정 권한 조회")
    @GetMapping("/{teamId}/plans/{planId}/auths")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "일정 권한 조회를 성공했습니다."
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "해당 일정은 존재하지 않습니다.",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class))
            )
    })
    public ResponseEntity<ResponseDto<PlanFindAuthAccessResponse>> planFindAuthAccess(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable(name = "planId") int planId) {

        ResponseDto<PlanFindAuthAccessResponse> responseDto = ResponseDto.<PlanFindAuthAccessResponse>builder()
                .status(HttpStatus.OK.value())
                .message("일정 권한 조회를 성공했습니다.")
                .data(planService.findAuthAccessPlan(
                        jwtUtil.getAuthMemberEmail(token),
                        planId))
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

}
