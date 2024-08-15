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
    private QPaymentApproval qPaymentApproval = QPaymentApproval.paymentApproval;

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

    public List<Member> getReceiptMangers(int planId) {
        return jpaQueryFactory
                .select(qReceipt.manager)
                .from(qReceipt)
                .where(qReceipt.plan.id.eq(planId))
                .groupBy(qReceipt.manager.id)
                .fetch();
    }

    public Long updateApprovalStatus(int planId, String email) {
        return jpaQueryFactory
                .update(qPaymentApproval)
                .set(qPaymentApproval.status, 1)
                .where(qPaymentApproval.plan.id.eq(planId).and(qPaymentApproval.member.email.eq(email)))
                .execute();
    }

    public Boolean findAllHasApprovalStatus(int planId, String email) {
        Long count = jpaQueryFactory
                .select(qPaymentApproval.id)
                .from(qPaymentApproval)
                .where(qPaymentApproval.plan.id.eq(planId))
                .stream().count();

        Long trueCount = jpaQueryFactory
                .select(qPaymentApproval.id)
                .from(qPaymentApproval)
                .where(qPaymentApproval.plan.id.eq(planId)
                        .and(qPaymentApproval.status.eq(1)))
                .stream().count();

        return count.equals(trueCount);
    }
}
