package com.common.togather.api.service;

import com.common.togather.api.error.MemberTeamNotFoundException;
import com.common.togather.api.error.PlanNotFoundException;
import com.common.togather.api.error.TeamNotFoundException;
import com.common.togather.api.request.BookmarkSaveRequest;
import com.common.togather.common.util.JwtUtil;
import com.common.togather.db.entity.Bookmark;
import com.common.togather.db.entity.Plan;
import com.common.togather.db.repository.BookmarkRepository;
import com.common.togather.db.repository.PlanRepository;
import com.common.togather.db.repository.TeamMemberRepositorySupport;
import com.common.togather.db.repository.TeamRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final TeamMemberRepositorySupport teamMemberRepositorySupport;
    private final JwtUtil jwtUtil;
    private final PlanRepository planRepository;
    private final TeamRepository teamRepository;
    private final BookmarkRepository bookmarkRepository;

    // 북마크 등록
    @Transactional
    public void addBookmark(int teamId, int planId, String header, BookmarkSaveRequest request) {

        teamRepository.findById(teamId)
                        .orElseThrow(()->new TeamNotFoundException("해당 팀이 존재하지 않습니다."));

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId,jwtUtil.getAuthMemberEmail(header))
                .orElseThrow(()-> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        // 일정 불러오기
        Plan plan = planRepository.findById(planId)
                .orElseThrow(()->new PlanNotFoundException("해당 일정이 존재하지 않습니다."));

        // 새 북마크 생성
        Bookmark bookmark = Bookmark.builder()
                .plan(plan)
                .placeImg(request.getPlaceImg())
                .placeName(request.getPlaceName())
                .placeAddr(request.getPlaceAddr())
                .build();

        bookmarkRepository.save(bookmark);

    }
}
