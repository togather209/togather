package com.common.togather.api.controller;

import com.common.togather.api.error.MissingTokenException;
import com.common.togather.api.request.LoginRequest;
import com.common.togather.api.request.MemberSaveRequest;
import com.common.togather.api.request.RefreshRequest;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.AuthService;
import com.common.togather.common.auth.TokenInfo;
import com.common.togather.common.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/auth/")
@Tag(name = "AuthController", description = "토큰 없어도 접근 가능한 요청")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    // 회원가입
    @Operation(summary = "회원가입")
    @PostMapping("/")
    public ResponseEntity<ResponseDto<String>> signup(@RequestBody MemberSaveRequest memberSaveRequest){

        authService.signup(memberSaveRequest);

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
        TokenInfo tokenInfo = authService.login(loginRequest);

        ResponseDto<TokenInfo> responseDto = ResponseDto.<TokenInfo>builder()
                .status(HttpStatus.OK.value())
                .message("로그인 성공")
                .data(tokenInfo)
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "토큰 재발급")
    @PostMapping("/refresh")
    public ResponseEntity<ResponseDto<TokenInfo>> refresh(@RequestBody RefreshRequest refreshRequest) {
        String refreshToken = refreshRequest.getRefreshToken();

        // 리프레시 토큰이 없다면
        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new MissingTokenException("리프레시 토큰을 찾을 수 없습니다.");
        }

        // 리프레시 토큰이 있다면 재발급 가능
        String email = jwtUtil.getEmailFromToken(refreshToken);
        TokenInfo tokenInfo = authService.refreshToken(email);
        ResponseDto<TokenInfo> responseDto = ResponseDto.<TokenInfo>builder()
                .status(HttpStatus.OK.value())
                .message("토큰 재발급을 성공했습니다.")
                .data(tokenInfo)
                .build();
                
        return new ResponseEntity<>(responseDto, HttpStatus.OK);

    }


}
