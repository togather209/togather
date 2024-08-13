package com.common.togather.api.service;

import com.common.togather.api.error.UpdateNotAllwedException;
import com.common.togather.api.request.BookmarkSaveRequest;
import com.common.togather.common.websocket.message.DateUpdateRequestMessage;
import com.common.togather.common.websocket.message.OneBookmarkMessage;
import com.common.togather.db.entity.Bookmark;
import com.common.togather.db.repository.BookmarkRepository;
import com.common.togather.db.repository.BookmarkRepositorySupport;
import com.common.togather.db.repository.PlanRepository;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class BookmarkWebSocketService {

    private final PlanRepository planRepository;
    private final BookmarkRepository bookmarkRepository;
    private final BookmarkRepositorySupport bookmarkRepositorySupport;

    public BookmarkWebSocketService(PlanRepository planRepository, BookmarkRepository bookmarkRepository, BookmarkRepositorySupport bookmarkRepositorySupport) {
        this.planRepository = planRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.bookmarkRepositorySupport = bookmarkRepositorySupport;
    }

    // 찜 등록
    public OneBookmarkMessage addBookmark(int planId, BookmarkSaveRequest request) {
        // 이미 등록된 장소는 아닌지
        if(bookmarkRepositorySupport.existsSamePlaceInSamePlan(planId, request.getPlaceId())){
            throw new RuntimeException("이미 찜한 장소입니다.");
        }

        Bookmark bookmark = Bookmark.builder()
                .plan(planRepository.findById(planId).get())
                .placeId(request.getPlaceId())
                .placeImg(request.getPlaceImg())
                .placeName(request.getPlaceName())
                .placeAddr(request.getPlaceAddr())
                .itemOrder(0)
                .date(null)
                .build();
        bookmarkRepository.save(bookmark);
        
        // 새로 등록된 북마크 정보 반환
        return OneBookmarkMessage.builder()
                .bookmarkId(bookmark.getId())
                .date(bookmark.getDate())
                .placeId(bookmark.getPlaceId())
                .placeImg(bookmark.getPlaceImg())
                .placeName(bookmark.getPlaceName())
                .placeAddr(bookmark.getPlaceAddr())
                .itemOrder(bookmark.getItemOrder())
                .receiptCnt(bookmark.getReceipts() != null ? bookmark.getReceipts().size() : 0)
                .build();

    }

    // 찜 리스트에서 삭제
    public void deleteBookmark(int planId, int bookmarkId) {
        Bookmark bookmark = bookmarkRepository.findById(bookmarkId).get();
        bookmarkRepository.delete(bookmark);
    }

    // 날짜 수정
    public void updateDate(int planId, DateUpdateRequestMessage dateUpdateRequestMessage) {

        int bookmarkId = dateUpdateRequestMessage.getBookmarkId();
        LocalDate newDate = dateUpdateRequestMessage.getNewDate();
        LocalDate oldDate = bookmarkRepository.findById(bookmarkId).get().getDate();



    }

    @MessageExceptionHandler
    @SendToUser("/queue/errors")
    public String handleException(RuntimeException ex) {
        return ex.getMessage();
    }

}
