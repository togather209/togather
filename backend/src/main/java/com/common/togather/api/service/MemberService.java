package com.common.togather.api.service;

import com.common.togather.api.error.EmailAlreadyExistsException;
import com.common.togather.api.error.EmailNotFoundException;
import com.common.togather.api.error.InvalidPasswordException;
import com.common.togather.api.error.NicknameAlreadyExistsException;
import com.common.togather.api.request.LoginRequest;
import com.common.togather.api.request.MemberSaveRequest;
import com.common.togather.api.request.MemberUpdateRequest;
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
    public void logout(String accessToken, String refreshToken) {

        // 아직 만료되지 않은 access token은 블랙리스트에 추가
        long expirationTime = jwtUtil.getExpirationFromToken(accessToken).getTime() - System.currentTimeMillis();
        redisService.blacklistAccessToken(accessToken, expirationTime);

        // refresh token은 redis에서 삭제해 무효화
        String email = jwtUtil.getEmailFromToken(refreshToken);
        redisService.deleteRefreshToken(email);
    }


    // 회원 정보 수정
    public void updateMember(String authEmail, MemberUpdateRequest memberUpdateRequest) {
        Member member = memberRepository.findByEmail(authEmail).get();

        System.out.println(member.getEmail());

        if(memberUpdateRequest.getPassword() != null){
            member.setPassword(bCryptPasswordEncoder.encode(memberUpdateRequest.getPassword()));
        }
        if(memberUpdateRequest.getNickname() != null){
            member.setNickname(memberUpdateRequest.getNickname());
        }
        if(memberUpdateRequest.getProfileImg() != null){
            member.setProfileImg(memberUpdateRequest.getProfileImg());
        }

        memberRepository.save(member);
    }
}