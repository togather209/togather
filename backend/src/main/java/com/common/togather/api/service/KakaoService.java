package com.common.togather.api.service;

import com.common.togather.api.error.*;
import com.common.togather.api.request.KakaoMemverSaveRequest;
import com.common.togather.api.response.KakaoLoginResponse;
import com.common.togather.api.response.KakaoUserInfoResponse;
import com.common.togather.common.auth.TokenInfo;
import com.common.togather.common.util.JwtUtil;
import com.common.togather.db.entity.Member;
import com.common.togather.db.repository.MemberRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class KakaoService {

    private final ObjectMapper objectMapper;
    private final MemberRepository memberRepository;
    @Value("${kakao.login.client.id}")
    private String KAKAO_LOGIN_CLIENT_ID;

    @Value("${kakao.login.redirect.uri}")
    private String KAKAO_LOGIN_REDIRECT_URI;

    @Value("${kakao.login.grant.type}")
    private String KAKAO_LOGIN_GRANT_TYPE;

    private final RestTemplate restTemplate = new RestTemplate();
    private final JwtUtil jwtUtil;
    private final RedisService redisService;

    // 인가 코드로 카카오 access token 발급 받기
    public String getAccessToken(String code) {

        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        // 요청 파라미터 설정
        MultiValueMap<String, String> params = new LinkedMultiValueMap<String, String>();
        params.add("grant_type", KAKAO_LOGIN_GRANT_TYPE);
        params.add("client_id", KAKAO_LOGIN_CLIENT_ID);
        params.add("redirect_uri", KAKAO_LOGIN_REDIRECT_URI);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, request, String.class);

        // JSON 파싱
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            if(!jsonNode.has("access_token")) {
                throw new NotFoundKakaoException("카카오 토큰 발급에 실패했습니다.");
            }

            String accessToken = jsonNode.get("access_token").asText();
            return accessToken;
        } catch (Exception e) {
            throw new NotFoundKakaoException("사용자 정보 불러오기에 실패했습니다.");
        }

    }

    // 발급 받은 토큰으로 로그인 유저 정보 얻기
    public KakaoUserInfoResponse getUserInfo(String kakaoToken) {

        if(kakaoToken == null || kakaoToken.isEmpty()) {
            throw new NotFoundKakaoException("토큰이 없습니다.");
        }

        String getUserUrl = "https://kapi.kakao.com/v2/user/me";

        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        headers.add("Authorization", "Bearer " + kakaoToken);

        // 요청 보내기
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.postForEntity(getUserUrl, request, String.class);

        // JSON 응답 파싱
        ObjectMapper objectMapper = new ObjectMapper();

        KakaoUserInfoResponse kakaoUserInfoResponse = null;

        try {
            // JSON 응답을 JsonNode로 변환
            JsonNode rootNode = objectMapper.readTree(response.getBody());

            // nickname과 email 추출
            String nickname = rootNode.path("kakao_account").path("profile").path("nickname").asText();
            String email = rootNode.path("kakao_account").path("email").asText();

            kakaoUserInfoResponse = KakaoUserInfoResponse.builder()
                    .nickname(nickname)
                    .email(email)
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return kakaoUserInfoResponse;

    }

    // 카카오에서 받은 정보로 회원가입 (이메일, 닉네임만 존재)
    public void signup(KakaoMemverSaveRequest request) {

        String email = request.getEmail();
        String nickname = request.getNickname();

        if (memberRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("이미 가입된 이메일입니다.");
        }

        if (memberRepository.existsByNickname(nickname)) { // 닉네임 중복 확인
            throw new NicknameAlreadyExistsException("이미 사용중인 닉네임입니다.");
        }

        Member member = Member.builder()
                .type(1) // 카카오 로그인
                .email(email)
                .nickname(nickname)
                .profileImg(null)
                .password("KAKAO")
                .build();
        memberRepository.save(member);
    }

    // 이미 회원인 유저라면 바로 로그인
    public KakaoLoginResponse login(KakaoUserInfoResponse userInfo) {

        String email = userInfo.getEmail();

        if(email == null || email.isEmpty()) {
            throw new NotFoundKakaoException("카카오 로그인에 실패하였습니다.");
        }

        Optional<Member> memberOptional = memberRepository.findByEmail(email);

        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();

            // Member의 type 값을 비교하여 예외 처리
            if (member.getType() == 1) {
                throw new LoginMethodMismatchException("카카오 가입 회원입니다.");
            }
        }
        // 해당 이메일의 회원이 없다면
        else {
            throw new EmailNotFoundException("가입되지 않은 이메일 입니다.");
        }

        String accessToken = jwtUtil.generateAccessToken(email); // Access Token 생성
        String refreshToken = jwtUtil.generateRefreshToken(email); // Refresh Token 생성

        redisService.saveRefreshToken(email, refreshToken); // Redis에 Refresh Token 저장 (유효기간 7일)

        TokenInfo tokenInfo = new TokenInfo(accessToken, refreshToken); // Access Token과 Refresh Token 저장

        KakaoLoginResponse kakaoLoginResponse = KakaoLoginResponse.builder()
                .isMember(true)
                .tokenInfo(tokenInfo)
                .build();

        return kakaoLoginResponse;
    }
}
