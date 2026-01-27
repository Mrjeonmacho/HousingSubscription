package com.ssafy14.a606.domain.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokenReissueResponseDto {

    // 재발급된 accessToken
    private String accessToken;
}
