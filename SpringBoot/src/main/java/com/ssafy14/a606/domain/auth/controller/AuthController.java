package com.ssafy14.a606.domain.auth.controller;

import com.ssafy14.a606.domain.auth.dto.request.SignInRequestDto;
import com.ssafy14.a606.domain.auth.dto.response.TokenReissueResponseDto;
import com.ssafy14.a606.domain.auth.dto.response.SignInResponseDto;
import com.ssafy14.a606.domain.auth.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // 로컬 로그인
    @PostMapping("/login")
    public ResponseEntity<SignInResponseDto> signInLocal(
             @Valid @RequestBody SignInRequestDto request,
            HttpServletResponse response
    ) {
        SignInResponseDto result = authService.signInLocal(request, response);
        return ResponseEntity.ok(result);
    }

    // 토큰 재발급
    @PostMapping("/refresh")
    public TokenReissueResponseDto refresh(
            @CookieValue(value = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response
    ) {
        return authService.reissueToken(refreshToken, response);
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            Authentication authentication,
            HttpServletResponse response
    ) {
        String loginId = authentication.getName();
        authService.logout(loginId, response);
        return ResponseEntity.ok(Map.of("message", "LOGOUT_SUCCESS"));
    }

}
