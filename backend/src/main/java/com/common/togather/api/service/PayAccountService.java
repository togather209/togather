package com.common.togather.api.service;

import com.common.togather.api.error.InvalidPayAccountPasswordException;
import com.common.togather.api.error.MemberNotFoundException;
import com.common.togather.api.error.PayAccountBalanceNotEmptyException;
import com.common.togather.api.error.PayAccountNotFoundException;
import com.common.togather.api.request.*;
import com.common.togather.api.response.PayAccountFindByMemberIdResponse;
import com.common.togather.db.entity.Account;
import com.common.togather.db.entity.Member;
import com.common.togather.db.entity.PayAccount;
import com.common.togather.db.repository.AccountRepository;
import com.common.togather.db.repository.MemberRepository;
import com.common.togather.db.repository.PayAccountRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class PayAccountService {

    private final PayAccountRepository payAccountRepository;
    private final AccountRepository accountRepository;
    private final MemberRepository memberRepository;

    // 나의 Pay 계좌 조회
    @Transactional
    public PayAccountFindByMemberIdResponse findPayAccountByMemberId(String email) {

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new MemberNotFoundException("해당 유저가 존재하지 않습니다."));
        PayAccount payAccount = payAccountRepository.findByMemberId(member.getId())
                .orElseThrow(() -> new PayAccountNotFoundException("Pay 계좌가 존재하지 않습니다."));

        return PayAccountFindByMemberIdResponse.builder()
                .memberName(member.getName())
                .payAccountId(payAccount.getId())
                .payAccountName(payAccount.getAccountName())
                .balance(payAccount.getBalance())
                .build();
    }

    // Pay 계좌 생성하기
    @Transactional
    public void savePayAccount(String email, PayAccountSaveRequest requestDto) {

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new MemberNotFoundException("해당 유저가 존재하지 않습니다."));
        Account account = accountRepository.findByAccountNumber(requestDto.getAccountNum())
                .orElseThrow(() -> new PayAccountNotFoundException("계좌가 존재하지 않습니다."));

        payAccountRepository.save(PayAccount.builder()
                .accountName(requestDto.getAccountName())
                .password(requestDto.getPassword())
                .member(member)
                .account(account)
                .build());
    }

    // Pay 계좌 충전하기
    @Transactional
    public void rechargePayAccount(String email, PayAccountRechargeRequest requestDto) {

        PayAccount payAccount = payAccountRepository.findByMemberId(memberRepository.findByEmail(email).get().getId())
                .orElseThrow(() -> new PayAccountNotFoundException("Pay 계좌가 존재하지 않습니다."));
        Account account = payAccount.getAccount();

        account.decreaseBalance(requestDto.getPrice());
        payAccount.increaseBalance(requestDto.getPrice());

        accountRepository.save(account);
        payAccountRepository.save(payAccount);
    }

    // 송금하기
    @Transactional
    public void transferPayAccount(String email, PayAccountTransferRequest requestDto) {

        PayAccount payAccount = payAccountRepository.findByMemberId(memberRepository.findByEmail(email).get().getId())
                .orElseThrow(() -> new PayAccountNotFoundException("Pay 계좌가 존재하지 않습니다."));
        PayAccount targetPayAccount = payAccountRepository.findByMemberId(requestDto.getTargetMemberId())
                .orElseThrow(() -> new PayAccountNotFoundException("Target Pay 계좌가 존재하지 않습니다."));

        if (payAccount.getPassword() != requestDto.getPayAccountPassword()) {
            throw new InvalidPayAccountPasswordException("계좌 비밀번호가 일치하지 않습니다.");
        }

        payAccount.decreaseBalance(requestDto.getPrice());
        targetPayAccount.increaseBalance(requestDto.getPrice());

        payAccountRepository.save(payAccount);
        payAccountRepository.save(targetPayAccount);
    }

    // 계좌 삭제
    @Transactional
    public void deletePayAccount(String email, PayAccountDeleteRequest requestDto) {

        PayAccount payAccount = payAccountRepository.findByMemberId(memberRepository.findByEmail(email).get().getId())
                .orElseThrow(() -> new PayAccountNotFoundException("Pay 계좌가 존재하지 않습니다."));

        if (payAccount.getPassword() != requestDto.getPayAccountPassword()) {
            throw new InvalidPayAccountPasswordException("계좌 비밀번호가 일치하지 않습니다.");
        }

        if (payAccount.getBalance() > 0) {
            throw new PayAccountBalanceNotEmptyException("계좌에 잔액이 남아있습니다.");
        }

        payAccountRepository.delete(payAccount);
        payAccountRepository.flush();
    }

    // Pay 계좌 출금하기
    @Transactional
    public void withDrawPayAccount(String email, PayAccountWithdrawRequest requestDto) {

        PayAccount payAccount = payAccountRepository.findByMemberId(memberRepository.findByEmail(email).get().getId())
                .orElseThrow(() -> new PayAccountNotFoundException("Pay 계좌가 존재하지 않습니다."));
        Account account = payAccount.getAccount();

        account.increaseBalance(requestDto.getPrice());
        payAccount.decreaseBalance(requestDto.getPrice());

        accountRepository.save(account);
        payAccountRepository.save(payAccount);
    }
}
