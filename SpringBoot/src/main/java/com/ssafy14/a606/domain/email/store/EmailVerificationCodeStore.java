package com.ssafy14.a606.domain.email.store;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class EmailVerificationCodeStore {

    // Redis에 저장하는거임
    private static final String CODE_PREFIX = "email:verify:code:";

    private final StringRedisTemplate redisTemplate;

    private String codeKey(String email) {
        return CODE_PREFIX + email;
    }

    public void saveCode(String email, String code, Duration ttl) {
        redisTemplate.opsForValue().set(codeKey(email), code, ttl);
    }

    public String getCode(String email) {
        return redisTemplate.opsForValue().get(codeKey(email));
    }

    public void deleteCode(String email) {
        redisTemplate.delete(codeKey(email));
    }

}
