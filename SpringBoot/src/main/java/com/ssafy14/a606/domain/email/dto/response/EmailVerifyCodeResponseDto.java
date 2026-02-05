package com.ssafy14.a606.domain.email.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EmailVerifyCodeResponseDto {

    private boolean verified;
    private String message;

    public static EmailVerifyCodeResponseDto success() {
        return new EmailVerifyCodeResponseDto(true, "EMAIL_VERIFIED");
    }

    public static EmailVerifyCodeResponseDto invalidCode() {
        return new EmailVerifyCodeResponseDto(false, "INVALID_CODE");
    }
}
