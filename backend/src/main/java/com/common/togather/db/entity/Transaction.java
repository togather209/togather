package com.common.togather.db.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Transaction {

    // pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // 송신인명
    private String senderName;

    // 수취인명
    private String receiverName;

    // 거래 금액
    private int price;

    // 잔액
    private int balance;

    // 날짜
    private LocalDateTime date;

    // 상태
    // 0 : 입금, 1 : 출금
    private int status;

    // Pay 계좌
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pay_account_id")
    private PayAccount payAccount;
}
