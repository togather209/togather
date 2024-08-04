package com.common.togather.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String EMAIL_VERIFICATION_PREFIX = "email_verification_code:";
    private static final String REFRESH_TOKEN_PREFIX = "refresh_token:";
    private static final String BLACKLIST_PREFIX = "blacklist:";

    public void saveEmailVerificationCode(String email, String code) {
        redisTemplate.opsForValue().set(EMAIL_VERIFICATION_PREFIX + email, code);
        redisTemplate.expire(EMAIL_VERIFICATION_PREFIX + email, 5, TimeUnit.MINUTES);
    }

    public String getEmailVerificationCode(String email) {
        return (String) redisTemplate.opsForValue().get(EMAIL_VERIFICATION_PREFIX + email);
    }

    public void saveRefreshToken(String email, String refreshToken) {
        redisTemplate.opsForValue().set(REFRESH_TOKEN_PREFIX + email, refreshToken);
    }

    public void updateRefreshToken(String email, String refreshToken) {
        redisTemplate.opsForValue().set(REFRESH_TOKEN_PREFIX + email, refreshToken);
    }

    public String getRefreshToken(String email) {
        return (String) redisTemplate.opsForValue().get(REFRESH_TOKEN_PREFIX + email);
    }

    public void deleteRefreshToken(String email) {
        redisTemplate.delete(REFRESH_TOKEN_PREFIX + email);
    }

    public void blacklistAccessToken(String accessToken, long expirationTime) {
        redisTemplate.opsForValue().set(BLACKLIST_PREFIX + accessToken, "true", expirationTime, TimeUnit.MILLISECONDS);
    }

    public boolean isTokenBlacklisted(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(BLACKLIST_PREFIX + token));
    }
}
