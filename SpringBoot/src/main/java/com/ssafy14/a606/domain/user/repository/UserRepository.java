package com.ssafy14.a606.domain.user.repository;

import com.ssafy14.a606.domain.user.entity.AuthType;
import com.ssafy14.a606.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 이메일 중복 확인
    boolean existsByEmail(String email);

    // 로그인 아이디 중복 확인
    boolean existsByLoginId(String loginId);

    // 소셜 로그인 사용자 조회/중복 체크용
    // (auth_type, provider_id) UNIQUE
    boolean existsByAuthTypeAndProviderId(AuthType authType, String providerId);

    Optional<User> findByLoginId(String loginId);

    Optional<User> findByAuthTypeAndProviderId(AuthType authType, String providerId);

    Optional<User> findByEmail(String email);
}
