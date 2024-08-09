package com.common.togather.api.service;

import com.common.togather.api.error.NotFoundPaymentApprovalException;
import com.common.togather.api.error.PlanNotFoundException;
import com.common.togather.api.error.UnauthorizedAccessException;
import com.common.togather.api.response.PaymentApprovalUpdateByPlanIdResponse;
import com.common.togather.db.entity.Member;
import com.common.togather.db.entity.PaymentApproval;
import com.common.togather.db.entity.Plan;
import com.common.togather.db.repository.PaymentApprovalRepository;
import com.common.togather.db.repository.PaymentApprovalRepositorySupport;
import com.common.togather.db.repository.PlanRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentApprovalService {

    private final PlanRepository planRepository;
    private final PaymentApprovalRepositorySupport paymentApprovalRepositorySupport;
    private final PaymentApprovalRepository paymentApprovalRepository;

    @Transactional
    public void findPaymentApprovalByPlanId(String email, int planId) {

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        if (!plan.isManager(email)) {
            throw new UnauthorizedAccessException("정산 요청의 접근 권환이 없습니다.");
        }

        plan.updateStatus(1);

        List<Member> members = paymentApprovalRepositorySupport.getMembers(planId);

        List<PaymentApproval> paymentApprovals = new ArrayList<>();

        for (Member member : members) {
            paymentApprovals.add(
                    PaymentApproval.builder()
                            .plan(plan)
                            .member(member)
                            .status(0)
                            .build()
            );
        }
        paymentApprovalRepository.saveAll(paymentApprovals);
    }

    public PaymentApprovalUpdateByPlanIdResponse UpdatePaymentApprovalByPlanId(String email, int planId) {

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        // 수락 동시에 업데이트 확인으로 정산 요청 유무 확인
        if (paymentApprovalRepositorySupport.updateApprovalStatus(planId, email) == 0) {
            throw new NotFoundPaymentApprovalException("해당 정산 요청이 없습니다.");
        }

        // 모든 테이블 정산 요청 되었는지 확인
        return PaymentApprovalUpdateByPlanIdResponse.builder()
                .isAllApproved(paymentApprovalRepositorySupport.findAllHasApprovalStatus(planId, email))
                .build();
    }
}
