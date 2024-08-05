package com.common.togather.db.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "member")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private PayAccount payAccount;

    // 유저 모임
    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY,  cascade = CascadeType.ALL, orphanRemoval = true)
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

    public void update(String profileImg, String password, String nickname) {
        this.password = password;
        this.nickname = nickname;
        this.profileImg = profileImg;
    }
}