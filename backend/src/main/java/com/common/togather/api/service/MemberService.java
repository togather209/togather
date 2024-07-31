package com.common.togather.api.service;

import com.common.togather.api.error.EmailAlreadyExistsException;
import com.common.togather.api.error.EmailNotFoundException;
import com.common.togather.api.error.InvalidPasswordException;
import com.common.togather.api.error.NicknameAlreadyExistsException;
import com.common.togather.api.request.LoginRequest;
import com.common.togather.api.request.MemberSaveRequest;
import com.common.togather.common.auth.TokenInfo;
import com.common.togather.common.util.JwtUtil;
import com.common.togather.db.entity.Member;
import com.common.togather.db.repository.MemberRepository;
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

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
    private final AuthenticationManager authenticationManager;
    private final RedisService redisService;
    private final JwtUtil jwtUtil;

    // 로그아웃
    @Transactional
    public void logout(String refreshToken) {
        String email = jwtUtil.getEmailFromToken(refreshToken); // 토큰값에서 이메일 추출
        redisService.deleteRefreshToken(email);
    }

    // 이메일로 회원 찾기
    public Member getMemberByEmail(String email) {
        Member member = memberRepository.findByEmail(email).get();
        return member;
    }

    // 로그인 유저 이메일 추출
    public String getAuthMemberEmail(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        // Authorization 헤더가 있고 Bearer이면
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = jwtUtil.getEmailFromToken(token);

            return email;
        }

        // Authorization 헤더가 없으면
        else {
            throw new IllegalArgumentException("Authorization 헤더가 없습니다.");
        }
    }
}