package com.common.togather.db.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Entity
@Table(name = "member")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    // pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // 이메일
    @Column(name = "email", nullable = false, unique = true)
    String email;

    // 비밀번호
    @Column(name = "password", nullable = false)
    String password;

    // 닉네임
    @Column(name = "nickname", nullable = false, unique = true)
    String nickname;

    // 이름
    @Column(name = "name", nullable = true)
    String name;

    // 프로필 이미지
    @Column(name = "profile_img", nullable = true)
    String profileImg;

    // 가입 타입
    @Column(name = "type", nullable = true)
    int type;

    @OneToOne(mappedBy = "member", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private PayAccount payAccount;

    // 유저 모임
    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TeamMember> teamMembers;

    // 일정
    @OneToMany(mappedBy = "manager", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Plan> plans;

    // 영수증
    @OneToMany(mappedBy = "manager")
    private List<Receipt> receipts;

    // 유저 품목
    @OneToMany(mappedBy = "member")
    private List<ItemMember> itemMembers;

    // 정산 보내는 사람
    @OneToMany(mappedBy = "sender")
    private List<Payment> sendPayments;

    // 정산 받는 사람
    @OneToMany(mappedBy = "receiver")
    private List<Payment> receivePayments;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaymentApproval> paymentApprovals;

    public void update(String profileImg, String password, String nickname) {
        this.password = password;
        this.nickname = nickname;
        this.profileImg = profileImg;
    }

    // 닉네임 변경
    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    // 프로필 이미지 변경
    public void updateProfileImg(String profileImg) {
        this.profileImg = profileImg;
    }

    // 비밀번호 변경
    public void updatePassword(String password, BCryptPasswordEncoder encoder) {
        this.password = encoder.encode(password);
    }

    // PayAccount와 연관 끊기 메서드
    public void removePayAccount() {
        if (this.payAccount != null) {
            this.payAccount = null;
        }
    }

    // 이름 변경
    public void updateName(String name) {
        this.name = name;
    }
}