package com.ssafy14.a606.domain.user.service;

import com.ssafy14.a606.domain.user.dto.request.SignUpRequestDto;
import com.ssafy14.a606.domain.user.dto.request.UserUpdateRequestDto;
import com.ssafy14.a606.domain.user.dto.response.SignUpResponseDto;
import com.ssafy14.a606.domain.user.dto.response.UserResponseDto;
import com.ssafy14.a606.domain.user.entity.AuthType;
import com.ssafy14.a606.domain.user.entity.Role;
import com.ssafy14.a606.domain.user.entity.User;
import com.ssafy14.a606.domain.user.entity.UserDetails;
import com.ssafy14.a606.domain.user.repository.UserDetailsRepository;
import com.ssafy14.a606.domain.user.repository.UserRepository;
import com.ssafy14.a606.global.exceptions.DuplicateValueException;
import com.ssafy14.a606.global.exceptions.InvalidValueException;
import com.ssafy14.a606.global.exceptions.NotFoundException;
import com.ssafy14.a606.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsRepository userDetailsRepository;

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

        // 회원가입 시 user_details 테이블에 빈 row 생성
        UserDetails details = UserDetails.builder()
                .user(saved)
                .build();

        userDetailsRepository.save(details);

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

    // 5. 회원 기본정보 조회
    @Override
    public UserResponseDto getMyInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
        return toUserResponse(user);
    }

    // 6. 회원 기본정보 수정 (이름, 이메일)
    @Override
    @Transactional
    public UserResponseDto updateMyInfo(Long userId, UserUpdateRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));

        // 이름 수정
        if (request.getUserName() != null) {
            String newName = request.getUserName().trim();
            if (newName.isEmpty()) throw new InvalidValueException("userName은 공백일 수 없습니다.");
            user.updateUserName(newName);
        }

        // 이메일 수정
        if (request.getEmail() != null) {
            String newEmail = request.getEmail().trim();
            if (newEmail.isEmpty()) throw new InvalidValueException("email은 공백일 수 없습니다.");

            if (!newEmail.equals(user.getEmail())) {
                if (userRepository.existsByEmail(newEmail)) {
                    throw new DuplicateValueException("이미 사용 중인 이메일입니다.");
                }
                user.updateEmail(newEmail);
            }
        }

        return toUserResponse(user);
    }


    private UserResponseDto toUserResponse(User user) {
        return UserResponseDto.builder()
                .userId(user.getId())
                .authType(user.getAuthType().name())
                .loginId(user.getLoginId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .build();
    }


}
