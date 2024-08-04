package com.common.togather.api.controller;

import com.common.togather.api.request.TeamSaveRequest;
import com.common.togather.api.request.TeamUpdateRequest;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.response.TeamSaveResponse;
import com.common.togather.api.service.TeamService;
import com.common.togather.common.util.JwtUtil;
import com.common.togather.db.entity.Team;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;
    private final JwtUtil jwtUtil;


    @Operation(summary = "모임 생성")
    @PostMapping("")
    public  ResponseEntity<ResponseDto<TeamSaveResponse>> createTeam(@RequestHeader(value = "Authorization", required = false) String token, @RequestBody TeamSaveRequest requestDto) {
        TeamSaveResponse teamSaveResponseDto = teamService.saveTeam(jwtUtil.getAuthMemberEmail(token), requestDto);

        ResponseDto<TeamSaveResponse> responseDto = ResponseDto.<TeamSaveResponse>builder()
                .status(HttpStatus.OK.value())
                .message("모임 생성을 성공했습니다.")
                .data(teamSaveResponseDto)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);

    }

    // 모임 수정
    @Operation(summary = "모임 수정")
    @PatchMapping("/{teamId}")
    public ResponseEntity<ResponseDto<String>> updateTeam(@PathVariable int teamId, @RequestBody TeamUpdateRequest requestDto) {
        teamService.updateTeam(teamId, requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("모임 수정을 성공했습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}
