package com.common.togather.api.service;

import com.common.togather.api.error.AccountVerificationException;
import com.common.togather.api.error.MemberNotFoundException;
import com.common.togather.api.request.AccountVerificationRequest;
import com.common.togather.db.entity.Account;
import com.common.togather.db.entity.Member;
import com.common.togather.db.repository.AccountRepository;
import com.common.togather.db.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@Transactional
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final MemberRepository memberRepository;

    // 계좌 인증
    public void verifyAccount(String email, AccountVerificationRequest requestDto) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new MemberNotFoundException("해당 유저가 존재하지 않습니다."));
        Account account = accountRepository.findByAccountNumber(requestDto.getAccountNumber())
                .orElseThrow(() -> new AccountVerificationException("계좌 인증이 실패했습니다."));
        System.out.println(requestDto.getAccountNumber());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate requestBirthDate = LocalDate.parse(requestDto.getBirth(), formatter);

        if (!account.getMemberName().equals(requestDto.getMemberName()) ||
                !account.getBirth().equals(requestBirthDate) ||
                account.getType() != requestDto.getType() ||
                account.getPassword() != requestDto.getPassword()) {
            throw new AccountVerificationException("계좌 인증이 실패했습니다.");
        }
    }
}
