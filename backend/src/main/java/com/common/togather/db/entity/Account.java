package com.common.togather.db.entity;

import com.common.togather.api.error.InsufficientBalanceException;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account {
    // pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    // 계좌 종류
    /*0 : 국민은행
    1 : 신한은행
    2 : 하나은행
    3 : 우리은행
    4 : 농협은행
    5 : 한국씨티은행
    6 : SC제일은행
    7 : 기업은행
    8 : 산업은행*/
    @Column(name = "type", nullable = false)
    private int type;

    // 잔액
    @Column(name = "balance", nullable = false)
    private int balance;

    // 계좌주 이름
    @Column(name = "member_name", nullable = false)
    private String memberName;

    // 핸드폰 번호
    @Column(name = "phone", nullable = false)
    private String phone;

    // 계좌 번호
    @Column(name = "account_number", nullable = false)
    private String accountNumber;

    // 생년월일
    @Column(name = "birth", nullable = false)
    private LocalDate birth;

    // 비밀번호
    @Column(name = "password", nullable = false)
    private int password;

    // Pay 계좌
    @OneToOne(mappedBy = "account", fetch = FetchType.EAGER)
    private PayAccount payAccount;

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

    // PayAccount와 연관 끊기 메서드
    public void removePayAccount() {
        if (this.payAccount != null) {
            this.payAccount = null;
        }
    }
}
