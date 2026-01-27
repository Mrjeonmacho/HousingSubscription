package com.ssafy14.a606.domain.auth.controller;

import com.ssafy14.a606.domain.auth.dto.request.SignInRequestDto;
import com.ssafy14.a606.domain.auth.dto.response.TokenReissueResponseDto;
import com.ssafy14.a606.domain.user.dto.request.SignUpRequestDto;
import com.ssafy14.a606.domain.auth.dto.response.SignInResponseDto;
import com.ssafy14.a606.domain.user.dto.response.SignUpResponseDto;
import com.ssafy14.a606.domain.auth.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

}
