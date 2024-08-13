package com.common.togather.common.util;

import com.common.togather.db.entity.FCMToken;
import com.common.togather.db.entity.Member;
import com.common.togather.db.repository.FCMTokenRepository;
import com.google.firebase.messaging.*;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class FCMUtil {

    private final FCMTokenRepository fcmTokenRepository;

    @Transactional
    public void saveToken(Member member, String token) {
        if (member.getFcmToken() != null) {
            updateToken(member, token);
            return;
        }

        if (token == null || token.isBlank()) {
            log.info("fcm 토큰이 비어 있습니다.");
            return;
        }

        fcmTokenRepository.save(FCMToken.builder()
                .member(member)
                .token(token)
                .build());
    }

    private void updateToken(Member member, String token) {
        member.getFcmToken().updateToken(token);
    }

    @Async
    @Retryable(
            value = FirebaseMessagingException.class, // 재시도할 예외 타입
            maxAttempts = 3, // 최대 재시도 횟수
            backoff = @Backoff(delay = 1000, multiplier = 2) // 초기 대기 시간 1초, 지수적 증가
    )
    @SneakyThrows
    public void pushNotification(FCMToken token, String title, String content) {

        if (token == null) {
            log.info("fcm 토큰이 비어 있습니다.");
            return;
        }

        Message message = Message.builder()
                .setToken(token.getToken())
                .setWebpushConfig(WebpushConfig.builder()
                        .setNotification(new WebpushNotification(title, content, null))
                        .build())
                .build();
        FirebaseMessaging.getInstance().sendAsync(message).get();
    }
}
