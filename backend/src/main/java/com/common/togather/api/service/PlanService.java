package com.common.togather.api.service;

import com.common.togather.api.error.MemberNotFoundException;
import com.common.togather.api.error.MemberTeamNotFoundException;
import com.common.togather.api.error.TeamNotFoundException;
import com.common.togather.api.request.PlanSaveRequest;
import com.common.togather.db.entity.Member;
import com.common.togather.db.entity.Plan;
import com.common.togather.db.entity.Team;
import com.common.togather.db.repository.MemberRepository;
import com.common.togather.db.repository.PlanRepository;
import com.common.togather.db.repository.TeamMemberRepositorySupport;
import com.common.togather.db.repository.TeamRepository;
import org.springframework.stereotype.Service;

@Service
public class PlanService {

    private final MemberRepository memberRepository;
    private final PlanRepository planRepository;
    private final TeamMemberRepositorySupport teamMemberRepositorySupport;
    private final TeamRepository teamRepository;

    public PlanService(MemberRepository memberRepository, PlanRepository planRepository, TeamMemberRepositorySupport teamMemberRepositorySupport, TeamRepository teamRepository) {
        this.memberRepository = memberRepository;
        this.planRepository = planRepository;
        this.teamMemberRepositorySupport = teamMemberRepositorySupport;
        this.teamRepository = teamRepository;
    }

    // 일정 추가
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
}
