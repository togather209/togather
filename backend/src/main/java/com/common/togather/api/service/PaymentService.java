package com.common.togather.api.service;

import com.common.togather.api.error.MemberTeamNotFoundException;
import com.common.togather.api.error.PlanNotFoundException;
import com.common.togather.api.response.PaymentFindByPlanIdResponse;
import com.common.togather.db.entity.Plan;
import com.common.togather.db.repository.PaymentRepositorySupport;
import com.common.togather.db.repository.PlanRepository;
import com.common.togather.db.repository.TeamMemberRepositorySupport;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepositorySupport paymentRepositorySupport;
    private final TeamMemberRepositorySupport teamMemberRepositorySupport;
    private final PlanRepository planRepository;

    public PaymentFindByPlanIdResponse findPaymentByPlanId(String email, int teamId, int planId) {

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, email)
                .orElseThrow(() -> new MemberTeamNotFoundException(teamId + "팀에 " + email + "유저가 존재하지 않습니다."));

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        return paymentRepositorySupport.findPaymentByPlanId(email, teamId, planId).get();
    }
}
