package com.common.togather.db.entity;

import com.common.togather.api.error.InsufficientBalanceException;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account {
    // pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // 계좌 종류
    @Column(name = "type", nullable = false)
    private int type;

    // 잔액
    @Column(name = "balance", nullable = false)
    private int balance;

    // 계좌주 이름
    @Column(name = "memberName", nullable = false)
    private String memberName;

    // 핸드폰 번호
    @Column(name = "phone", nullable = false)
    private String phone;

    // 계좌 번호
    @Column(name = "accountNumber", nullable = false)
    private String accountNumber;

    // 생년월일
    @Column(name = "birth", nullable = false)
    private LocalDateTime birth;

    // 비밀번호
    @Column(name = "password", nullable = false)
    private int password;

    // Pay 계좌
    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private PayAccount payAccount;

    // 잔액 감소 메서드
    public void decreaseBalance(int price) {
        if (this.balance < price) {
            throw new InsufficientBalanceException("잔액이 부족합니다.");
        }
        this.balance -= price;
    }
}
