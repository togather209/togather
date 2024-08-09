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
    @Column(name = "account_name", nullable = false)
    private String accountName;

    // 잔액
    @Column(name = "balance")
    @ColumnDefault("0")
    private int balance;

    // 비밀번호
    @Column(name = "password", nullable = false)
    private String password;

    // 유저
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // 실 계좌
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "account_id", nullable = false)
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

    // Member와 Account와 연관 제거 메서드
    public void removeAssociation() {
        if (this.member != null) {
            this.member.removePayAccount();
        }
        if (this.account != null) {
            this.account.removePayAccount();
        }
        this.member = null;
        this.account = null;
    }
}
