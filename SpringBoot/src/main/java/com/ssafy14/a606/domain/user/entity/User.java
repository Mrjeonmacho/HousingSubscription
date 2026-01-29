package com.ssafy14.a606.domain.user.entity;

import com.ssafy14.a606.domain.notice.entity.Notice;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long id;

    /**
     * 가입 경로
     * LOCAL / GOOGLE / KAKAO
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "auth_type", nullable = false, length = 20)
    private AuthType authType;

    /**
     * 로컬 로그인 ID
     * - LOCAL 회원만 사용 / 소셜 회원은 null
     */
    @Column(name = "login_id", length = 50)
    private String loginId;

    /**
     * 소셜 로그인 provider 사용자 ID
     * - GOOGLE / KAKAO 회원만 사용 / LOCAL 회원은 null
     */
    @Column(name = "provider_id", length = 255)
    private String providerId;

    /**
     * 비밀번호 (BCrypt)
     * - LOCAL 회원만 사용 / 소셜 회원은 null
     */
    @Column(name = "password", length = 255)
    private String password;

    /**
     * 사용자 이름
     */
    @Column(name = "user_name", nullable = false, length = 50)
    private String userName;

    /**
     * 이메일
     * - 중복 불가(Unique)
     */
    @Column(name = "email", nullable = false, length = 255)
    private String email;

    /**
     * 권한
     * - 기본값: USER
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role;

    /**
     * 가입일 - DB에서 자동 생성
     */
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 수정일 - DB에서 자동 갱신
     */
    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    /**
     * 관심 공고 (ManyToMany)
     * - User 기준 연관관계 주인
     * - 중간 테이블: user_favorite_notices
     */
    @ManyToMany
    @JoinTable(
            name = "user_favorite_notices",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "notice_id")
    )
    private Set<Notice> favoriteNotices = new HashSet<>();

    /**
     * 저장 직전 기본값 세팅
     * - JPA가 INSERT 시 role을 포함시키면 DB default가 안 먹는 경우가 있어 안전장치로 USER 세팅
     */
    @PrePersist
    public void prePersist() {
        if (this.role == null) this.role = Role.USER;
    }
}
