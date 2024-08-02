package com.common.togather.api.service;

import com.common.togather.api.error.MemberNotFoundException;
import com.common.togather.api.error.TransactionNotFoundException;
import com.common.togather.api.response.TransactionAllFindByMemberIdResponse;
import com.common.togather.api.response.TransactionFindByTransactionIdResponse;
import com.common.togather.db.entity.Member;
import com.common.togather.db.entity.Transaction;
import com.common.togather.db.repository.MemberRepository;
import com.common.togather.db.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final MemberRepository memberRepository;

    // 나의 거래내역 조회
    public List<TransactionAllFindByMemberIdResponse> findAllTransaction(String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new MemberNotFoundException("해당 유저가 존재하지 않습니다."));
        List<Transaction> transactions = transactionRepository.findByPayAccountId(member.getPayAccount().getId());

        List<TransactionAllFindByMemberIdResponse> responseDto = transactions.stream()
                .map(TransactionAllFindByMemberIdResponse::new)
                .collect(Collectors.toList());

        return responseDto;
    }

    // 거래 내역 상세 조회
    public TransactionFindByTransactionIdResponse findTransaction(int transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException("해당 거래내역이 존재하지 않습니다."));

        return new TransactionFindByTransactionIdResponse(transaction);
    }
}
