package com.common.togather.api.service;

import com.common.togather.api.error.UpdateNotAllwedException;
import com.common.togather.api.request.BookmarkSaveRequest;
import com.common.togather.common.websocket.exception.PlaceConflictException;
import com.common.togather.common.websocket.exception.UpdateNotAllowedException;
import com.common.togather.common.websocket.message.*;
import com.common.togather.db.entity.Bookmark;
import com.common.togather.db.entity.Plan;
import com.common.togather.db.repository.BookmarkRepository;
import com.common.togather.db.repository.BookmarkRepositorySupport;
import com.common.togather.db.repository.PlanRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkWebSocketService {

    private final PlanRepository planRepository;
    private final BookmarkRepository bookmarkRepository;
    private final BookmarkRepositorySupport bookmarkRepositorySupport;

    // 찜 등록
    @Transactional
    public OneBookmarkMessage addBookmark(int planId, BookmarkSaveRequest request) {
        // 이미 등록된 장소는 아닌지
        if(bookmarkRepositorySupport.existsSamePlaceInSamePlan(planId, request.getPlaceId())){
            throw new PlaceConflictException("이미 찜한 장소입니다.");
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
    @Transactional
    public void deleteBookmark(int planId, int bookmarkId) {
        Bookmark bookmark = bookmarkRepository.findById(bookmarkId).get();
        bookmarkRepository.delete(bookmark);
    }

    // 날짜 수정
    @Transactional
    public DateUpdateResponseMessage updateDate(int planId, DateUpdateRequestMessage dateUpdateRequestMessage) {

        int bookmarkId = dateUpdateRequestMessage.getBookmarkId();
        LocalDate newDate = dateUpdateRequestMessage.getNewDate();
        LocalDate oldDate = bookmarkRepository.findById(bookmarkId).get().getDate();
        Bookmark bookmark = bookmarkRepository.findById(bookmarkId).get();
        Plan plan = planRepository.findById(planId).get();

        // 일정 날짜 범위를 벗어나면 안됨
        if(newDate != null){
            if( !((newDate.isBefore(plan.getEndDate()) || newDate.isEqual(plan.getEndDate())) &&
                    (newDate.isAfter(plan.getStartDate())|| newDate.isEqual(plan.getStartDate()))))  {
                throw new UpdateNotAllowedException("가능한 날짜 범위를 벗어났습니다.");
            }
        }

        // 날짜 정보가 있던 장소가 찜으로 이동하는 경우
        if (oldDate != null && newDate == null) {
            // 영수증 등록된 장소는 찜으로 이동 불가능
            if(!bookmark.getReceipts().isEmpty()){
                throw new UpdateNotAllwedException("영수증이 등록된 장소는 찜목록으로 이동할 수 없습니다.");
            }

            int oldOrder = bookmark.getItemOrder();
            // 날짜와 순서 모두 null로 변경
            bookmark.moveToJjim();
            bookmarkRepository.save(bookmark);

            // 수정된 요소와 같은 날짜에 있던 요소들 순서 바꿔주기
            List<Bookmark> oldBookmarkList = bookmarkRepository.findAllByDate(oldDate);
            for(Bookmark b : oldBookmarkList){
                // 수정된 요소가 가지고 있던 순서보다 더 뒷 순서면 -1
                if(b.getItemOrder() > oldOrder){
                    b.updateOrder(b.getItemOrder() - 1);
                }
            }
            bookmarkRepository.save(bookmark); // 변경사항 저장
        }

        // 찜에 있던 장소에 날짜를 지정해준 경우, 날짜 변경하고 순서는 그 날짜의 가장 마지막으로 설정
        else if (oldDate == null && newDate != null) {
            bookmark.updateDate(newDate, bookmarkRepositorySupport.findAllBookmarkByDateInSamePlan(planId, newDate).size());
            bookmarkRepository.save(bookmark);
        }

        // 날짜 정보가 있던 장소를 다른 날짜로 이동하는 경우 양쪽 모두 순서 재정렬
        else {
            int oldOrder = bookmark.getItemOrder();
            bookmark.updateDate(newDate, bookmarkRepository.findAllByDate(newDate).size());
            bookmarkRepository.save(bookmark);

            // 수정된 요소와 같은 날짜에 있던 요소들 순서 바꿔주기
            List<Bookmark> oldBookmarkList = bookmarkRepository.findAllByDate(oldDate);
            for(Bookmark b : oldBookmarkList){
                // 수정된 요소가 가지고 있던 순서보다 더 뒷 순서면 -1
                if(b.getItemOrder() > oldOrder){
                    b.updateOrder(b.getItemOrder() - 1);
                }
            }
            bookmarkRepository.save(bookmark); // 변경사항 저장
        }

        //// 양쪽 북마크 모두 변경 후

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

        List<OneBookmarkMessage> oldDateResponseList = oldDateBookmarkList.stream()
                .sorted(((o1, o2) -> Integer.compare(o1.getItemOrder(), o2.getItemOrder())))
                .map(b -> OneBookmarkMessage.builder()
                        .bookmarkId(b.getId())
                        .date(b.getDate())
                        .placeId(b.getPlaceId())
                        .placeImg(b.getPlaceImg())
                        .placeName(b.getPlaceName())
                        .placeAddr(b.getPlaceAddr())
                        .itemOrder(b.getItemOrder())
                        .receiptCnt(b.getReceipts() != null ? b.getReceipts().size() : 0)
                        .build())
                .collect(Collectors.toList());

        List<OneBookmarkMessage> newDateResponseList = newDateBookmarkList.stream()
        .sorted(((o1, o2) -> Integer.compare(o1.getItemOrder(), o2.getItemOrder())))
        .map(b -> OneBookmarkMessage.builder()
                .bookmarkId(b.getId())
                .date(b.getDate())
                .placeId(b.getPlaceId())
                .placeImg(b.getPlaceImg())
                .placeName(b.getPlaceName())
                .placeAddr(b.getPlaceAddr())
                .itemOrder(b.getItemOrder())
                .receiptCnt(b.getReceipts() != null ? b.getReceipts().size() : 0)
                .build())
        .collect(Collectors.toList());

        return DateUpdateResponseMessage.builder()
                .oldDate(oldDate)
                .oldDateList(oldDateResponseList)
                .newDate(newDate)
                .newDateList(newDateResponseList)
                .build();

    }

    // 순서 변경
    @Transactional
    public OrderUpdateResponseMessage updateOrder(int planId, OrderUpdateRequestMessage orderUpdateRequestMessage) {

        Bookmark bookmark = bookmarkRepository.findById(orderUpdateRequestMessage.getBookmarkId()).orElse(null);
        int oldOrder = bookmark.getItemOrder();
        int newOrder = orderUpdateRequestMessage.getNewOrder();

        // 순서 이동이 있었을 때만
        if(oldOrder != newOrder) {

            // 바꾼 요소의 순서를 수정
            bookmark.updateOrder(newOrder);
            bookmarkRepository.save(bookmark);

            // 바꾼 요소와 같은 날짜인 북마크 모두 조회
            List<Bookmark> bookmarkList = bookmarkRepositorySupport.findAllBookmarkByDateInSamePlan(planId, bookmark.getDate());

            for(Bookmark b : bookmarkList) {
                // 변경한 요소가 아닌 다른 요소들 중에서만 판단
                if(b.getId() != bookmark.getId()) {
                    // 새 순서가 이전 순서보다 작아졌다면, 새 순서 이상이면서 이전 순서보다 작은 요소들을 +1
                    if(newOrder < oldOrder && b.getItemOrder() >= newOrder && b.getItemOrder() < oldOrder) {
                        b.updateOrder(b.getItemOrder()+1);
                    }
                    // 새 순서가 이전 순서보다 커졌다면, 새 순서 이하면서 이전 순서보다 큰 요소들을 -1
                    else if(newOrder > oldOrder && b.getItemOrder() <= newOrder && b.getItemOrder() > oldOrder) {
                        b.updateOrder(b.getItemOrder()-1);
                    }
                    bookmarkRepository.save(b);
                }
            }

        }

        List<Bookmark> updateList = bookmarkRepositorySupport.findAllBookmarkByDateInSamePlan(planId, bookmark.getDate());
        List<OneBookmarkMessage> responseList = updateList.stream()
                .sorted(((o1, o2) -> Integer.compare(o1.getItemOrder(), o2.getItemOrder())))
                .map(b -> OneBookmarkMessage.builder()
                        .bookmarkId(b.getId())
                        .date(b.getDate())
                        .placeId(b.getPlaceId())
                        .placeImg(b.getPlaceImg())
                        .placeName(b.getPlaceName())
                        .placeAddr(b.getPlaceAddr())
                        .itemOrder(b.getItemOrder())
                        .receiptCnt(b.getReceipts() != null ? b.getReceipts().size() : 0)
                        .build())
                .collect(Collectors.toList());

        return OrderUpdateResponseMessage.builder()
                .date(bookmark.getDate())
                .newOrderList(responseList)
                .build();
    }
}
