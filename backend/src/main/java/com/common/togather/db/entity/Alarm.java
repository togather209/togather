package com.common.togather.db.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Alarm {

    // pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 회원 id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    // 제목
    @Column(name = "title", nullable = false)
    private String title;

    // 내용
    @Column(name = "content", nullable = false)
    private String content;

    // 0: 정산, 1: 초대,
    @Column(name = "type", nullable = false)
    private int type;

    @Column(name = "tid")
    private Integer tId;

    @Column(name = "pid")
    private Integer pId;

    @Column(name = "mid")
    private Integer mId;
}
