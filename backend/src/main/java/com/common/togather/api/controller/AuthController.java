package com.common.togather.api.controller;

import com.common.togather.api.request.MemberSaveRequest;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


    // 회원가입
    @PostMapping("/members")
    public ResponseEntity<ResponseDto<String>> signup(@RequestBody MemberSaveRequest memberSaveRequest){

        authService.signup(memberSaveRequest);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.CREATED.value())
                .message("회원가입을 성공했습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto,HttpStatus.OK);
    }



}
