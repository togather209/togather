package com.common.togather.api.service;

import com.common.togather.api.error.MemberNotFoundException;
import com.common.togather.api.error.PayAccountNotFoundException;
import com.common.togather.api.error.TransactionNotFoundException;
import com.common.togather.api.request.TransactionSaveRequest;
import com.common.togather.api.response.TransactionAllFindByMemberIdResponse;
import com.common.togather.api.response.TransactionFindByTransactionIdResponse;
import com.common.togather.db.entity.Member;
import com.common.togather.db.entity.PayAccount;
import com.common.togather.db.entity.Transaction;
import com.common.togather.db.repository.MemberRepository;
import com.common.togather.db.repository.PayAccountRepository;
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
    private final PayAccountRepository payAccountRepository;

    // 나의 거래내역 조회
    public List<TransactionAllFindByMemberIdResponse> findAllTransaction(String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new MemberNotFoundException("해당 유저가 존재하지 않습니다."));
        PayAccount payAccount = member.getPayAccount();

        if (payAccount == null) {
            throw new PayAccountNotFoundException("Pay 계좌가 존재하지 않습니다.");
        }

        List<Transaction> transactions = member.getPayAccount().getTransactions();
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

    // 거래 내역 저장
    public void saveTransaction(TransactionSaveRequest requestDto) {
        transactionRepository.save(Transaction.builder()
                .senderName(requestDto.getSenderName())
                .receiverName(requestDto.getReceiverName())
                .price(requestDto.getPrice())
                .balance(requestDto.getBalance())
                .status(requestDto.getStatus())
                .date(requestDto.getDate())
                .payAccount(payAccountRepository.findById(requestDto.getPayAccountId())
                        .orElseThrow(() -> new PayAccountNotFoundException("Pay 계좌가 존재하지 않습니다.")))
                .build());
    }

    @Transactional
    public void saveTransactions(List<TransactionSaveRequest> transactionRequests) {
        // DTO를 Entity로 변환
        List<Transaction> transactions = transactionRequests.stream().map(request ->
                Transaction.builder()
                        .senderName(request.getSenderName())
                        .receiverName(request.getReceiverName())
                        .price(request.getPrice())
                        .balance(request.getBalance())
                        .date(request.getDate())
                        .status(request.getStatus())
                        .payAccount(PayAccount.builder().id(request.getPayAccountId()).build())
                        .build()
        ).collect(Collectors.toList());

        // 배치로 저장
        transactionRepository.saveAll(transactions);
    }
}
