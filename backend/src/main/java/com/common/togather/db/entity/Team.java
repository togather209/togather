package com.common.togather.db.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Team {

    // pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 모임명
    @Column(name = "title", nullable = false)
    private String title;

    // 대표 사진
    @Column(name = "team_img", nullable = true)
    private String teamImg;

    // 소개
    @Column(name = "description", nullable = false)
    private String description;

    // 모임 코드
    @Column(name = "code", nullable = false)
    private String code;

    // 모임 유저
    @OneToMany(mappedBy = "team", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TeamMember> teamMembers;

    // 일정
    @OneToMany(mappedBy = "team", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Plan> plans;

    // 모임 수정 메서드
    public void updateTeam(String title, String description, String teamImg) {
        this.title = title;
        this.description = description;
        this.teamImg = teamImg;
    }
}
