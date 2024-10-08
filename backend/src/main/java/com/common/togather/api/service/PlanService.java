package com.common.togather.api.service;

import com.common.togather.api.error.*;
import com.common.togather.api.request.PlanSaveRequest;
import com.common.togather.api.request.PlanUpdateRequest;
import com.common.togather.api.response.PlanFindAuthAccessResponse;
import com.common.togather.api.response.PlanFindByPlanIdResponse;
import com.common.togather.api.response.PlanSaveResponse;
import com.common.togather.api.response.ReceiptFindAllByPlanIdResponse.ReceiptFindByPlanId;
import com.common.togather.common.util.JwtUtil;
import com.common.togather.db.entity.Member;
import com.common.togather.db.entity.Plan;
import com.common.togather.db.entity.Team;
import com.common.togather.db.repository.*;
import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlanService {

    private final MemberRepository memberRepository;
    private final PlanRepository planRepository;
    private final TeamMemberRepositorySupport teamMemberRepositorySupport;
    private final TeamRepository teamRepository;
    private final JwtUtil jwtUtil;
    private final ReceiptService receiptService;
    private final ReceiptRepositorySupport receiptRepositorySupport;

    public PlanService(MemberRepository memberRepository, PlanRepository planRepository, TeamMemberRepositorySupport teamMemberRepositorySupport, TeamRepository teamRepository, JwtUtil jwtUtil, ReceiptService receiptService, ReceiptRepositorySupport receiptRepositorySupport) {
        this.memberRepository = memberRepository;
        this.planRepository = planRepository;
        this.teamMemberRepositorySupport = teamMemberRepositorySupport;
        this.teamRepository = teamRepository;
        this.jwtUtil = jwtUtil;
        this.receiptService = receiptService;
        this.receiptRepositorySupport = receiptRepositorySupport;
    }

    // 오픈비두
    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    // 일정 추가
    @Transactional
    public PlanSaveResponse savePlan(int teamId, String authMemberEmail, PlanSaveRequest planSaveRequest) throws OpenViduJavaClientException, OpenViduHttpException {

        Member member = memberRepository.findByEmail(authMemberEmail)
                .orElseThrow(() -> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new TeamNotFoundException("해당 팀은 존재하지 않습니다."));

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, authMemberEmail)
                .orElseThrow(() -> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        // 오픈비두 세션 생성
        OpenVidu openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
        SessionProperties properties = new SessionProperties.Builder().build();
        Session session = openvidu.createSession(properties);

        Plan plan = Plan.builder()
                .title(planSaveRequest.getTitle())
                .description(planSaveRequest.getDescription())
                .startDate(planSaveRequest.getStartDate())
                .endDate(planSaveRequest.getEndDate())
                .manager(member)
                .team(team)
                .status(0)
                .sessionId(session.getSessionId()) // 만들어진 세션ID 맵핑
                .build();

        planRepository.save(plan);

        PlanSaveResponse response = PlanSaveResponse.builder()
                .teamId(teamId)
                .planId(plan.getId())
                .sessionId(plan.getSessionId())
                .build();

        return response;
    }

    // 일정 상세 조회
    public PlanFindByPlanIdResponse getPlanDetail(int teamId, int planId, String authMemberEmail) {

        Member member = memberRepository.findByEmail(authMemberEmail)
                .orElseThrow(() -> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, authMemberEmail)
                .orElseThrow(() -> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        int hostId = plan.getManager().getId();

        PlanFindByPlanIdResponse response = PlanFindByPlanIdResponse.builder()
                .managerId(hostId)
                .title(plan.getTitle())
                .description(plan.getDescription())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .isManager(hostId == member.getId()) // 일정장id와 현재 로그인유저id가 같은지 비교
                .status(plan.getStatus())
                .sessionId(plan.getSessionId())
                .build();

        return response;
    }

    // 일정 수정
    @Transactional
    public void updatePlan(int teamId, int planId, String authMemberEmail, PlanUpdateRequest planUpdateRequest) {

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        memberRepository.findByEmail(authMemberEmail)
                .orElseThrow(() -> new MemberNotFoundException("해당 회원이 존재하지 않습니다."));

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, authMemberEmail)
                .orElseThrow(() -> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        // 일정장만 접근 가능
        if (!plan.getManager().getEmail().equals(authMemberEmail)) {
            throw new UnauthorizedAccessException("일정장이 아니므로 수정할 수 없습니다.");
        }

        // 일정 업데이트
        plan.update(planUpdateRequest.getTitle(), planUpdateRequest.getDescription(),
                planUpdateRequest.getStartDate(), planUpdateRequest.getEndDate());
        planRepository.save(plan);
    }

    // 일정 삭제
    @Transactional
    public void deletePlan(int teamId, int planId, String authMemberEmail) throws OpenViduJavaClientException, OpenViduHttpException {

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, authMemberEmail)
                .orElseThrow(() -> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        // 일정장만 접근 가능
        if (!plan.getManager().getEmail().equals(authMemberEmail)) {
            throw new UnauthorizedAccessException("일정장이 아니므로 삭제할 수 없습니다.");
        }

        // 정산이 끝났거나 등록된 영수증이 없으면 삭제 가능
        Optional<List<ReceiptFindByPlanId>> receiptList = receiptRepositorySupport.findAllByPlanId(planId);
        if (plan.getStatus() == 1 || !receiptList.isPresent() || receiptList.get().isEmpty()) {
            // 만약 해당 일정의 세션이 아직 활성화 되어 있으면 세션 닫기
            Session session = openvidu.getActiveSession(plan.getSessionId());
            if(session != null){
                session.close();
            }
            planRepository.deleteById(planId);
        } else throw new DeletionNotAllowedException("정산이 완료 됐거나 등록된 영수증이 없어야 일정을 삭제할 수 있습니다.");

    }

    // 일정 권한 조회
    public PlanFindAuthAccessResponse findAuthAccessPlan(String email, int planId) {

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        return PlanFindAuthAccessResponse.builder()
                .isManager(plan.isManager(email))
                .build();
    }
}
