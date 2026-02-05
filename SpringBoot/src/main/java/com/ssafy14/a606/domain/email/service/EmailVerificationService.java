package com.ssafy14.a606.domain.email.service;

import com.ssafy14.a606.domain.email.dto.response.EmailSendCodeResponseDto;
import com.ssafy14.a606.domain.email.dto.response.EmailVerifyCodeResponseDto;

public interface EmailVerificationService {

    // 이메일 인증코드 발송
    EmailSendCodeResponseDto sendSignUpCode(String email);

    // 이메일 인증코드 검증
    EmailVerifyCodeResponseDto verifyCode(String email, String code);

    // 이메일 인증 완료 상태 조회
    boolean isVerified(String email);

}
