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
    private Integer id;

    // 일정
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
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
    private Integer totalPrice;

    // 색
    @Column(name = "color", nullable = false)
    private Integer color;

    // 품목
    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> items;

    public void saveItems(List<Item> items) {
        this.items = items;
    }

    public void addItems(List<Item> items) {
        this.items.addAll(items);
    }

    public Boolean isManager(String email) {
        return manager.getEmail().equals(email);
    }

    public void updateReceipt(Bookmark bookmark, String businessName, LocalDateTime paymentDate, Integer totalPrice, Integer color) {
        this.bookmark = bookmark;
        this.businessName = businessName;
        this.paymentDate = paymentDate;
        this.totalPrice = totalPrice;
        this.color = color;
    }
}
