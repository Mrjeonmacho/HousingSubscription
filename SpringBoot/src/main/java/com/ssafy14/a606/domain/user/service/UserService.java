package com.ssafy14.a606.domain.user.service;


import com.ssafy14.a606.domain.user.dto.request.SignInRequestDto;
import com.ssafy14.a606.domain.user.dto.request.SignUpRequestDto;
import com.ssafy14.a606.domain.user.dto.response.SignInResponseDto;
import com.ssafy14.a606.domain.user.dto.response.SignUpResponseDto;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

public interface UserService {

    // 1. 로컬 회원가입
    SignUpResponseDto signUpLocal(SignUpRequestDto request);

    // 2. 아이디 중복 여부 확인
    boolean isAvailableLoginId(String loginId);

    // 3. 이메일 중복 여부 확인
    boolean isAvailableEmail(String email);

    // 4. 중복 확인
    Map<String, Object> checkDuplicate(String type, String value);

    // 5. 로컬 로그인
    SignInResponseDto signInLocal(SignInRequestDto request, HttpServletResponse response);
}
