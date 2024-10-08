package com.common.togather.api.service;

import com.common.togather.api.error.MemberNotFoundException;
import com.common.togather.api.request.MemberUpdateRequest;
import com.common.togather.api.response.MemberFindByIdResponse;
import com.common.togather.common.util.FCMUtil;
import com.common.togather.common.util.ImageUtil;
import com.common.togather.common.util.JwtUtil;
import com.common.togather.db.entity.Member;
import com.common.togather.db.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
    private final AuthenticationManager authenticationManager;
    private final RedisService redisService;
    private final JwtUtil jwtUtil;
    private final ImageUtil imageUtil;
    private final FCMUtil fcmUtil;

    // 로그아웃
    @Transactional
    public void logout(String accessToken, String refreshToken) {

        // 아직 만료되지 않은 access token은 블랙리스트에 추가
        long expirationTime = jwtUtil.getExpirationFromToken(accessToken).getTime() - System.currentTimeMillis();
        redisService.blacklistAccessToken(accessToken, expirationTime);

        // refresh token은 redis에서 삭제해 무효화
        String email = jwtUtil.getEmailFromToken(refreshToken);
        redisService.deleteRefreshToken(email);

        // fcm 토큰 삭제
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new MemberNotFoundException("해당 이메일로 가입된 회원이 없습니다."));

        fcmUtil.deleteToken(member);
    }


    // 회원 정보 수정
    @Transactional
    public void updateMember(String authEmail, MemberUpdateRequest request, MultipartFile profileImage) {
        Member member = memberRepository.findByEmail(authEmail)
                .orElseThrow(() -> new MemberNotFoundException("해당 이메일로 가입된 회원이 없습니다."));

        // 프로필 이미지 : 기존 저장된 이미지 삭제
        if (member.getProfileImg() != null) {
            imageUtil.deleteImage(member.getProfileImg());
        }
        String imageUrl = null;

        // 받아온 프로필 이미지가 존재하면
        if (profileImage != null) {
            imageUrl = imageUtil.uploadImage(profileImage);
        }
        member.updateProfileImg(imageUrl);

        // 새 비밀번호 null이면 기존 비밀번호 유지, null이 아닐때만 새비밀번호 변경
        if (request.getPassword() != null) {
            member.updatePassword(request.getPassword(), bCryptPasswordEncoder);
        }

        // 닉네임 : 입력으로 들어온 그대로 저장
        member.updateNickname(request.getNickname());

        memberRepository.save(member);
    }

    // 회원 삭제
    @Transactional
    public void deleteMember(String authEmail, String accessToken, String refreshToken) {
        Member member = memberRepository.findByEmail(authEmail)
                .orElseThrow(() -> new MemberNotFoundException("해당 이메일로 가입된 회원이 없습니다."));

        // 아직 만료되지 않은 access token은 블랙리스트에 추가
        long expirationTime = jwtUtil.getExpirationFromToken(accessToken).getTime() - System.currentTimeMillis();
        redisService.blacklistAccessToken(accessToken, expirationTime);

        // refresh token은 redis에서 삭제해 무효화
        String email = jwtUtil.getEmailFromToken(refreshToken);
        redisService.deleteRefreshToken(email);

        // fcm 토큰 삭제
        fcmUtil.deleteToken(member);

        memberRepository.delete(member);
    }

    // 로그인 회원 조회
    public MemberFindByIdResponse getAuthMember(String authEmail) {

        Member member = memberRepository.findByEmail(authEmail)
                .orElseThrow(() -> new MemberNotFoundException("해당 이메일로 가입된 회원을 찾을 수 없습니다."));

        return MemberFindByIdResponse.builder()
                .memberId(member.getId())
                .email(member.getEmail())
                .nickname(member.getNickname())
                .name(member.getName())
                .profileImg(member.getProfileImg())
                .type(member.getType())
                .build();

    }
}