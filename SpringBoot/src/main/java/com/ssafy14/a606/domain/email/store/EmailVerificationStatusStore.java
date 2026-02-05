package com.ssafy14.a606.domain.email.store;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class EmailVerificationStatusStore {

    // 이메일 인증 완료 상태를 Redis에 저장

    private static final String VERIFIED_PREFIX = "email:verify:verified:";

    private final StringRedisTemplate redisTemplate;

    private String verifiedKey(String email) {
        return VERIFIED_PREFIX + email;
    }

    // 인증 완료 마킹
    public void markVerified(String email, Duration ttl) {
        redisTemplate.opsForValue().set(verifiedKey(email), "true", ttl);
    }

    // 인증 완료 여부 확인
    public boolean isVerified(String email) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(verifiedKey(email)));
    }

    // 인증 완료 상태 삭제
    public void deleteVerified(String email) {
        redisTemplate.delete(verifiedKey(email));
    }
}
