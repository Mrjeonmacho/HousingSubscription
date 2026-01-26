package com.ssafy14.a606.domain.user.service;


import com.ssafy14.a606.domain.user.dto.request.SignUpRequestDto;
import com.ssafy14.a606.domain.user.dto.response.SignUpResponseDto;

import java.util.Map;

public interface UserService {

    // 로컬 회원가입
    SignUpResponseDto signUpLocal(SignUpRequestDto request);

    // 아이디 중복 여부 확인
    boolean isAvailableLoginId(String loginId);

    // 이메일 중복 여부 확인
    boolean isAvailableEmail(String email);

    // 중복 확인
    Map<String, Object> checkDuplicate(String type, String value);
}
