package com.common.togather.api.service;

import com.common.togather.api.error.MemberTeamNotFoundException;
import com.common.togather.api.error.ReceiptNotFoundException;
import com.common.togather.api.response.ReceiptFindByReceiptIdResponse;
import com.common.togather.db.repository.ReceiptRepositorySupport;
import com.common.togather.db.repository.TeamMemberRepositorySupport;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReceiptService {

    private final ReceiptRepositorySupport receiptRepositorySupport;
    private final TeamMemberRepositorySupport teamMemberRepositorySupport;

    public ReceiptFindByReceiptIdResponse findReceiptByReceiptId(String email, int teamId, int receiptId) {

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, email)
                .orElseThrow(() -> new MemberTeamNotFoundException(teamId + "팀에 " + email + "유저가 존재하지 않습니다."));

        return receiptRepositorySupport.findReceiptByReceiptId(email, receiptId)
                .orElseThrow(() -> new ReceiptNotFoundException(receiptId + "번 영수증이 존재하지 않습니다."));
    }
}
