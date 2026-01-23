package com.ssafy14.a606.domain.notice.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users_test")
public class UserTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

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


    // UserTest 객체가 생성될 떄 필수적인 정보는 name과 role이다.
    // 관심공고는 이후 행위에 따라 채워지는 값임으로 빌더에 ㄴㄴ
    // 그리고 넣는다해도 null 상태라 없는데 조회나 삭제하면 nullexception 발생함
    @Builder
    public UserTest(String name, UserRole role) {
        this.name = name;
        this.role = role;
    }

    // 다른 필드들은 User 도메인 담당자가 최종적으로 추가할 예정입니다.
    // Notice 와의 관계 설정을 위해 임시로 생성된 파일입니다.
}
