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
    @Column(name = "id", nullable = false)
    private int id;

    // 송신인명
    @Column(name = "sender_name", nullable = false)
    private String senderName;

    // 수취인명
    @Column(name = "receiver_name", nullable = false)
    private String receiverName;

    // 거래 금액
    @Column(name = "price", nullable = false)
    private int price;

    // 잔액
    @Column(name = "balance", nullable = false)
    private int balance;

    // 날짜
    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    // 상태
    // 0 : 입금, 1 : 출금
    @Column(name = "status", nullable = false)
    private int status;

    // Pay 계좌
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pay_account_id")
    private PayAccount payAccount;
}
