package com.common.togather.db.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
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
    @Column(name = "description", nullable = true)
    private String description;

    // 시작일
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    // 종료일
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    // 정산 여부
    @Column(name = "status", nullable = false)
    private Integer status;

    // 세션 ID
    @Column(name = "sessionId", nullable = false)
    private String sessionId;

    // 영수증
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Receipt> receipts;

    // 북마크
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bookmark> bookmarks;

    // 정산
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments;

    // 정산 수락
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaymentApproval> paymentApprovals;

    public void update(String title, String description, LocalDate startDate, LocalDate endDate) {
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Boolean isManager(String email) {
        return manager.getEmail().equals(email);
    }

    public void updateStatus(Integer status) {
        this.status = status;
    }
}
