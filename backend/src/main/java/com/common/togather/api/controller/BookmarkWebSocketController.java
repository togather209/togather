package com.common.togather.api.controller;

import com.common.togather.api.request.BookmarkSaveRequest;
import com.common.togather.common.websocket.message.DateUpdateRequestMessage;
import com.common.togather.common.websocket.message.DateUpdateResponseMessage;
import com.common.togather.common.websocket.message.OneBookmarkMessage;
import com.common.togather.api.service.BookmarkWebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class BookmarkWebSocketController {

    private final BookmarkWebSocketService bookmarkWebSocketService;

    // 찜 리스트에 등록하기 -> 등록된 북마크 정보 전송 (가장 상단에 삽입)
    @MessageMapping("/{planId}/bookmark/register")
    @SendTo("/topic/plan/{planId}")
    public OneBookmarkMessage register(@DestinationVariable int planId, BookmarkSaveRequest bookmarkSaveRequest) {
        return bookmarkWebSocketService.addBookmark(planId, bookmarkSaveRequest);
    }

    // 찜 리스트에서 삭제하기 -> 삭제된 북마크 아이디 전송
    @MessageMapping("/{planId}/bookmark/delete")
    @SendTo("/topic/plan/{planId}")
    public int delete(@DestinationVariable int planId, int bookmarkId) {
        bookmarkWebSocketService.deleteBookmark(planId, bookmarkId);
        return bookmarkId;
    }

    // 날짜 정보 변경
    @MessageMapping("/{planId}/bookmark/date")
    @SendTo("/topic/plan/{planId}")
    public DateUpdateResponseMessage date(@DestinationVariable int planId, DateUpdateRequestMessage dateUpdateRequestMessage) {
        bookmarkWebSocketService.updateDate(planId, dateUpdateRequestMessage);

    }

}
