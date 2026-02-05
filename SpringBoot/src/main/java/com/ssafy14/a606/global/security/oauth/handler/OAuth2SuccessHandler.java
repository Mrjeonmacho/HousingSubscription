package com.ssafy14.a606.global.security.oauth.handler;

import com.ssafy14.a606.domain.auth.refresh.RefreshTokenStore;
import com.ssafy14.a606.domain.user.entity.User;
import com.ssafy14.a606.domain.user.repository.UserRepository;
import com.ssafy14.a606.global.security.jwt.JwtTokenProvider;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenStore refreshTokenStore;
    private final UserRepository userRepository;

    @Value("${app.frontend.redirect-url:http://localhost:3000/?oauth=success}")
    private String redirectUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        // 1) userId
        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        Object userIdObj = principal.getAttributes().get("userId");

        if (userIdObj == null) {
            log.error("OAuth2 login success but userId is missing in attributes");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "소셜 로그인 처리 중 오류가 발생했습니다.");
            return;
        }

        Long userId = toLong(userIdObj);

        // 2) role
        User user = userRepository.findById(userId)
                .orElseThrow(()->new IllegalStateException("사용자 정보를 찾을 수 없습니다."));

        String role = user.getRole().name();

        // 3) AT/RT 발급
        String accessToken = jwtTokenProvider.createAccessToken(userId, role);
        String refreshToken = jwtTokenProvider.createRefreshToken(userId);

        // 4) Redis 저장 (기존 RT 폐기)
        refreshTokenStore.save(userId, refreshToken);

        // 5) refreshToken 쿠키로
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(Duration.ofDays(14))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        log.info("OAuth2 login success. userId={}, authType={}, redirect={}",
                userId, user.getAuthType(), redirectUrl);

        // 6) Redirect
        response.sendRedirect(redirectUrl);
    }

    private Long toLong(Object value) {
        if (value instanceof Long l) return l;
        if (value instanceof Integer i) return i.longValue();
        if (value instanceof String s) return Long.parseLong(s);
        throw new IllegalArgumentException("userId 타입이 올바르지 않습니다. value=" + value);
    }
}

