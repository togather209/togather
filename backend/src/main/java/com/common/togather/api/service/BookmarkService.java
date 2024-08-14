package com.common.togather.api.service;

import com.common.togather.api.error.*;
import com.common.togather.api.request.BookmarkDateUpdateRequest;
import com.common.togather.api.request.BookmarkOrderUpdateRequest;
import com.common.togather.api.request.BookmarkSaveRequest;
import com.common.togather.api.response.*;
import com.common.togather.common.util.JwtUtil;
import com.common.togather.db.entity.Bookmark;
import com.common.togather.db.entity.Plan;
import com.common.togather.db.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
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
                .itemOrder(0)
                .build();

        bookmarkRepository.save(bookmark);

    }

    // 북마크 날짜 지정 및 수정
    @Transactional
    public List<BookmarkDateUpdateResponse> updateDate(int teamId, int planId, int bookmarkId, String header, BookmarkDateUpdateRequest request) {

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, jwtUtil.getAuthMemberEmail(header))
                .orElseThrow(() -> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        Plan plan = planRepository.findById(planId)
                .orElseThrow(()-> new PlanNotFoundException("해당 일정이 존재하지 않습니다."));

        // 수정된 북마크
        Bookmark updatedBookmark = bookmarkRepository.findById(bookmarkId)
                .orElseThrow(() -> new BookmarkNotFoundException("해당 북마크가 존재하지 않습니다."));

        LocalDate oldDate = updatedBookmark.getDate(); // 기존 날짜
        LocalDate newDate = request.getDate(); // 새로운 날짜

        // 일정 날짜 범위를 벗어나면 안됨
        if(newDate != null){
            if( !((newDate.isBefore(plan.getEndDate()) || newDate.isEqual(plan.getEndDate())) &&
                    (newDate.isAfter(plan.getStartDate())|| newDate.isEqual(plan.getStartDate()))))  {
                throw new UpdateNotAllwedException("가능한 날짜 범위를 벗어났습니다.");
            }
        }

        // 날짜 정보가 있던 장소가 찜으로 이동하는 경우
        if (oldDate != null && newDate == null) {
            // 영수증 등록된 장소는 찜으로 이동 불가능
            if(!updatedBookmark.getReceipts().isEmpty()){
                throw new UpdateNotAllwedException("영수증이 등록된 장소는 찜목록으로 이동할 수 없습니다.");
            }

            int oldOrder = updatedBookmark.getItemOrder();
            // 날짜와 순서 모두 null로 변경
            updatedBookmark.moveToJjim();
            bookmarkRepository.save(updatedBookmark);

            // 수정된 요소와 같은 날짜에 있던 요소들 순서 바꿔주기
            List<Bookmark> oldBookmarkList = bookmarkRepository.findAllByDate(oldDate);
            for(Bookmark bookmark : oldBookmarkList){
                // 수정된 요소가 가지고 있던 순서보다 더 뒷 순서면 -1
                if(bookmark.getItemOrder() > oldOrder){
                    bookmark.updateOrder(bookmark.getItemOrder() - 1);
                }
            }
            bookmarkRepository.save(updatedBookmark); // 변경사항 저장
        }
        // 찜에 있던 장소에 날짜를 지정해준 경우, 날짜 변경하고 순서는 그 날짜의 가장 마지막으로 설정
        else if (oldDate == null && newDate != null) {
            updatedBookmark.updateDate(newDate, bookmarkRepositorySupport.findAllBookmarkByDateInSamePlan(planId, newDate).size());
            bookmarkRepository.save(updatedBookmark);
        }

        // 날짜 정보가 있던 장소를 다른 날짜로 이동하는 경우 양쪽 모두 순서 재정렬
        else {
            int oldOrder = updatedBookmark.getItemOrder();
            updatedBookmark.updateDate(newDate, bookmarkRepository.findAllByDate(newDate).size());
            bookmarkRepository.save(updatedBookmark);

            // 수정된 요소와 같은 날짜에 있던 요소들 순서 바꿔주기
            List<Bookmark> oldBookmarkList = bookmarkRepository.findAllByDate(oldDate);
            for(Bookmark bookmark : oldBookmarkList){
                // 수정된 요소가 가지고 있던 순서보다 더 뒷 순서면 -1
                if(bookmark.getItemOrder() > oldOrder){
                    bookmark.updateOrder(bookmark.getItemOrder() - 1);
                }
            }
            bookmarkRepository.save(updatedBookmark); // 변경사항 저장
        }

        // OldDate 북마크 리스트
        List<Bookmark> oldDateBookmarkList;
        if(oldDate == null){ // 찜에서 이동한거면 변경된 찜 리스트 보여주기
            oldDateBookmarkList = bookmarkRepositorySupport.findAllBookmarkByNullDateInSamePlan(planId);
        }
        else{ // 변경된 기존 날짜 북마크 보여주기
            oldDateBookmarkList = bookmarkRepositorySupport.findAllBookmarkByDateInSamePlan(planId, oldDate);
        }

        // NewDate 북마크 리스트
        List<Bookmark> newDateBookmarkList;
        if(newDate == null){
            newDateBookmarkList = bookmarkRepositorySupport.findAllBookmarkByNullDateInSamePlan(planId);
        }
        else {
            newDateBookmarkList = bookmarkRepositorySupport.findAllBookmarkByDateInSamePlan(planId, newDate);
        }

        List<BookmarkDateUpdateResponse> oldDateResponseList = oldDateBookmarkList.stream()
                .sorted(((o1, o2) -> Integer.compare(o1.getItemOrder(), o2.getItemOrder())))
                .map(bookmark -> BookmarkDateUpdateResponse.builder()
                        .bookmarkId(bookmark.getId())
                        .date(bookmark.getDate())
                        .placeId(bookmark.getPlaceId())
                        .placeImg(bookmark.getPlaceImg())
                        .placeName(bookmark.getPlaceName())
                        .placeAddr(bookmark.getPlaceAddr())
                        .itemOrder(bookmark.getItemOrder())
                        .receiptCnt(bookmark.getReceipts() != null ? bookmark.getReceipts().size() : 0)
                        .build())
                .collect(Collectors.toList());

        return oldDateResponseList; // 서비스 return

    }

    // 날짜가 정해진 북마크 조회
    public List<BookmarkFindAllByDateResponse> findAllBookmarkByDate(int teamId, int planId, LocalDate date, String header) {
        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, jwtUtil.getAuthMemberEmail(header))
                .orElseThrow(() -> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        Plan plan = planRepository.findById(planId)
                .orElseThrow(()-> new PlanNotFoundException("해당 일정이 존재하지 않습니다."));


        // 일정 날짜 범위를 벗어나면 안됨
        if(date != null){
            if( !((date.isBefore(plan.getEndDate()) || date.isEqual(plan.getEndDate())) &&
                    (date.isAfter(plan.getStartDate())|| date.isEqual(plan.getStartDate()))))  {
                throw new BookmarkNotFoundException("해당 날짜의 북마크를 찾을 수 없습니다.");
            }
        }

        // 해당 일정 중 해당 날짜를 갖는 모든 북마크 리스트
        List<Bookmark> bookmarkList = bookmarkRepositorySupport.findAllBookmarkByDateInSamePlan(planId,date);

        return bookmarkList.stream()
                .sorted(((o1, o2) -> Integer.compare(o1.getItemOrder(), o2.getItemOrder())))
                .map(bookmark -> BookmarkFindAllByDateResponse.builder()
                        .bookmarkId(bookmark.getId())
                        .date(bookmark.getDate())
                        .placeId(bookmark.getPlaceId())
                        .placeImg(bookmark.getPlaceImg())
                        .placeName(bookmark.getPlaceName())
                        .placeAddr(bookmark.getPlaceAddr())
                        .itemOrder(bookmark.getItemOrder())
                        .receiptCnt(bookmark.getReceipts() != null ? bookmark.getReceipts().size() : 0)
                        .build())
                .collect(Collectors.toList());

    }

    // 찜 목록 조회
    public List<BookmarkFindAllInJjinResponse> findAllBookmarkInJjim(int teamId, int planId, String header) {
        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, jwtUtil.getAuthMemberEmail(header))
                .orElseThrow(() -> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        planRepository.findById(planId)
                .orElseThrow(()-> new PlanNotFoundException("해당 일정이 존재하지 않습니다."));

        // 해당 일정 찜 리스트
        List<Bookmark> bookmarkList = bookmarkRepositorySupport.findAllBookmarkByNullDateInSamePlan(planId);
        return bookmarkList.stream()
                .map(bookmark -> BookmarkFindAllInJjinResponse.builder()
                        .bookmarkId(bookmark.getId())
                        .date(bookmark.getDate())
                        .placeId(bookmark.getPlaceId())
                        .placeImg(bookmark.getPlaceImg())
                        .placeName(bookmark.getPlaceName())
                        .placeAddr(bookmark.getPlaceAddr())
                        .itemOrder(bookmark.getItemOrder())
                        .receiptCnt(bookmark.getReceipts() != null ? bookmark.getReceipts().size() : 0)
                        .build())
                .collect(Collectors.toList());

    }

    // 동일 날짜 내 북마크 순서 변경
    @Transactional
    public List<BookmarkOrderUpdateResponse> updateOrder(int teamId, int planId, int bookmarkId, String header, BookmarkOrderUpdateRequest request) {

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, jwtUtil.getAuthMemberEmail(header))
                .orElseThrow(() -> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        planRepository.findById(planId)
                .orElseThrow(()-> new PlanNotFoundException("해당 일정이 존재하지 않습니다."));

        Bookmark movedBookmark = bookmarkRepository.findById(bookmarkId)
                .orElseThrow(() -> new BookmarkNotFoundException("해당 북마크가 존재하지 않습니다."));

        int oldOrder = movedBookmark.getItemOrder(); // 원래 갖고 있던 순서
        int newOrder = request.getNewOrder(); // 새로 바뀐 순서

        // 순서 이동이 있었을 때만
        if(oldOrder != newOrder) {

            // 바꾼 요소의 순서를 수정
            movedBookmark.updateOrder(request.getNewOrder());
            bookmarkRepository.save(movedBookmark);

            // 바꾼 요소와 같은 날짜인 북마크 모두 조회
            List<Bookmark> bookmarkList = bookmarkRepositorySupport.findAllBookmarkByDateInSamePlan(planId, movedBookmark.getDate());

            for(Bookmark bookmark : bookmarkList) {
                // 변경한 요소가 아닌 다른 요소들 중에서만 판단
                if(bookmark.getId() != bookmarkId) {
                    // 새 순서가 이전 순서보다 작아졌다면, 새 순서 이상이면서 이전 순서보다 작은 요소들을 +1
                    if(newOrder < oldOrder && bookmark.getItemOrder() >= newOrder && bookmark.getItemOrder() < oldOrder) {
                        bookmark.updateOrder(bookmark.getItemOrder()+1);
                    }
                    // 새 순서가 이전 순서보다 커졌다면, 새 순서 이하면서 이전 순서보다 큰 요소들을 -1
                    else if(newOrder > oldOrder && bookmark.getItemOrder() <= newOrder && bookmark.getItemOrder() > oldOrder) {
                        bookmark.updateOrder(bookmark.getItemOrder()-1);
                    }
                    bookmarkRepository.save(movedBookmark);
                }
            }

        }

        List<Bookmark> updateList = bookmarkRepositorySupport.findAllBookmarkByDateInSamePlan(planId, movedBookmark.getDate());
        List<BookmarkOrderUpdateResponse> responseList = updateList.stream()
                .sorted(((o1, o2) -> Integer.compare(o1.getItemOrder(), o2.getItemOrder())))
                .map(bookmark -> BookmarkOrderUpdateResponse.builder()
                        .bookmarkId(bookmark.getId())
                        .date(bookmark.getDate())
                        .placeId(bookmark.getPlaceId())
                        .placeImg(bookmark.getPlaceImg())
                        .placeName(bookmark.getPlaceName())
                        .placeAddr(bookmark.getPlaceAddr())
                        .itemOrder(bookmark.getItemOrder())
                        .receiptCnt(bookmark.getReceipts() != null ? bookmark.getReceipts().size() : 0)
                        .build())
                .collect(Collectors.toList());

        return responseList;
    }

    // 찜 목록에서 삭제
    @Transactional
    public List<BookmarkFindAllInJjinResponse> deleteBookmark(int teamId, int planId, int bookmarkId, String header) {

        teamMemberRepositorySupport.findMemberInTeamByEmail(teamId, jwtUtil.getAuthMemberEmail(header))
                .orElseThrow(() -> new MemberTeamNotFoundException("해당 팀에 소속되지 않은 회원입니다."));

        planRepository.findById(planId)
                .orElseThrow(()-> new PlanNotFoundException("해당 일정이 존재하지 않습니다."));

        Bookmark targetBookmark = bookmarkRepository.findById(bookmarkId)
                .orElseThrow(() -> new BookmarkNotFoundException("해당 북마크가 존재하지 않습니다."));

        if(targetBookmark.getDate() != null){
            throw new DeletionNotAllowedException("날짜가 지정된 장소는 삭제할 수 없습니다.(찜 목록에서만 가능)");
        }

        bookmarkRepository.delete(targetBookmark);

        // 해당 일정 찜 리스트
        List<Bookmark> bookmarkList = bookmarkRepositorySupport.findAllBookmarkByNullDateInSamePlan(planId);
        List<BookmarkFindAllInJjinResponse> responseList = bookmarkList.stream()
                .map(bookmark -> BookmarkFindAllInJjinResponse.builder()
                        .bookmarkId(bookmark.getId())
                        .date(bookmark.getDate())
                        .placeId(bookmark.getPlaceId())
                        .placeImg(bookmark.getPlaceImg())
                        .placeName(bookmark.getPlaceName())
                        .placeAddr(bookmark.getPlaceAddr())
                        .itemOrder(bookmark.getItemOrder())
                        .receiptCnt(bookmark.getReceipts() != null ? bookmark.getReceipts().size() : 0)
                        .build())
                .collect(Collectors.toList());

        return responseList;
    }

    // 장소 이미지 크롤링
    public List<String> getPlaceImgUrls(List<String> placeUrls) {

        List<String> response = new ArrayList<>();

        // 크롬 드라이버
        System.setProperty("webdriver.chrome.driver","C:\\ssafy\\togather\\chromedriver.exe");
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless"); // 브라우저 창을 띄우지 않는 헤드리스 모드
        options.addArguments("--disable-gpu"); // GPU 비활성화 (Windows에서 필요)
        options.addArguments("--window-size=1920,1080"); // 창 크기 설정 (옵션)
        options.addArguments("--disable-extensions"); // 확장 프로그램 비활성화
        options.addArguments("--no-sandbox"); // 샌드박스 비활성화
        options.addArguments("--disable-dev-shm-usage"); // 공유 메모리 비활성화
        options.addArguments("--disable-software-rasterizer"); // 소프트웨어 렌더링 비활성화
        WebDriver driver = new ChromeDriver(options);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            for(String placeUrl : placeUrls) {
                driver.get(placeUrl);

                // 요소가 클릭 가능할 때까지 기다리기
                WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id='mArticle']/div[1]/div[1]/div[1]/a")));
                element.click();

                // 이미지 나올 때까지 최대 10초 대기
                WebElement imageElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='photoViewer']/div[2]/div[1]/div[1]/img")));

                String imageUrl = imageElement.getAttribute("src");

                response.add(imageUrl);
            }
        } finally {
            driver.quit();
        }

        return response;

    }
}
