package com.common.togather.db.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Receipt {

    // pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // 일정
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plain_id")
    private Plan plan;

    // 영수증 관리자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member manager;

    // 북마크
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bookmark_id")
    private Bookmark bookmark;

    // 상호명
    @Column(name = "business_name", nullable = false)
    private String businessName;

    // 결제 일자
    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate;

    // 총 금액
    @Column(name = "total_price", nullable = false)
    private int totalPrice;

    // 색
    @Column(name = "color", nullable = false)
    private int color;

    // 품목
    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> items;
}
