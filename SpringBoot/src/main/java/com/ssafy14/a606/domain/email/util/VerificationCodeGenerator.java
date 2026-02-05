package com.ssafy14.a606.domain.email.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class VerificationCodeGenerator {

    // 인증코드 생성

    private static final SecureRandom RANDOM = new SecureRandom();

    public String generate6Digit() {
        int n = RANDOM.nextInt(900000) + 100000; // 100000 ~ 999999
        return String.valueOf(n);
    }

}
