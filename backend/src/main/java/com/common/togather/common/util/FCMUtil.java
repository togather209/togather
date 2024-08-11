package com.common.togather.common.util;

import com.common.togather.api.error.MissingTokenException;
import com.common.togather.api.service.RedisService;
import com.google.firebase.messaging.*;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FCMUtil {

    private final RedisService redisService;

    public void saveToken(String email, String token) {
        redisService.saveFCMToken(email, token);
    }

    @Async
    @Retryable(
            value = FirebaseMessagingException.class, // 재시도할 예외 타입
            maxAttempts = 3, // 최대 재시도 횟수
            backoff = @Backoff(delay = 1000, multiplier = 2) // 초기 대기 시간 1초, 지수적 증가
    )
    @SneakyThrows
    public void pushNotification(String email, String title, String content) {
        String token = redisService.getFCMToken(email);
        if (token == null) {
            throw new MissingTokenException("fcm 토큰이 없습니다.");
        }
        Message message = Message.builder()
                .setToken(token)
                .setWebpushConfig(WebpushConfig.builder()
                        .setNotification(new WebpushNotification(title, content, null))
                        .build())
                .build();
        FirebaseMessaging.getInstance().sendAsync(message).get();
    }
}
