package com.ssafy14.a606.domain.notice.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 직접 생성 방지
@Table(name = "homes")
public class Home {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 카카오 맵 마커 표시를 위한 필드들
    @Column(nullable = false)
    private String address;   // 주택 주소 (인포윈도우 표시용)

    @Column(nullable = false)
    private Double latitude;  // 위도 (마커 좌표)

    @Column(nullable = false)
    private Double longitude; // 경도 (마커 좌표)

    @ManyToOne(fetch = FetchType.LAZY) // 성능을 위해 지연 로딩 설정
    @JoinColumn(name = "notice_id")    // DB의 notice_id 컬럼과 매핑
    private Notice notice;
}
