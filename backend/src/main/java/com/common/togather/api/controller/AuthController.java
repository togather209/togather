package com.common.togather.api.controller;

import com.common.togather.api.error.MissingTokenException;
import com.common.togather.api.request.EmailVerificationRequest;
import com.common.togather.api.request.LoginRequest;
import com.common.togather.api.request.MemberSaveRequest;
import com.common.togather.api.request.RefreshRequest;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.AuthService;
import com.common.togather.api.service.MailService;
import com.common.togather.api.service.RedisService;
import com.common.togather.common.auth.TokenInfo;
import com.common.togather.common.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "AuthController", description = "토큰 없어도 접근 가능한 요청")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final MailService mailService;
    private final RedisService redisService;

    // 회원가입
    @Operation(summary = "회원가입")
    @PostMapping("/register")
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
    
    @Operation(summary = "이메일 인증코드 발급")
    @PostMapping("/verification-codes")
    public ResponseEntity<ResponseDto<String>> sendCode(@RequestBody EmailVerificationRequest emailVerificationRequest){
        String email = emailVerificationRequest.getEmail(); // 사용자가 입력한 이메일
        String verificationCode = generateVerificationCode(); // 인증코드 생성

        // 전송할 이메일 내용
        String emailContent = "<div style='font-family: Arial, sans-serif; line-height: 1.6;'>" +
                "<h2>Togather 회원가입 인증 코드</h2>" +
                "<p>안녕하세요,</p>" +
                "<p>회원가입을 위한 인증 코드입니다:</p>" +
                "<h3 style='color: #2E86C1;'>" + verificationCode + "</h3>" +
                "<p>이 코드는 5분 동안 유효합니다.</p>" +
                "<p>감사합니다,<br/>Togather 팀</p>" +
                "</div>";

        // 이메일 전송
        mailService.sendMail(email, "Togather 회원가입 인증코드", emailContent);
        
        // redis 저장 (유효 기간 5분)
        redisService.saveEmailVerificationCode(email, verificationCode);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.OK.value())
                .message("인증코드 전송에 성공했습니다.")
                .data(null)
                .build();
        return new ResponseEntity<>(responseDto, HttpStatus.OK);

    }

    private String generateVerificationCode(){
        Random random = new Random();
        int code = random.nextInt(999999) + 100000;
        return String.valueOf(code);
    }


}
