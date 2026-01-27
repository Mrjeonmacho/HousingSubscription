package com.ssafy14.a606.domain.user.service;

import com.ssafy14.a606.domain.user.dto.request.SignInRequestDto;
import com.ssafy14.a606.domain.user.dto.request.SignUpRequestDto;
import com.ssafy14.a606.domain.user.dto.response.SignInResponseDto;
import com.ssafy14.a606.domain.user.dto.response.SignUpResponseDto;
import com.ssafy14.a606.domain.user.entity.AuthType;
import com.ssafy14.a606.domain.user.entity.Role;
import com.ssafy14.a606.domain.user.entity.User;
import com.ssafy14.a606.domain.user.repository.UserRepository;
import com.ssafy14.a606.global.exceptions.AuthorizationException;
import com.ssafy14.a606.global.exceptions.DuplicateValueException;
import com.ssafy14.a606.global.exceptions.InvalidValueException;
import com.ssafy14.a606.global.security.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    // 1. 회원가입
    @Override
    @Transactional
    public SignUpResponseDto signUpLocal(SignUpRequestDto request) {

        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateValueException("이미 사용 중인 이메일입니다.");
        }

        // 로그인 ID 중복 체크
        if (userRepository.existsByLoginId(request.getLoginId())) {
            throw new DuplicateValueException("이미 사용 중인 ID입니다.");
        }

        // 비밀번호 해시(BCrypt)
        String encodedPw = passwordEncoder.encode(request.getPassword());

        // 엔티티 생성 (서버가 기본값 세팅)
        User user = User.builder()
                .authType(AuthType.LOCAL)
                .loginId(request.getLoginId())
                .password(encodedPw)
                .userName(request.getUserName())
                .email(request.getEmail())
                .role(Role.USER)
                .build();

        User saved = userRepository.save(user);

        return new SignUpResponseDto(saved.getId(), saved.getUserName(), saved.getRole().name());
    }

    // 2. 아이디 중복 검증
    @Override
    public boolean isAvailableLoginId(String loginId) {
        if (loginId == null || loginId.isBlank()) {
            throw new InvalidValueException("loginId는 필수입니다.");
        }
        return !userRepository.existsByLoginId(loginId.trim());
    }

    // 3. 이메일 중복 검증
    @Override
    public boolean isAvailableEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new InvalidValueException("email은 필수입니다.");
        }
        return !userRepository.existsByEmail(email.trim());
    }

    // 4. 회원가입 시 아이디 & 이메일 중복 검증
    @Override
    public Map<String, Object> checkDuplicate(String type, String value) {
        String t = type.toLowerCase();

        boolean available = switch (t) {
            case "loginid" -> isAvailableLoginId(value);
            case "email" -> isAvailableEmail(value);
            default -> throw new IllegalArgumentException("Invalid type: " + type);
        };

        String message = switch (t) {
            case "loginid" -> available ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.";
            case "email" -> available ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다.";
            default -> "";
        };

        return Map.of(
                "available", available,
                "message", message
        );
    }

    // 5. 로컬 로그인
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

        String role = user.getRole().name(); // enum이면 name()

        String accessToken = jwtTokenProvider.createAccessToken(user.getLoginId(), role);
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getLoginId());

        // refreshToken -> HttpOnly 쿠키
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)      // 로컬 http 테스트: false / 운영 https: true
                .sameSite("Lax")    // 운영에서 프론트-백 도메인 다르면 None 고려
                .path("/")
                .maxAge(Duration.ofDays(14))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return new SignInResponseDto(accessToken, refreshToken);
    }

}
