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

    public Member getMemberByEmail(String email) {
        Member member = memberRepository.findByEmail(email).get();
        return member;
    }

    // 로그아웃
    @Transactional
    public void logout(String refreshToken) {
        String email = jwtUtil.getEmailFromToken(refreshToken); // 토큰값에서 이메일 추출
        redisService.deleteRefreshToken(email);
    }
}
