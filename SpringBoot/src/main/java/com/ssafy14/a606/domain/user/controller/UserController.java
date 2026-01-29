package com.ssafy14.a606.domain.user.controller;

import com.ssafy14.a606.domain.user.dto.request.SignUpRequestDto;
import com.ssafy14.a606.domain.user.dto.request.UserDetailsRequestDto;
import com.ssafy14.a606.domain.user.dto.request.UserUpdateRequestDto;
import com.ssafy14.a606.domain.user.dto.response.SignUpResponseDto;
import com.ssafy14.a606.domain.user.dto.response.UserDetailsResponseDto;
import com.ssafy14.a606.domain.user.dto.response.UserResponseDto;
import com.ssafy14.a606.domain.user.service.UserDetailsService;
import com.ssafy14.a606.domain.user.service.UserService;
import com.ssafy14.a606.global.security.user.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserDetailsService userDetailsService;

    // 로컬 회원가입
    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDto> signUp(@Valid @RequestBody SignUpRequestDto request) {
        return ResponseEntity.ok(userService.signUpLocal(request));
    }

    // 아이디 & 이메일 중복검증API (회원가입 과정에서 사용)
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkDuplicate(
            @RequestParam String type,
            @RequestParam String value
    ) {
        return ResponseEntity.ok(userService.checkDuplicate(type, value));
    }

    // 추가정보 조회
    @GetMapping("/me/info")
    public ResponseEntity<UserDetailsResponseDto> getMyDetailInfo(
            @AuthenticationPrincipal CustomUserDetails principal
    ) {
        return ResponseEntity.ok(userDetailsService.getMyDetails(principal.getUserId()));
    }

    // 추가정보 입력
    @PostMapping("/me/info")
    public ResponseEntity<UserDetailsResponseDto> createDetailInfo(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestBody UserDetailsRequestDto dto
    ) {
        return ResponseEntity.ok(userDetailsService.createMyDetails(principal.getUserId(), dto));
    }

    // 추가정보 수정
    @PutMapping("/me/info")
    public ResponseEntity<UserDetailsResponseDto> updateDetailInfo(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestBody UserDetailsRequestDto dto
    ) {
        return ResponseEntity.ok(userDetailsService.updateMyDetails(principal.getUserId(), dto));
    }

    // 기본정보 조회
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getMyInfo(
            @AuthenticationPrincipal CustomUserDetails principal
    ) {
        Long userId = principal.getUserId();
        return ResponseEntity.ok(userService.getMyInfo(userId));
    }

    // 기본정보 수정
    @PatchMapping("/me")
    public ResponseEntity<UserResponseDto> updateMyInfo(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody UserUpdateRequestDto request
    ) {
        Long userId = principal.getUserId();
        return ResponseEntity.ok(userService.updateMyInfo(userId, request));
    }


}
