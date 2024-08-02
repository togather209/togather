package com.common.togather.db.entity;

import com.common.togather.api.error.InsufficientBalanceException;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PayAccount {

    // pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    // 계좌명
    @Column(name = "accountName", nullable = false)
    private String accountName;
    
    // 잔액
    @Column(name = "balance", nullable = false)
    @ColumnDefault("0")
    private int balance;
    
    // 비밀번호
    @Column(name = "password", nullable = false)
    private int password;

    // 유저
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    // 실 계좌
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    // 거래 내역
    @OneToMany(mappedBy = "payAccount", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions;

    // 잔액 증가 메서드
    public void increaseBalance(int price) {
        this.balance += price;
    }

    // 잔액 감소 메서드
    public void decreaseBalance(int price) {
        if (this.balance < price) {
            throw new InsufficientBalanceException("잔액이 부족합니다.");
        }
        this.balance -= price;
    }
}
