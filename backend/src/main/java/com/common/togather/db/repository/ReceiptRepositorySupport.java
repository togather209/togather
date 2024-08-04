package com.common.togather.db.repository;

import com.common.togather.api.response.ReceiptFindAllByPlanIdResponse;
import com.common.togather.api.response.ReceiptFindByReceiptIdResponse;
import com.common.togather.api.response.ReceiptFindByReceiptIdResponse.ItemFindByReceipt;
import com.common.togather.api.response.ReceiptFindByReceiptIdResponse.ItemFindByReceipt.MemberFindByReceipt;
import com.common.togather.db.entity.QItem;
import com.common.togather.db.entity.QItemMember;
import com.common.togather.db.entity.QMember;
import com.common.togather.db.entity.QReceipt;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ReceiptRepositorySupport {

    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    QReceipt qReceipt = QReceipt.receipt;
    QMember qMember = QMember.member;
    QItem qItem = QItem.item;
    QItemMember qItemMember = QItemMember.itemMember;

    public Optional<ReceiptFindByReceiptIdResponse> findReceiptByReceiptId(String email, int receiptId) {
        ReceiptFindByReceiptIdResponse response = jpaQueryFactory
                .select(Projections.fields(ReceiptFindByReceiptIdResponse.class,
                        qReceipt.id.as("receiptId"),
                        qReceipt.manager.nickname.as("managerName"),
                        qReceipt.businessName.as("businessName"),
                        qReceipt.totalPrice.as("totalPrice"),
                        qReceipt.paymentDate.as("paymentDate"),
                        qReceipt.color.as("color"),
                        qReceipt.manager.email.eq(email).as("isManager")
                ))
                .from(qReceipt)
                .where(qReceipt.id.eq(receiptId))
                .fetchOne();

        if (response == null) {
            return Optional.empty();
        }

        List<ItemFindByReceipt> items = jpaQueryFactory
                .select(Projections.constructor(ItemFindByReceipt.class,
                        qItem.name.as("name"),
                        qItem.unitPrice.as("unitPrice"),
                        qItem.count.as("count"),
                        Projections.list(
                                Projections.constructor(MemberFindByReceipt.class,
                                        qMember.nickname.as("nickname"),
                                        qMember.profileImg.as("profileImg"))
                        )
                ))
                .from(qItem)
                .leftJoin(qItem.itemMembers, qItemMember)
                .leftJoin(qItemMember.member, qMember)
                .where(qItem.receipt.id.eq(receiptId))
                .fetch();

        response.setItems(items);

        return Optional.of(response);
    }

    public Optional<List<ReceiptFindAllByPlanIdResponse>> findAllByPlanId(int planId) {
        List<ReceiptFindAllByPlanIdResponse> response = jpaQueryFactory
                .select(Projections.fields(ReceiptFindAllByPlanIdResponse.class,
                        qReceipt.id.as("receiptId"),
                        qReceipt.businessName.as("businessName"),
                        qReceipt.totalPrice.as("totalPrice"),
                        qReceipt.paymentDate.as("paymentDate"),
                        qReceipt.color.as("color")
                ))
                .from(qReceipt)
                .where(qReceipt.plan.id.eq(planId))
                .fetch();

        return Optional.of(response);
    }
}
