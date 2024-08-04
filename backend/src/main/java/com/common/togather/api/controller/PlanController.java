package com.common.togather.api.controller;

import com.common.togather.api.request.PlanSaveRequest;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.PlanService;
import com.common.togather.common.util.JwtUtil;
import com.common.togather.db.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
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
    public ResponseEntity<ResponseDto<String>> createPlan(@PathVariable(name = "teamId") int teamId, @RequestBody PlanSaveRequest planSaveRequest, @RequestHeader(value = "Authorization", required = false) String header){

        planService.savePlan(teamId, jwtUtil.getAuthMemberEmail(header), planSaveRequest);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.CREATED.value())
                .message("일정 생성에 성공했습니다.")
                .data(null)
                .build();
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

}
