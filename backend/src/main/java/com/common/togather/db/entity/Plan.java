package com.common.togather.db.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Plan {

    // pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 모임
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    // 일정 관리자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member manager;

    // 일정명
    @Column(name = "title", nullable = false)
    private String title;

    // 소개
    @Column(name = "description", nullable = false)
    private String description;

    // 시작일
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    // 종료일
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    // 정산 여부
    @Column(name = "status", nullable = false)
    private Integer status;

    // 영수증
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Receipt> receipts;

    // 북마크
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bookmark> bookmarks;
}
