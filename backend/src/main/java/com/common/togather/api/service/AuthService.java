package com.common.togather.api.service;

import com.common.togather.api.error.EmailAlreadyExistsException;
import com.common.togather.api.error.NicknameAlreadyExistsException;
import com.common.togather.api.request.MemberSaveRequest;
import com.common.togather.db.entity.Member;
import com.common.togather.db.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    // 생성자 주입
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
    private final AuthenticationManager authenticationManager;
    private final RedisService redisService;
    
    // 회원가입
    @Transactional
    public void signup(MemberSaveRequest memberSaveRequest) {

        String email = memberSaveRequest.getEmail();
        String password = memberSaveRequest.getPassword();
        String nickname = memberSaveRequest.getNickname();

        if (memberRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("이미 가입된 이메일입니다.");
        }

        if (memberRepository.existsByNickname(nickname)) { // 닉네임 중복 확인
            throw new NicknameAlreadyExistsException("이미 사용중인 닉네임입니다.");
        }

        Member member = new Member();
        member.setEmail(email);
        member.setPassword(bCryptPasswordEncoder.encode(password));
        member.setNickname(nickname);

        memberRepository.save(member);

    }

}
