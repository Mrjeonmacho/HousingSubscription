package com.ssafy14.a606.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserResponseDto {
    private Long userId;
    private String authType;
    private String loginId;
    private String userName;
    private String email;
}
