package com.ssafy14.a606.domain.email.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EmailSendCodeResponseDto {
    private String message;
}
