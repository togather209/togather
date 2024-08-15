package com.common.togather.db.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class FCMToken {

    // pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 회원 id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    // fcm 토큰
    @Column(name = "token")
    private String token;

    public void updateToken(String token) {
        this.token = token;
    }

    // 멤버와 연관 끊기 메서드
    public void removeMember() {
        if (this.member != null) {
            this.member.removeFcmToken();
            this.member = null;
        }
    }

}
