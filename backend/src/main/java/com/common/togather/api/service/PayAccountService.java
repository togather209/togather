package com.common.togather.api.service;

import com.common.togather.api.error.PayAccountNotFoundException;
import com.common.togather.api.request.PayAccountRechargeRequest;
import com.common.togather.api.request.PayAccountTransferRequest;
import com.common.togather.db.entity.Account;
import com.common.togather.db.entity.PayAccount;
import com.common.togather.db.repository.AccountRepository;
import com.common.togather.db.repository.PayAccountRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class PayAccountService {

    private final PayAccountRepository payCountRepository;
    private final AccountRepository accountRepository;

    // Pay 계좌 충전하기
    @Transactional
    public void rechargePayAccount(int memberId, PayAccountRechargeRequest requestDto) {

        PayAccount payAccount = payCountRepository.findByMemberId(memberId)
                .orElseThrow(() -> new PayAccountNotFoundException("Pay 계좌가 존재하지 않습니다."));
        Account account = payAccount.getAccount();

        account.decreaseBalance(requestDto.getPrice());
        payAccount.increaseBalance(requestDto.getPrice());

        accountRepository.save(account);
        payCountRepository.save(payAccount);
    }

    // 송금하기
    @Transactional
    public void transferPayAccount(int memberId, PayAccountTransferRequest requestDto) {

        PayAccount payAccount = payCountRepository.findByMemberId(memberId)
                .orElseThrow(() -> new PayAccountNotFoundException("Pay 계좌가 존재하지 않습니다."));
        PayAccount targetPayAccount = payCountRepository.findByMemberId(requestDto.getTargetMemberId())
                .orElseThrow(() -> new PayAccountNotFoundException("Target Pay 계좌가 존재하지 않습니다."));

        payAccount.decreaseBalance(requestDto.getPrice());
        targetPayAccount.increaseBalance(requestDto.getPrice());

        payCountRepository.save(payAccount);
        payCountRepository.save(targetPayAccount);
    }
}
