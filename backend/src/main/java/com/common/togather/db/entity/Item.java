package com.common.togather.db.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Item {

    // pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // 영수증
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receipt_id")
    private Receipt receipt;

    // 품목명
    @Column(name = "name", nullable = false)
    private String name;

    // 단가
    @Column(name = "unit_price", nullable = false)
    private Integer unitPrice;

    // 수량
    @Column(name = "count", nullable = false)
    private Integer count;

    // 품목 유저
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemMember> itemMembers;

    public void setItemMembers(List<ItemMember> itemMembers) {
        this.itemMembers = itemMembers;
    }
}
