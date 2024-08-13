package com.common.togather.common.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashSet;
import java.util.Set;

public class BookmarkWebSocketHandler extends TextWebSocketHandler {

    // 현재 연결된 모든 webSocket 세션을 관리하기 위한 Set
    private static Set<WebSocketSession> sessions = new HashSet<WebSocketSession>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // 클라이언트가 연결되면 세션 추가
        sessions.add(session);
        System.out.println("New WebSocket connection established with session: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // 수신된 메시지를 로그로 출력
        String payload = message.getPayload();
        System.out.println("Received message from session " + session.getId() + ": " + payload);

        // 받은 메시지를 모든 클라이언트에게 브로드캐스트
        for(WebSocketSession webSocketSession : sessions) {
            webSocketSession.sendMessage(new TextMessage(payload));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // 클라이언트가 연결을 종료하면 세션 제거
        sessions.remove(session);
        System.out.println("WebSocket connection closed with session: " + session.getId());
    }

    // 특정 메시지를 모든 클라이언트에게 전송하는 메소드
    public void broadcastMessage(String message) {
        for(WebSocketSession session : sessions) {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}
