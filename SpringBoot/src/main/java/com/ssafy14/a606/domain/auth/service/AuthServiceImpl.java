package com.ssafy14.a606.domain.auth.service;

import com.ssafy14.a606.domain.auth.dto.request.SignInRequestDto;
import com.ssafy14.a606.domain.auth.dto.response.SignInResponseDto;
import com.ssafy14.a606.domain.auth.dto.response.TokenReissueResponseDto;
import com.ssafy14.a606.domain.auth.refresh.RefreshTokenStore;
import com.ssafy14.a606.domain.user.entity.AuthType;
import com.ssafy14.a606.domain.user.entity.User;
import com.ssafy14.a606.domain.user.repository.UserRepository;
import com.ssafy14.a606.global.exceptions.AuthorizationException;
import com.ssafy14.a606.global.security.jwt.JwtTokenProvider;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenStore refreshTokenStore;

    // 로컬 로그인
    @Override
    public SignInResponseDto signInLocal(SignInRequestDto request, HttpServletResponse response) {

        User user = userRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new AuthorizationException("아이디 또는 비밀번호가 올바르지 않습니다."));
        if (user.getAuthType() != AuthType.LOCAL) {
            throw new AuthorizationException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthorizationException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        Long userId = user.getId();
        String role = user.getRole().name(); // enum이면 name()

        String accessToken = jwtTokenProvider.createAccessToken(userId, role);
        String refreshToken = jwtTokenProvider.createRefreshToken(userId);

        String userRole = "ROLE_" + user.getRole().name();

        // refreshToken -> HttpOnly 쿠키
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)      // 로컬 http 테스트: false / 운영 https: true
                .sameSite("None")    // 운영에서 프론트-백 도메인 다르면 None 고려
                .path("/")
                .maxAge(Duration.ofDays(14))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        refreshTokenStore.save(user.getId(), refreshToken);

        return new SignInResponseDto(accessToken, refreshToken, user.getUserName(), userRole);
    }

    // 토큰 재발급
    @Transactional
    @Override
    public TokenReissueResponseDto reissueToken(String refreshToken, HttpServletResponse response) {

        // 1) 쿠키 유무 확인
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new AuthorizationException("RefreshToken이 없습니다.");
        }

        // 2) + 3) 만료/유효하지 않음 분기 + userId 추출
        final Long userId;
        try {
            userId = jwtTokenProvider.getUserId(refreshToken);
        } catch (ExpiredJwtException e) {
            throw new AuthorizationException("RefreshToken이 만료되었습니다.");
        } catch (JwtException | IllegalArgumentException e) {
            throw new AuthorizationException("RefreshToken이 유효하지 않습니다.");
        }

        // 4) loginId로 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthorizationException("사용자 정보를 찾을 수 없습니다."));

        String role = user.getRole().name();

        // 5) Redis 저장값과 일치 확인 (rotation 검증)
        if (!refreshTokenStore.matches(userId, refreshToken)) {
            throw new AuthorizationException("RefreshToken이 만료되었거나 유효하지 않습니다.");
        }

        // 6) 새 access/refresh 발급
        String newAccessToken = jwtTokenProvider.createAccessToken(userId, role);
        String newRefreshToken = jwtTokenProvider.createRefreshToken(userId);

        // 7) Redis 덮어쓰기 (기존 refresh 폐기)
        refreshTokenStore.save(userId, newRefreshToken);

        // 8) refreshToken 쿠키 교체
        ResponseCookie cookie = ResponseCookie.from("refreshToken", newRefreshToken)
                .httpOnly(true)
                .secure(true)      // 운영 https: true
                .sameSite("None")    // 운영에서 프론트-백 도메인 분리면 None 고려
                .path("/")
                .maxAge(Duration.ofDays(14))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return new TokenReissueResponseDto(newAccessToken);
    }

    // 로그아웃
    @Override
    public void logout(String loginId, HttpServletResponse response) {

        // 1) DB에서 userId 얻기
        Long userId = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new AuthorizationException("인증되지 않은 사용자입니다."))
                .getId();

        // 2) Redis에서 refreshToken 삭제
        refreshTokenStore.delete(userId);

        // 3) refreshToken 쿠키 만료
        ResponseCookie expiredCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)      // 로컬 http 테스트: false / 운영 https: true
                .sameSite("None")    // 운영에서 프론트-백 도메인 다르면 None 고려
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader("Set-Cookie", expiredCookie.toString());
    }

}
