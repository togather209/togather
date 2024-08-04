package com.common.togather.api.service;

import com.common.togather.api.error.MemberTeamNotFoundException;
import com.common.togather.api.error.ReceiptNotFoundException;
import com.common.togather.api.response.ReceiptFindAllByPlanIdResponse;
import com.common.togather.api.response.ReceiptFindByReceiptIdResponse;
import com.common.togather.db.entity.TeamMember;
import com.common.togather.db.repository.ReceiptRepositorySupport;
import com.common.togather.db.repository.TeamMemberRepositorySupport;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceiptService {

    private final ReceiptRepositorySupport receiptRepositorySupport;
    private final TeamMemberRepositorySupport teamMemberRepositorySupport;

    public ReceiptFindByReceiptIdResponse findReceiptByReceiptId(String email, int teamId, int receiptId) {

        getTeamMember(email, teamId);

        return receiptRepositorySupport.findReceiptByReceiptId(email, receiptId)
                .orElseThrow(() -> new ReceiptNotFoundException(receiptId + "번 영수증이 존재하지 않습니다."));
    }

    public List<ReceiptFindAllByPlanIdResponse> findAllReceiptByPlanId(String email, int teamId, int planId) {

        getTeamMember(email, teamId);

        return receiptRepositorySupport.findAllByPlanId(planId).get();
    }

    private TeamMember getTeamMember(String email, int teamId) {
        return teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, email)
                .orElseThrow(() -> new MemberTeamNotFoundException(teamId + "팀에 " + email + "유저가 존재하지 않습니다."));
    }
}
