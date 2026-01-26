package com.ssafy14.a606.domain.user.controller;

import com.ssafy14.a606.domain.user.dto.request.SignUpRequestDto;
import com.ssafy14.a606.domain.user.dto.response.SignUpResponseDto;
import com.ssafy14.a606.domain.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

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

}
