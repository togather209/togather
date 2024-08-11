package com.common.togather.api.service;

import com.common.togather.api.error.MissingTokenException;
import com.common.togather.api.request.FCMTokenSaveRequest;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushNotification;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class FCMService {

    private final RedisService redisService;

    public void saveToken(String email, FCMTokenSaveRequest fcmTokenSaveRequest) {

        redisService.saveFCMToken(email, fcmTokenSaveRequest.getFCMToken());
    }

    @SneakyThrows
    public void pushNotification(String email, String title, String content) {
        String token = redisService.getFCMToken(email);
        if (token == null) {
            throw new MissingTokenException("fcm 토큰이 없습니다.");
        }
        Message message = Message.builder()
                .setToken(token)
                .setWebpushConfig(WebpushConfig.builder()
                        .setNotification(new WebpushNotification("title", content))
                        .build())
                .build();
        FirebaseMessaging.getInstance().sendAsync(message).get();
    }

}
