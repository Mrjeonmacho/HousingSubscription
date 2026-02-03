package com.ssafy14.a606.domain.auth.controller;

import com.ssafy14.a606.domain.auth.dto.request.SignInRequestDto;
import com.ssafy14.a606.domain.auth.dto.response.TokenReissueResponseDto;
import com.ssafy14.a606.domain.auth.dto.response.SignInResponseDto;
import com.ssafy14.a606.domain.auth.service.AuthService;
import com.ssafy14.a606.global.exceptions.InvalidValueException;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
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

    // 소셜로그인
    @GetMapping("/{provider}")
    public void redirectToProvider(
            @PathVariable String provider,
            HttpServletResponse response
    ) throws IOException{

        String p = provider.toLowerCase();

        // 구글 & 카카오만
        if (!p.equals("google") && !p.equals("kakao")) {
            throw new InvalidValueException("지원하지 않는 소셜 로그인입니다.");
        }

        String redirect = "/oauth2/authorization/" + p;

        log.info("OAuth redirect: /api/auth/{} -> {}", p, redirect);

        try {
            response.sendRedirect(redirect);
        } catch (IOException | java.io.IOException e){
            throw new RuntimeException("리다이렉트 처리 중 오류가 발생했습니다.");
        }
    }



}
