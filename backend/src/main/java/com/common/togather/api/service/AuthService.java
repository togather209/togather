package com.common.togather.api.service;

import com.common.togather.api.error.*;
import com.common.togather.api.request.LoginRequest;
import com.common.togather.api.request.MemberSaveRequest;
import com.common.togather.common.auth.TokenInfo;
import com.common.togather.common.exception.handler.NotFoundHandler;
import com.common.togather.common.util.ImageUtil;
import com.common.togather.common.util.JwtUtil;
import com.common.togather.db.entity.Member;
import com.common.togather.db.repository.MemberRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AuthService {

    // 생성자 주입
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
    private final AuthenticationManager authenticationManager;
    private final RedisService redisService;
    private final JwtUtil jwtUtil;
    private final ImageUtil imageUtil;

    // 회원가입
    @Transactional
    public void signup(MemberSaveRequest memberSaveRequest, MultipartFile profileImg) {

        String email = memberSaveRequest.getEmail();
        String password = memberSaveRequest.getPassword();
        String nickname = memberSaveRequest.getNickname();

        if (memberRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("이미 가입된 이메일입니다.");
        }

        if (memberRepository.existsByNickname(nickname)) { // 닉네임 중복 확인
            throw new NicknameAlreadyExistsException("이미 사용중인 닉네임입니다.");
        }

        String imageUrl = null;

        if(profileImg != null && !profileImg.isEmpty()) {
            imageUrl = imageUtil.uploadImage(profileImg);
        }

        Member member = Member.builder()
                .email(email)
                .password(bCryptPasswordEncoder.encode(password))
                .nickname(nickname)
                .profileImg(imageUrl)
                .build();

        memberRepository.save(member);

    }

    // 로그인
    @Transactional
    public TokenInfo login(LoginRequest loginRequest) {
        String email = loginRequest.getEmail();

        // 이메일 존재 여부 확인
        if(!memberRepository.existsByEmail(email)) {
            throw new EmailNotFoundException("가입되지 않은 이메일입니다.");
        }

        try {
            // 사용자 인증 수행
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, loginRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = jwtUtil.generateAccessToken(email); // Access Token 생성
            String refreshToken = jwtUtil.generateRefreshToken(email); // Refresh Token 생성

            redisService.saveRefreshToken(email, refreshToken); // Redis에 Refresh Token 저장 (유효기간 7일)

            return new TokenInfo(accessToken, refreshToken); // Access Token과 Refresh Token 반환
        } catch (AuthenticationException e) {
            throw new InvalidPasswordException("비밀번호가 일치하지 않습니다.");
        }
    }

    // 토큰 재발급
    @Transactional
    public TokenInfo refreshToken(String email) {
        String accessToken = jwtUtil.generateAccessToken(email);
        String refreshToken = jwtUtil.generateRefreshToken(email);

        redisService.updateRefreshToken(email, refreshToken);
        TokenInfo tokenInfo = new TokenInfo(accessToken, refreshToken);

        return tokenInfo;
    }
    
    // 임시 비밀번호로 변경
    @Transactional
    public void updatePassword(String email, String temporaryPassword) {
        Member member = memberRepository.findByEmail(email).get();
        member.updatePassword(temporaryPassword, bCryptPasswordEncoder);
    }

}
