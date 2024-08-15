package com.common.togather.api.service;

import com.common.togather.api.error.*;
import com.common.togather.api.response.PaymentApprovalUpdateByPlanIdResponse;
import com.common.togather.common.util.FCMUtil;
import com.common.togather.db.entity.Alarm;
import com.common.togather.db.entity.Member;
import com.common.togather.db.entity.PaymentApproval;
import com.common.togather.db.entity.Plan;
import com.common.togather.db.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.common.togather.common.fcm.AlarmType.PAYMENT_APPROVAL_REQUEST;
import static com.common.togather.common.fcm.AlarmType.PAYMENT_OBJECTION;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentApprovalService {

    private final PlanRepository planRepository;
    private final PaymentApprovalRepositorySupport paymentApprovalRepositorySupport;
    private final PaymentApprovalRepository paymentApprovalRepository;
    private final MemberRepository memberRepository;
    private final AlarmRepository alarmRepository;
    private final FCMUtil fcmUtil;

    // 일정 종료 및 정산 요청
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

        List<PaymentApproval> paymentApprovals = new ArrayList<>();

        List<Member> members = paymentApprovalRepositorySupport.getMembers(planId);

        // 영수증 관리자 추가
        List<Member> managers = paymentApprovalRepositorySupport.getReceiptMangers(planId);

        // 중복 제거
        for (Member manager : managers) {
            boolean flag = false;
            for (Member member : members) {
                if (manager.getId() == member.getId()) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                members.add(manager);
            }
        }

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

        for (Member member : members) {
            // 알림 저장
            alarmRepository.save(Alarm.builder()
                    .member(member)
                    .title(PAYMENT_APPROVAL_REQUEST.getTitle())
                    .content(PAYMENT_APPROVAL_REQUEST.getMessage(plan.getTitle()))
                    .type(PAYMENT_APPROVAL_REQUEST.getType())
                    .tId(plan.getTeam().getId())
                    .pId(planId)
                    .build());

            // 알림 전송
            fcmUtil.pushNotification(
                    member.getFcmToken(),
                    PAYMENT_APPROVAL_REQUEST.getTitle(),
                    PAYMENT_APPROVAL_REQUEST.getMessage(plan.getTitle())
            );
        }
    }

    // 정산 수락
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

    // 정산 거절
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

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new MemberNotFoundException("해당 이메일로 가입된 회원이 없습니다."));

        // 알림 저장
        alarmRepository.save(Alarm.builder()
                .member(plan.getManager())
                .title(PAYMENT_OBJECTION.getTitle())
                .content(PAYMENT_OBJECTION.getMessage(member.getNickname(), plan.getTitle()))
                .type(PAYMENT_OBJECTION.getType())
                .tId(plan.getTeam().getId())
                .pId(planId)
                .build());

        // 알림 전송
        fcmUtil.pushNotification(
                plan.getManager().getFcmToken(),
                PAYMENT_OBJECTION.getTitle(),
                PAYMENT_OBJECTION.getMessage(member.getNickname(), plan.getTitle())
        );

    }
}
