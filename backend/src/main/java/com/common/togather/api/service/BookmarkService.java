package com.common.togather.api.service;

import com.common.togather.api.error.BookmarkNotFoundException;
import com.common.togather.api.error.MemberTeamNotFoundException;
import com.common.togather.api.error.PlanNotFoundException;
import com.common.togather.api.error.TeamNotFoundException;
import com.common.togather.api.request.BookmarkDateUpdateRequest;
import com.common.togather.api.request.BookmarkSaveRequest;
import com.common.togather.api.response.BookmarkUpdateDateResponse;
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

import java.time.LocalDate;

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

    // 북마크 날짜 지정 및 수정
    @Transactional
    public BookmarkUpdateDateResponse updateDate(int teamId, int planId, int bookmarkId, String header, BookmarkDateUpdateRequest request) {

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId,jwtUtil.getAuthMemberEmail(header))
                .orElseThrow(()-> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        Bookmark bookmark = bookmarkRepository.findById(bookmarkId)
                .orElseThrow(()-> new BookmarkNotFoundException("해당 북마크가 존재하지 않습니다."));

        LocalDate requestDate = request.getDate();
        BookmarkUpdateDateResponse response = new BookmarkUpdateDateResponse();

        // 지정된 날짜가 없으면 찜 목록으로
        if(requestDate==null){
            response.setIsJjim(true);
        }
        // 지정된 날짜가 있을 경우
        else response.setIsJjim(false);

        // 해당 북마크 date값 수정
        bookmark.updateDate(requestDate);
        bookmarkRepository.save(bookmark);

        return response;
    }
}
