package com.common.togather.db.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class TeamMember {

    //pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    // 유저
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    Member member;

    // 모임
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    Team team;

    // 모임 권한
    Integer role;
}
