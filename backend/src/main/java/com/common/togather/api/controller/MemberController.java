package com.common.togather.api.controller;

import com.common.togather.api.request.LogoutRequest;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.MemberService;
import com.common.togather.common.auth.TokenInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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


}
