package com.common.togather.common.websocket;

import com.common.togather.common.websocket.error.WebSocketErrorResponse;
import com.common.togather.common.websocket.exception.PlaceConflictException;
import com.common.togather.common.websocket.exception.UpdateNotAllowedException;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.SendTo;

public class WebSocketExceptionHandler {

    // 이미 찜한 장소를 찜할 때
    @MessageExceptionHandler(PlaceConflictException.class)
    @SendTo("/queue/errors")
    public WebSocketErrorResponse handlePlaceConflictException(PlaceConflictException e) {
        return new WebSocketErrorResponse(e.getMessage());
    }

    // 업데이트가 불가한 상황일때
    @MessageExceptionHandler(UpdateNotAllowedException.class)
    @SendTo("/queue/errors")
    public WebSocketErrorResponse handleUpdateNotAllowedException(UpdateNotAllowedException e) {
        return new WebSocketErrorResponse(e.getMessage());
    }

}
