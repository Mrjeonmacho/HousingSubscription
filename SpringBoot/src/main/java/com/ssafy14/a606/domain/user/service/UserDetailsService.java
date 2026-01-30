package com.ssafy14.a606.domain.user.service;

import com.ssafy14.a606.domain.user.dto.request.UserDetailsRequestDto;
import com.ssafy14.a606.domain.user.dto.response.UserDetailsResponseDto;

public interface UserDetailsService {

    // 추가정보 조회
    UserDetailsResponseDto getMyDetails(Long userId);

    // 추가정보 수정
    UserDetailsResponseDto updateMyDetails(Long userId, UserDetailsRequestDto requestDto);
}
