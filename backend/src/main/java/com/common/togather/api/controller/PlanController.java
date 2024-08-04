package com.common.togather.api.controller;

import com.common.togather.api.request.PlanSaveRequest;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.PlanService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;

//    @Operation(summary = "일정 생성")
//    @PostMapping("/{teamId}/plans")
//    public ResponseEntity<ResponseDto<String>> createPlan(@PathVariable int teamId, @RequestBody PlanSaveRequest request, @RequestHeader(HttpHeaders.AUTHORIZATION) String header){
//
//    }

}
