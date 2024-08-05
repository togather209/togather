package com.common.togather.api.service;

import com.common.togather.api.error.*;
import com.common.togather.api.request.LoginRequest;
import com.common.togather.api.request.MemberSaveRequest;
import com.common.togather.api.request.MemberUpdateRequest;
import com.common.togather.api.response.MemberUpdateResponse;
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
    @Transactional
    public MemberUpdateResponse updateMember(String authEmail, MemberUpdateRequest memberUpdateRequest) {
        Member member = memberRepository.findByEmail(authEmail)
                .orElseThrow(() -> new MemberNotFoundException("해당 이메일로 가입된 회원이 없습니다."));

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
        return new MemberUpdateResponse(member.getId());
    }

    // 회원 삭제
    @Transactional
    public void deleteMember(String authEmail) {
        Member member = memberRepository.findByEmail(authEmail)
                .orElseThrow(() -> new MemberNotFoundException("해당 이메일로 가입된 회원이 없습니다."));

        memberRepository.delete(member);
    }
}