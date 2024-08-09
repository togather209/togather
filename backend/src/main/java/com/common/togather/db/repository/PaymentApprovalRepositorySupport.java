package com.common.togather.db.repository;

import com.common.togather.db.entity.*;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PaymentApprovalRepositorySupport {

    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    private QReceipt qReceipt = QReceipt.receipt;
    private QItem qItem = QItem.item;
    private QItemMember qItemMember = QItemMember.itemMember;
    private QMember qMember = QMember.member;

    public List<Member> getMembers(int planId) {
        return jpaQueryFactory
                .select(qMember)
                .from(qReceipt)
                .join(qItem).on(qReceipt.id.eq(qItem.receipt.id))
                .join(qItemMember).on(qItemMember.item.id.eq(qItem.id))
                .join(qMember).on(qItemMember.member.id.eq(qMember.id))
                .where(qReceipt.plan.id.eq(planId))
                .groupBy(qMember.id)
                .fetch();
    }
}
