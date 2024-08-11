package com.common.togather.api.service;

import com.common.togather.api.error.*;
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
    public void savePaymentApprovalByPlanId(String email, int planId) {

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        if (!plan.isManager(email)) {
            throw new UnauthorizedAccessException("정산 요청의 접근 권환이 없습니다.");
        }

        if (plan.getStatus() == 1) {
            throw new InvalidPlanStatusException("이미 일정이 종료 되었습니다.");
        }

        if (plan.getReceipts().size() == 0) {
            throw new ReceiptNotFoundException("정산할 영수증이 없습니다.");
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

    @Transactional
    public PaymentApprovalUpdateByPlanIdResponse UpdatePaymentApprovalByPlanId(String email, int planId) {

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        if (plan.getStatus() != 1) {
            throw new InvalidPlanStatusException("정산 수락을 할 수 있는 정산 종료 상태가 아닙니다.");
        }

        // 수락 동시에 업데이트 확인으로 정산 요청 유무 확인
        if (paymentApprovalRepositorySupport.updateApprovalStatus(planId, email) == 0) {
            throw new NotFoundPaymentApprovalException("해당 정산 요청을 수락했거나 없습니다.");
        }

        // 모든 테이블 정산 요청 되었는지 확인
        Boolean isAllApproved = paymentApprovalRepositorySupport.findAllHasApprovalStatus(planId, email);

        // 모두가 승인을 했다. 모두 동의 된 상태값으로 변경
        if (isAllApproved) {
            plan.updateStatus(2);
        }

        return PaymentApprovalUpdateByPlanIdResponse.builder()
                .isAllApproved(isAllApproved)
                .build();
    }

    @Transactional
    public void DeletePaymentApprovalByPlanId(String email, int planId, String contents) {

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        if (plan.getStatus() != 1) {
            throw new InvalidPlanStatusException("정산 거절을 할 수 있는 정산 종료 상태가 아닙니다.");
        }

        //일정에 유저가 포함 되어 있는지
        paymentApprovalRepository.findByMemberEmailAndPlanId(email, planId)
                .orElseThrow(() -> new NotFoundPaymentApprovalException("해당 정산 요청이 없습니다."));

        // 일정 상태 바꾸기
        plan.updateStatus(0);

        // 일정의 모든 요청 지우기
        paymentApprovalRepository.deleteAllByPlanId(planId);
    }
}
