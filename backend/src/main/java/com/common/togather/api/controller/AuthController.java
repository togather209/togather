package com.common.togather.api.controller;

import com.common.togather.api.error.MissingTokenException;
import com.common.togather.api.request.*;
import com.common.togather.api.response.ResponseDto;
import com.common.togather.api.service.AuthService;
import com.common.togather.api.service.MailService;
import com.common.togather.api.service.MemberService;
import com.common.togather.api.service.RedisService;
import com.common.togather.common.auth.TokenInfo;
import com.common.togather.common.util.JwtUtil;
import com.common.togather.db.repository.MemberRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "AuthController", description = "토큰 없어도 접근 가능한 요청")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final MailService mailService;
    private final RedisService redisService;
    private final MemberService memberService;
    private final MemberRepository memberRepository;

    // 회원가입
    @Operation(summary = "회원가입")
    @PostMapping("/register")
    public ResponseEntity<ResponseDto<String>> signup(@Valid @RequestBody MemberSaveRequest memberSaveRequest){

        authService.signup(memberSaveRequest);

        ResponseDto<String> responseDto = ResponseDto.<String>builder()
                .status(HttpStatus.CREATED.value())
                .message("회원가입을 성공했습니다.")
                .data(null)
                .build();

        return new ResponseEntity<>(responseDto,HttpStatus.CREATED);
    }

    @Operation(summary = "일반 로그인")
    @PostMapping("/login")
    public ResponseEntity<ResponseDto<TokenInfo>> login(@RequestBody LoginRequest loginRequest,
        
                                                        HttpServletResponse response) {
        // 사용자 인증 후 토큰 발급
        TokenInfo tokenInfo = authService.login(loginRequest);

        // refresh token은 쿠키에 저장하여 응답 보내줌
        ResponseCookie cookie = ResponseCookie.from("refreshToken", tokenInfo.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(7*24*60*60)
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());

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
    public ResponseEntity<ResponseDto<String>> sendCode(@Valid @RequestBody EmailVerificateRequest emailVerificateRequest){
        String email = emailVerificateRequest.getEmail(); // 사용자가 입력한 이메일
        String verificationCode = mailService.generateVerificationCode(); // 인증코드 생성

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
    
    @Operation(summary = "인증코드 확인")
    @PostMapping("/verification-codes/check")
    public ResponseEntity<ResponseDto<Boolean>> checkCode(@RequestBody VerificationCheckRequest verificationCheckRequest){
        String email = verificationCheckRequest.getEmail(); // 유저가 입력한 이메일
        String inputCode = verificationCheckRequest.getInputCode(); // 유저가 입력한 인증코드

        ResponseDto<Boolean> responseDto;
        
        // 발급한 인증코드와 일치하면
        if(mailService.matchCode(email, inputCode)){
            responseDto = ResponseDto.<Boolean>builder()
                    .status(HttpStatus.OK.value())
                    .message("인증에 성공했습니다.")
                    .data(true)
                    .build();

        return new ResponseEntity<>(responseDto,  HttpStatus.OK);

        }

        // 발급한 인증코드와 일치하지 않으면
        responseDto = ResponseDto.<Boolean>builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("인증에 실패했습니다.")
                .data(false)
                .build();

        return new ResponseEntity<>(responseDto,  HttpStatus.BAD_REQUEST);
    }

    @Operation(summary = "이메일 중복 검사")
    @PostMapping("/email/duplicate-check")
    public ResponseEntity<ResponseDto<Boolean>> checkEmail(@RequestBody EmailCheckRequest emailCheckRequest){
        // 해당 이메일을 사용하는 회원이 있는지 (있으면 true)
        boolean result = memberRepository.existsByEmail(emailCheckRequest.getEmail());
        ResponseDto<Boolean> responseDto;

        if(result){
            responseDto = ResponseDto.<Boolean>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("이미 사용중인 이메일입니다.")
                    .data(true)
                    .build();
        }

        else {
            responseDto = ResponseDto.<Boolean>builder()
                    .status(HttpStatus.OK.value())
                    .message("사용 가능한 이메일입니다.")
                    .data(false)
                    .build();
        }

        return new ResponseEntity<>(responseDto,  HttpStatus.OK);

    }

    @Operation(summary = "닉네임 중복 검사")
    @PostMapping("/nickname/duplicate-check")
    public ResponseEntity<ResponseDto<Boolean>> checkNickname(@RequestBody NicknameCheckRequest nicknameCheckRequest){
        boolean result = memberRepository.existsByNickname(nicknameCheckRequest.getNickname());
        ResponseDto<Boolean> responseDto;
        if(result){
            responseDto = ResponseDto.<Boolean>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("이미 사용중인 닉네임입니다.")
                    .data(true)
                    .build();
        }

        else {
            responseDto = ResponseDto.<Boolean>builder()
                    .status(HttpStatus.OK.value())
                    .message("사용 가능한 닉네임입니다.")
                    .data(false)
                    .build();
        }

        return new ResponseEntity<>(responseDto,  HttpStatus.OK);
    }

}
