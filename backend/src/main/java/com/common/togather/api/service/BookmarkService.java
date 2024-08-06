package com.common.togather.api.service;

import com.common.togather.api.error.*;
import com.common.togather.api.request.BookmarkDateUpdateRequest;
import com.common.togather.api.request.BookmarkSaveRequest;
import com.common.togather.api.response.BookmarkFindAllByDateResponse;
import com.common.togather.api.response.BookmarkFindAllByPlanIdResponse;
import com.common.togather.api.response.BookmarkUpdateDateResponse;
import com.common.togather.common.util.JwtUtil;
import com.common.togather.db.entity.Bookmark;
import com.common.togather.db.entity.Plan;
import com.common.togather.db.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final JwtUtil jwtUtil;
    private final BookmarkRepository bookmarkRepository;
    private final BookmarkRepositorySupport bookmarkRepositorySupport;
    private final PlanRepository planRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepositorySupport teamMemberRepositorySupport;

    public List<BookmarkFindAllByPlanIdResponse> findAllBookmarkByPlanId(String email, int teamId, int planId) {

        planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("해당 일정은 존재하지 않습니다."));

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, email)
                .orElseThrow(() -> new MemberTeamNotFoundException(teamId + "팀에 " + email + "유저가 존재하지 않습니다."));

        return bookmarkRepositorySupport.findAllBookmarkByPlanId(planId).get();
    }

    // 북마크 등록
    @Transactional
    public void addBookmark(int teamId, int planId, String header, BookmarkSaveRequest request) {

        teamRepository.findById(teamId)
                .orElseThrow(() -> new TeamNotFoundException("해당 팀이 존재하지 않습니다."));

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, jwtUtil.getAuthMemberEmail(header))
                .orElseThrow(() -> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        // 일정 불러오기
        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new PlanNotFoundException("해당 일정이 존재하지 않습니다."));
        
        // 같은 일정에 동일한 장소 북마크 등록 불가
        if(bookmarkRepositorySupport.existsSamePlaceInSamePlan(planId, request.getPlaceId())){
            throw new PlaceAlreadyExistsException("해당 일정에 이미 저장한 장소입니다.");
        }

        // 새 북마크 생성
        Bookmark bookmark = Bookmark.builder()
                .plan(plan)
                .placeId(request.getPlaceId())
                .placeImg(request.getPlaceImg())
                .placeName(request.getPlaceName())
                .placeAddr(request.getPlaceAddr())
                .build();

        bookmarkRepository.save(bookmark);

    }

    // 북마크 날짜 지정 및 수정
    @Transactional
    public BookmarkUpdateDateResponse updateDate(int teamId, int planId, int bookmarkId, String header, BookmarkDateUpdateRequest request) {

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, jwtUtil.getAuthMemberEmail(header))
                .orElseThrow(() -> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        planRepository.findById(planId)
                .orElseThrow(()-> new PlanNotFoundException("해당 일정이 존재하지 않습니다."));

        Bookmark bookmark = bookmarkRepository.findById(bookmarkId)
                .orElseThrow(() -> new BookmarkNotFoundException("해당 북마크가 존재하지 않습니다."));

        LocalDate requestDate = request.getDate();
        BookmarkUpdateDateResponse response = new BookmarkUpdateDateResponse();

        // 지정된 날짜가 null이면 찜 목록으로 이동
        if (requestDate == null) {
            response.setIsJjim(true);
            bookmark.moveToJjim(requestDate);
        }
        // 지정된 날짜가 있을 경우
        else {
            response.setIsJjim(false);
            bookmark.moveFromJjim(requestDate, bookmarkRepository.findAllByDate(requestDate).size());
        }

        // 해당 북마크 date값 수정
        bookmarkRepository.save(bookmark);

        return response;
    }

    // 날짜가 정해진 북마크 조회
    public List<BookmarkFindAllByDateResponse> findAllBookmarkByDate(int teamId, int planId, String date, String header) {
        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, jwtUtil.getAuthMemberEmail(header))
                .orElseThrow(() -> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        planRepository.findById(planId)
                .orElseThrow(()-> new PlanNotFoundException("해당 일정이 존재하지 않습니다."));

        // 해당 날짜인 모든 북마크 리스트
        List<Bookmark> bookmarkList = bookmarkRepository.findAllByDate(LocalDate.parse(date, DateTimeFormatter.ofPattern("yyMMdd")));

        return bookmarkList.stream()
                .sorted(((o1, o2) -> Integer.compare(o1.getItemOrder(), o2.getItemOrder())))
                .map(bookmark -> BookmarkFindAllByDateResponse.builder()
                        .bookmarkId(bookmark.getId())
                        .placeId(bookmark.getPlaceId())
                        .placeImg(bookmark.getPlaceImg())
                        .placeName(bookmark.getPlaceName())
                        .placeAddr(bookmark.getPlaceAddr())
                        .itemOrder(bookmark.getItemOrder())
                        .receiptCnt(bookmark.getReceipts() != null ? bookmark.getReceipts().size() : 0)
                        .build())
                .collect(Collectors.toList());

    }
}
