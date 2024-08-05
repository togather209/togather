package com.common.togather.api.service;

import com.common.togather.api.error.*;
import com.common.togather.api.request.PlanSaveRequest;
import com.common.togather.api.request.PlanUpdateRequest;
import com.common.togather.api.response.PlanFindByPlanIdResponse;
import com.common.togather.api.response.PlanUpdateResponse;
import com.common.togather.common.util.JwtUtil;
import com.common.togather.db.entity.Member;
import com.common.togather.db.entity.Plan;
import com.common.togather.db.entity.Team;
import com.common.togather.db.repository.MemberRepository;
import com.common.togather.db.repository.PlanRepository;
import com.common.togather.db.repository.TeamMemberRepositorySupport;
import com.common.togather.db.repository.TeamRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class PlanService {

    private final MemberRepository memberRepository;
    private final PlanRepository planRepository;
    private final TeamMemberRepositorySupport teamMemberRepositorySupport;
    private final TeamRepository teamRepository;
    private final JwtUtil jwtUtil;

    public PlanService(MemberRepository memberRepository, PlanRepository planRepository, TeamMemberRepositorySupport teamMemberRepositorySupport, TeamRepository teamRepository, JwtUtil jwtUtil) {
        this.memberRepository = memberRepository;
        this.planRepository = planRepository;
        this.teamMemberRepositorySupport = teamMemberRepositorySupport;
        this.teamRepository = teamRepository;
        this.jwtUtil = jwtUtil;
    }

    // 일정 추가
    @Transactional
    public void savePlan(int teamId, String authMemberEmail, PlanSaveRequest planSaveRequest) {

        Member member = memberRepository.findByEmail(authMemberEmail)
                .orElseThrow(()-> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(()-> new TeamNotFoundException("해당 팀은 존재하지 않습니다."));

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, authMemberEmail)
                .orElseThrow(()-> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        Plan plan = Plan.builder()
                .title(planSaveRequest.getTitle())
                .description(planSaveRequest.getDescription())
                .startDate(planSaveRequest.getStartDate())
                .endDate(planSaveRequest.getEndDate())
                .manager(member)
                .team(team)
                .status(0)
                .build();

        planRepository.save(plan);

    }

    // 일정 상세 조회
    @Transactional
    public PlanFindByPlanIdResponse getPlanDetail(int teamId, int planId, String authMemberEmail) {

        Member member = memberRepository.findByEmail(authMemberEmail)
                .orElseThrow(()-> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, authMemberEmail)
                .orElseThrow(()-> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        Plan plan = planRepository.findById(planId)
                .orElseThrow(()->new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        int hostId = plan.getManager().getId();

        PlanFindByPlanIdResponse response = PlanFindByPlanIdResponse.builder()
                .managerId(hostId)
                .title(plan.getTitle())
                .description(plan.getDescription())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .isManager(hostId == member.getId()) // 일정장id와 현재 로그인유저id가 같은지 비교
                .build();

        return response;
    }

    // 일정 수정
    @Transactional
    public PlanUpdateResponse updatePlan(int teamId, int planId, String authMemberEmail, PlanUpdateRequest planUpdateRequest) {

        Plan plan = planRepository.findById(planId)
                .orElseThrow(()->new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        memberRepository.findByEmail(authMemberEmail)
                .orElseThrow(()-> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, authMemberEmail)
                .orElseThrow(()-> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        // 일정장만 접근 가능
        if(!plan.getManager().getEmail().equals(authMemberEmail)) {
            throw new UnauthorizedAccessException("일정장이 아니므로 수정할 수 없습니다.");
        }

        // 일정 업데이트
        plan.update(planUpdateRequest.getTitle(), planUpdateRequest.getDescription(),
                planUpdateRequest.getStartDate(), planUpdateRequest.getEndDate());
        planRepository.save(plan);

        PlanUpdateResponse response = PlanUpdateResponse.builder()
                .planId(planId)
                .build();

        return response;
    }
}
