package com.ssafy14.a606.domain.user.controller;

import com.ssafy14.a606.domain.user.dto.request.SignInRequestDto;
import com.ssafy14.a606.domain.user.dto.request.SignUpRequestDto;
import com.ssafy14.a606.domain.user.dto.response.SignInResponseDto;
import com.ssafy14.a606.domain.user.dto.response.SignUpResponseDto;
import com.ssafy14.a606.domain.user.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    // 로컬 로그인
    @PostMapping("/login")
    public ResponseEntity<SignInResponseDto> signInLocal(
            @Valid @RequestBody SignInRequestDto request,
            HttpServletResponse response
    ) {
        SignInResponseDto result = userService.signInLocal(request, response);
        return ResponseEntity.ok(result);
    }
}
