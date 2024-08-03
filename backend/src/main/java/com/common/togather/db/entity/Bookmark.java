package com.common.togather.db.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Bookmark {

    // pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // 일정
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paln_id")
    private Plan plan;

    // 장소 사진
    @Column(name = "placeImg", nullable = true)
    private String place_img;

    // 장소명
    @Column(name = "palceName", nullable = false)
    private String place_name;

    // 장소 주소
    @Column(name = "placeAddr", nullable = true)
    private String place_addr;

    // 일자
    @Column(name = "day", nullable = false)
    private int day;

    // 순서
    @Column(name = "index", nullable = false)
    private int index;

    // 영수증
    @OneToMany(mappedBy = "bookmark")
    private List<Receipt> receipts;
}


