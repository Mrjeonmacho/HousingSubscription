package com.ssafy14.a606.domain.notice.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Entity
@Table(name = "users_test") // 데이터베이스에 'user'는 예약어인 경우가 많아 'users'로 테이블명을 지정하는 것이 안전합니다.
public class User_Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @ManyToMany
    @JoinTable(
            name = "user_favorite_notices",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "notice_id")
    )
    private Set<Notice> favoriteNotices = new HashSet<>();

    // 다른 필드들은 User 도메인 담당자가 최종적으로 추가할 예정입니다.
    // Notice 와의 관계 설정을 위해 임시로 생성된 파일입니다.
}
