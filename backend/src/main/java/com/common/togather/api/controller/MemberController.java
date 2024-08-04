package com.common.togather.api.controller;

import com.common.togather.api.request.LogoutRequest;
import com.common.togather.api.request.MemberUpdateRequest;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.MemberService;
import com.common.togather.common.auth.TokenInfo;
import com.common.togather.common.util.JwtUtil;
import com.common.togather.db.entity.Member;
import com.common.togather.db.repository.MemberRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/members")
@Tag(name = "MemberController")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;

    @Operation(summary = "로그아웃")
    @PostMapping("/logout")
    public ResponseEntity<ResponseDto<String>> logout(@RequestHeader(value = "Authorization", required = false) String header,
                                                      @CookieValue(value = "refreshToken", required = false) Cookie cookie,
                                                      HttpServletResponse response) {

        String accessToken = header.substring(7);
        String refreshToken = cookie.getValue();
        memberService.logout(accessToken, refreshToken);

        // refresh token 쿠키 삭제
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        response.setHeader("Set-Cookie", deleteCookie.toString());

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
        Member member = memberRepository.findByEmail(authEmail).get();

        ResponseDto<Member> responseDto = ResponseDto.<Member>builder()
                .status(HttpStatus.OK.value())
                .message("로그인 유저 조회 성공")
                .data(member)
                .build();

        return new ResponseEntity<>(responseDto,HttpStatus.OK);
    }

    @Operation(summary = "회원정보 수정")
    @PatchMapping("/me")
    public ResponseEntity<ResponseDto<Void>> updateMember(@RequestHeader(value = "Authorization", required = false) String header,
                                                            @RequestBody MemberUpdateRequest memberUpdateRequest) {
        // 로그인 유저 이메일 추출
        String authEmail = jwtUtil.getAuthMemberEmail(header);
        
        // 새로 입력한 정보로 업데이트
        memberService.updateMember(authEmail, memberUpdateRequest);

        ResponseDto<Void> responseDto = ResponseDto.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("회원 정보 수정 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto,HttpStatus.OK);
    }

    @Operation(summary = "회원 탈퇴")
    @DeleteMapping("/me")
    public ResponseEntity<ResponseDto<Void>> removeMember(@RequestHeader(value = "Authorization") String header) {
        String authEmail = jwtUtil.getAuthMemberEmail(header);
        memberService.deleteMember(authEmail);

        ResponseDto<Void> responseDto = ResponseDto.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("회원 삭제 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto,HttpStatus.OK);
    }
}