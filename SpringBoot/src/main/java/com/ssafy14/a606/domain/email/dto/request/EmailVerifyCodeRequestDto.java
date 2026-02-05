package com.ssafy14.a606.domain.email.dto.request;

import lombok.Getter;

@Getter
public class EmailVerifyCodeRequestDto {

    private String email;
    private String code;

}
