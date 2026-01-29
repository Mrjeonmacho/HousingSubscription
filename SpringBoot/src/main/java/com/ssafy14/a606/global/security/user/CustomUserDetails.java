package com.ssafy14.a606.global.security.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class CustomUserDetails implements UserDetails {

    private final Long userId;
    private final String loginId;
    @JsonIgnore
    private final String password;
    private final String role; // DB 값: USER / ADMIN (또는 ROLE_USER 형태도 허용)

    public CustomUserDetails(Long userId, String loginId, String password, String role) {
        this.userId = userId;
        this.loginId = loginId;
        this.password = password;
        this.role = role;
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) return "ROLE_USER"; // 기본값(원하면 변경)
        return role.startsWith("ROLE_") ? role : "ROLE_" + role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(normalizeRole(role)));
    }

    /**
     * Spring Security에서 사용하는 username 값
     * 우리 프로젝트에서는 loginId를 username으로 사용
     */
    @Override
    public String getUsername() {
        return loginId;
    }

    /**
     * 인터페이스 구현상 null 반환 가능.
     */
    @Override
    public String getPassword() {
        return password;
    }

    // 계정 상태 정책이 없다면 true로 고정
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
