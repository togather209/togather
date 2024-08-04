package com.common.togather.api.controller;

import com.common.togather.api.request.TeamSaveRequest;
import com.common.togather.api.request.TeamUpdateRequest;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.response.TeamFindAllByMemberIdResponse;
import com.common.togather.api.response.TeamSaveResponse;
import com.common.togather.api.service.TeamService;
import com.common.togather.common.util.JwtUtil;
import com.common.togather.db.entity.Team;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // 내가 속한 모임 조회
    @Operation(summary = "내가 속한 모임 조회")
    @GetMapping("/members/me")
    public ResponseEntity<ResponseDto<List<TeamFindAllByMemberIdResponse>>> findAllTeamByMemberId(@RequestHeader(value = "Authorization", required = false) String token) {

        ResponseDto<List<TeamFindAllByMemberIdResponse>> responseDto = ResponseDto.<List<TeamFindAllByMemberIdResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("내가 속한 모임 조회를 성공했습니다.")
                .data(teamService.findAllTeamByMemberId(jwtUtil.getAuthMemberEmail(token)))
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}
