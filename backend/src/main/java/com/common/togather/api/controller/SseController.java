package com.common.togather.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/sse")
public class SseController {

    private final Map<String, SseEmitter> clients = new ConcurrentHashMap<>();

    // SSE 연결
    @GetMapping("/subscribe/{teamId}")
    public SseEmitter subscribe(@PathVariable("teamId") int teamId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        String clientId = String.valueOf(teamId);
        clients.put(clientId, emitter);

        emitter.onCompletion(() -> clients.remove(clientId));
        emitter.onTimeout(() -> clients.remove(clientId));

        return emitter;
    }

    // 클라이언트에게 요청
    public void notifyClients(int teamId, String eventName, Object data) {
        String clientId = String.valueOf(teamId);
        SseEmitter emitter = clients.get(clientId);

        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(data));
            } catch (IOException e) {
                clients.remove(clientId);
            }
        }
    }
}
