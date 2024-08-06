package com.common.togather.db.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class TeamJoin {

    // pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Pay 계좌
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id")
    private Team team;

    // Pay 계좌
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "member_id")
    private Member member;

    // 상태
    // 0 : 요청 중, 1: 모임 신청을 할 수 없는 상태
    @Column(name = "status", nullable = false)
    private int status;

    // 상태를 변경하는 함수
    public void changeStatus(int newStatus) {
        this.status = newStatus;
    }
}
