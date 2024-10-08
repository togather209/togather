package com.common.togather.db.repository;

import com.common.togather.api.response.ReceiptFindAllByPlanIdResponse.ReceiptFindByPlanId;
import com.common.togather.api.response.ReceiptFindByReceiptIdResponse;
import com.common.togather.api.response.ReceiptFindByReceiptIdResponse.ItemFindByReceipt;
import com.common.togather.api.response.ReceiptFindByReceiptIdResponse.ItemFindByReceipt.MemberFindByReceipt;
import com.common.togather.db.entity.*;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class ReceiptRepositorySupport {

    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    QReceipt qReceipt = QReceipt.receipt;
    QMember qMember = QMember.member;
    QItem qItem = QItem.item;
    QItemMember qItemMember = QItemMember.itemMember;
    QBookmark qBookmark = QBookmark.bookmark;

    public Optional<ReceiptFindByReceiptIdResponse> findReceiptByReceiptId(String email, int receiptId) {
        ReceiptFindByReceiptIdResponse response = jpaQueryFactory
                .select(Projections.fields(ReceiptFindByReceiptIdResponse.class,
                        qReceipt.id.as("receiptId"),
                        qReceipt.manager.nickname.as("managerName"),
                        qReceipt.businessName.as("businessName"),
                        qReceipt.totalPrice.as("totalPrice"),
                        formattedDate.as("paymentDate"),
                        qReceipt.bookmark.id.as("bookmarkId"),
                        new CaseBuilder()
                                .when(qReceipt.bookmark.isNotNull())
                                .then(qReceipt.bookmark.placeName)
                                .otherwise((String) null)
                                .as("bookmarkName"),
                        qReceipt.color.as("color"),
                        qReceipt.manager.email.eq(email).as("isManager")
                ))
                .from(qReceipt)
                .leftJoin(qReceipt.bookmark, qBookmark)
                .where(qReceipt.id.eq(receiptId))
                .fetchOne();

        if (response == null) {
            return Optional.empty();
        }

        // Item 정보를 가져오기
        List<Tuple> itemResults = jpaQueryFactory
                .select(
                        qItem.id,
                        qItem.name,
                        qItem.unitPrice,
                        qItem.count,
                        qMember.nickname,
                        qMember.profileImg
                )
                .from(qItem)
                .leftJoin(qItem.itemMembers, qItemMember)
                .leftJoin(qItemMember.member, qMember)
                .where(qItem.receipt.id.eq(receiptId))
                .fetch();

        Map<Integer, ItemFindByReceipt> itemMap = new HashMap<>();

        itemResults.forEach(result -> {
            Integer itemId = result.get(qItem.id);

            ItemFindByReceipt item = itemMap.computeIfAbsent(itemId, id -> new ItemFindByReceipt(
                    result.get(qItem.name),
                    result.get(qItem.unitPrice),
                    result.get(qItem.count),
                    new ArrayList<>()
            ));

            MemberFindByReceipt member = new MemberFindByReceipt(
                    result.get(qMember.nickname),
                    result.get(qMember.profileImg)
            );
            item.getMembers().add(member);
        });

        response.setItems(new ArrayList<>(itemMap.values()));

        return Optional.of(response);
    }

    public Optional<List<ReceiptFindByPlanId>> findAllByPlanId(int planId) {
        List<ReceiptFindByPlanId> response = jpaQueryFactory
                .select(Projections.fields(ReceiptFindByPlanId.class,
                        qReceipt.id.as("receiptId"),
                        qReceipt.businessName.as("businessName"),
                        qReceipt.totalPrice.as("totalPrice"),
                        formattedDate.as("paymentDate"),
                        qReceipt.color.as("color")
                ))
                .from(qReceipt)
                .where(qReceipt.plan.id.eq(planId))
                .fetch();

        return Optional.of(response);
    }

    StringTemplate formattedDate = Expressions.stringTemplate(
            "DATE_FORMAT({0}, {1})",
            qReceipt.paymentDate,
            ConstantImpl.create("%Y/%m/%d"));
}
