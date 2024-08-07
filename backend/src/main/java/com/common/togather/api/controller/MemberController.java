package com.common.togather.api.controller;

import com.common.togather.api.request.MemberUpdateRequest;
import com.common.togather.api.response.MemberFindByIdResponse;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.MemberService;
import com.common.togather.common.util.JwtUtil;
import com.common.togather.db.repository.MemberRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


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
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "로그인 유저 정보 조회")
    @GetMapping("/me")
    public ResponseEntity<ResponseDto<MemberFindByIdResponse>> getAuthMember(@RequestHeader(value = "Authorization", required = false) String header) {

        String authEmail = jwtUtil.getAuthMemberEmail(header);

        MemberFindByIdResponse response = memberService.getAuthMember(authEmail);

        ResponseDto<MemberFindByIdResponse> responseDto = ResponseDto.<MemberFindByIdResponse>builder()
                .status(HttpStatus.OK.value())
                .message("로그인 유저 조회 성공")
                .data(response)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "회원정보 수정")
    @PatchMapping("/me")
    public ResponseEntity<ResponseDto<String>> updateMember(
            @RequestHeader(value = "Authorization", required = false) String header,
            @RequestPart(value = "member") MemberUpdateRequest memberUpdateRequest,
            @RequestPart(value = "image", required = false) MultipartFile profileImage) {
        // 로그인 유저 이메일 추출
        String authEmail = jwtUtil.getAuthMemberEmail(header);

        // 새로 입력한 정보로 업데이트
        memberService.updateMember(authEmail, memberUpdateRequest, profileImage);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("회원 정보 수정 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "회원 탈퇴")
    @DeleteMapping("/me")
    public ResponseEntity<ResponseDto<String>> removeMember(@RequestHeader(value = "Authorization", required = false) String header,
                                                            @CookieValue(value = "refreshToken", required = false) Cookie cookie,
                                                            HttpServletResponse response) {
        String authEmail = jwtUtil.getAuthMemberEmail(header);
        String accessToken = header.substring(7);
        String refreshToken = cookie.getValue();

        memberService.deleteMember(authEmail, accessToken, refreshToken);

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
                .message("회원 삭제 성공")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}