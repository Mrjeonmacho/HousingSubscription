package com.ssafy14.a606.domain.notice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;

@Getter
@Entity
@Table(name = "homes")
public class Home {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "notice_id") // notice_id 컬럼으로 Notice와 조인
    private Notice notice;

    // 다른 필드들은 Home 도메인 담당자가 최종적으로 추가할 예정입니다.
    // Notice 와의 관계 설정을 위해 임시로 생성된 파일입니다.
}
