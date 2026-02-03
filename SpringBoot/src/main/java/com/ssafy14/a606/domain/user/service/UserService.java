package com.ssafy14.a606.domain.user.service;


import com.ssafy14.a606.domain.user.dto.request.SignUpRequestDto;
import com.ssafy14.a606.domain.user.dto.request.UserUpdateRequestDto;
import com.ssafy14.a606.domain.user.dto.response.SignUpResponseDto;
import com.ssafy14.a606.domain.user.dto.response.UserResponseDto;
import com.ssafy14.a606.global.security.user.CustomUserDetails;
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

    // 5. 회원 기본정보 조회
    UserResponseDto getMyInfo(Long userId);

    // 6. 회원 기본정보 수정 (이름, 이메일만 가능)
    UserResponseDto updateMyInfo(Long userId, UserUpdateRequestDto request);

    // 7. 회원탈퇴 (hard delete)
    void deleteAccount(Long userId, HttpServletResponse response);

    // 8. 비밀번호 검증
    void confirmPassword(Long userId, String rawPassword);
}
