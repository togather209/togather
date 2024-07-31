package com.common.togather.api.controller;

import com.common.togather.api.request.LogoutRequest;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.MemberService;
import com.common.togather.common.auth.TokenInfo;
import com.common.togather.common.util.JwtUtil;
import com.common.togather.db.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/members")
@Tag(name = "MemberController")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    @Operation(summary = "로그아웃")
    @PostMapping("/logout")
    public ResponseEntity<ResponseDto<String>> logout(@RequestBody LogoutRequest logoutRequest) {
        memberService.logout(logoutRequest.getRefreshToken());
        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("로그아웃 성공")
                .data(null)
                .build();
        return new ResponseEntity<>(responseDto,HttpStatus.OK);
    }

    @Operation(summary = "로그인 유저 정보 조회")
    @GetMapping("/me")
    public ResponseEntity<ResponseDto<Member>> getAuthMember(@RequestHeader(value = "Authorization", required = false) String header) {

        String authEmail = jwtUtil.getAuthMemberEmail(header);
        Member member = memberService.getMemberByEmail(authEmail);
        ResponseDto<Member> responseDto = ResponseDto.<Member>builder()
                .status(HttpStatus.OK.value())
                .message("로그인 유저 조회 성공")
                .data(member)
                .build();

        return new ResponseEntity<>(responseDto,HttpStatus.OK);
    }
}