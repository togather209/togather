package com.common.togather.api.controller;

import com.common.togather.api.request.TeamJoinSaveRequest;
import com.common.togather.api.request.TeamSaveRequest;
import com.common.togather.api.request.TeamUpdateRequest;
import com.common.togather.api.response.*;
import com.common.togather.api.service.TeamService;
import com.common.togather.common.util.JwtUtil;
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

    // 모임 상세 조회
    @Operation(summary = "모임 상세 조회")
    @GetMapping("/{teamId}")
    public ResponseEntity<ResponseDto<TeamFindByTeamIdResponse>> findTeamByTeamId(@RequestHeader(value = "Authorization", required = false) String token, @PathVariable Integer teamId) {
        ResponseDto<TeamFindByTeamIdResponse> responseDto = ResponseDto.<TeamFindByTeamIdResponse>builder()
                .status(HttpStatus.OK.value())
                .message("내가 속한 모임 조회를 성공했습니다.")
                .data(teamService.findTeamByTeamId(jwtUtil.getAuthMemberEmail(token), teamId))
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 모임 참여 요청
    @Operation(summary = "모임 참여 요청")
    @PostMapping("/join-requests")
    public ResponseEntity<ResponseDto<String>> joinTeamByCode(@RequestHeader(value = "Authorization", required = false) String token, @RequestBody TeamJoinSaveRequest requestDto) {
        teamService.joinTeamByCode(jwtUtil.getAuthMemberEmail(token), requestDto);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("모임 참여 요청을 성공했습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "모임 참여 요청 조회")
    @GetMapping("/{teamId}/join-requests")
    public ResponseEntity<ResponseDto<List<TeamJoinFindAllByTeamIdResponse>>> findTeamJoinByTeamId(@RequestHeader(value = "Authorization", required = false) String token, @PathVariable Integer teamId) {
        ResponseDto<List<TeamJoinFindAllByTeamIdResponse>> responseDto = ResponseDto.<List<TeamJoinFindAllByTeamIdResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("모임 참여 요청 조회를 성공했습니다.")
                .data(teamService.findTeamJoinByTeamId(jwtUtil.getAuthMemberEmail(token), teamId))
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 모임 참여 인원 조회
    @Operation(summary = "모임 참여 인원 조회")
    @GetMapping("/{teamId}/members")
    public ResponseEntity<ResponseDto<List<TeamMemberFindAllByTeamIdResponse>>> findAllTeamMemberByTeamId(@RequestHeader(value = "Authorization", required = false) String token, @PathVariable Integer teamId) {
        ResponseDto<List<TeamMemberFindAllByTeamIdResponse>> responseDto = ResponseDto.<List<TeamMemberFindAllByTeamIdResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("모임 참여 인원 조회를 성공했습니다.")
                .data(teamService.findAllTeamMemberByTeamId(teamId))
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}
