package com.common.togather.db.repository;

import com.common.togather.api.response.PaymentFindByPlanIdResponse;
import com.common.togather.db.entity.QPayment;
import com.common.togather.db.entity.QPaymentApproval;
import com.common.togather.db.entity.QPlan;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class PaymentRepositorySupport {

    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    private QPayment qPayment = QPayment.payment;
    private QPlan qPlan = QPlan.plan;
    private QPaymentApproval qPaymentApproval = QPaymentApproval.paymentApproval;

    public Optional<PaymentFindByPlanIdResponse> findPaymentByPlanId(String email, int teamId, int planId) {
        List<Tuple> paymentResults = jpaQueryFactory
                .select(
                        qPlan.team.title,
                        qPlan.title,
                        qPlan.startDate,
                        qPlan.endDate,
                        qPlan.status


                )
                .from(qPlan)
                .where(qPlan.plan.id.eq(planId))
                .fetch();
        return null;
    }

    NumberExpression<Integer> resultStatus = new CaseBuilder()
            .when(qPlan.status.eq(2)).then(2)   // 전체 동의 후
            .when(qPlan.status.eq(3)).then(3)   // 송금 완료
            .when(qPlan.status.eq(1).and(qPaymentApproval.status.eq(0))).then(0)    // 정산 동의 전
            .when(qPlan.status.eq(1).and(qPaymentApproval.status.eq(1))).then(1)    // 정산 동의 후
            .when(qPlan.status.eq(1).and(qPaymentApproval.status.eq(2))).then(-1)   // 정산 거절 후
            .otherwise(-999)
            .as("status");
}
