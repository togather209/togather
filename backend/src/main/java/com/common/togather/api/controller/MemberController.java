package com.common.togather.api.controller;

import com.common.togather.api.request.LoginRequest;
import com.common.togather.api.request.MemberSaveRequest;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.MemberService;
import com.common.togather.common.auth.TokenInfo;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;


    // 회원가입
    @Operation(summary = "회원가입")
    @PostMapping("/")
    public ResponseEntity<ResponseDto<String>> signup(@RequestBody MemberSaveRequest memberSaveRequest){

        memberService.signup(memberSaveRequest);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.CREATED.value())
                .message("회원가입을 성공했습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto,HttpStatus.OK);
    }

    @Operation(summary = "일반 로그인")
    @PostMapping("/login")
    public ResponseEntity<ResponseDto<TokenInfo>> login(@RequestBody LoginRequest loginRequest) {
        TokenInfo tokenInfo = memberService.login(loginRequest);
        ResponseDto<TokenInfo> responseDto = ResponseDto.<TokenInfo>builder()
                .status(HttpStatus.OK.value())
                .message("로그인 성공")
                .data(tokenInfo)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }




}
