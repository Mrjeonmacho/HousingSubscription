package com.ssafy14.a606.domain.auth.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FindIdResponseDto {

    private String loginId;
    private String message;

}
