package com.common.togather.api.controller;

import com.common.togather.db.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
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
@RequiredArgsConstructor
public class SseController {

    private final Map<String, Map<String, SseEmitter>> teamClients = new ConcurrentHashMap<>();
    private final MemberRepository memberRepository;

    @GetMapping("/subscribe/{planId}/{email}")
    public SseEmitter subscribe(@PathVariable("planId") int planId, @PathVariable("email") String email) {
        System.out.println("email : " + email);
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        String planKey = String.valueOf(planId);
        String clientId = String.valueOf(memberRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Member not found")).getId());

        Map<String, SseEmitter> clientEmitters = teamClients.computeIfAbsent(planKey, k -> new ConcurrentHashMap<>());
        SseEmitter existingEmitter = clientEmitters.get(clientId);

        if (existingEmitter != null) {
            System.out.println("Already connected: " + clientId);
            existingEmitter.complete(); // 기존 연결 종료
            try {
                // 연결 종료를 기다림
                Thread.sleep(100); // 짧은 지연 시간을 둬서 기존 연결이 완전히 종료되도록 함
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        // 새로운 연결을 저장
        clientEmitters.put(clientId, emitter);

        emitter.onCompletion(() -> {
            System.out.println("SSE Connection Completed for client: " + clientId);
            clientEmitters.remove(clientId);
        });

        emitter.onTimeout(() -> {
            System.out.println("SSE Connection Timeout for client: " + clientId);
            clientEmitters.remove(clientId);
        });

        emitter.onError((e) -> {
            System.out.println("SSE Connection Error for client: " + clientId + " Error: " + e.getMessage());
            clientEmitters.remove(clientId);
        });

        return emitter;
    }

    @Async
    public void notifyClients(int planId, String eventName, Object data) {
        String planKey = String.valueOf(planId);
        Map<String, SseEmitter> clientsForPlan = teamClients.get(planKey);

        if (clientsForPlan != null) {
            for (SseEmitter emitter : clientsForPlan.values()) {
                System.out.println(clientsForPlan.values().size() + " count");
                try {
                    emitter.send(SseEmitter.event()
                            .name(eventName)
                            .data(data));
                } catch (IOException e) {
                    System.out.println("Error sending SSE event to client: " + e.getMessage());
                    clientsForPlan.remove(emitter);
                }
            }
        }
    }
}
