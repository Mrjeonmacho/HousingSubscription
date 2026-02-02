package com.ssafy14.a606.domain.notice.entity;

import com.ssafy14.a606.domain.notice.entity.Home;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "notices")
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // SH 공고 등록 번호
    @Column(nullable = false)
    private String noticeNo;

    // SH 공고 제목
    @Column(nullable = false)
    private String title;

    // SH 공고 카테고리
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NoticeCategory category;

    // SH 공고 현재 상태
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NoticeStatus status;

    // SH 공고 등록일자
    private LocalDate regDate;

    // SH 공고 시작일자
    private LocalDate startDate;

    // SH 공고 마감 일자
    private LocalDate endDate;

    // SH 공고 pdf 링크
    private String pdfUrl;

    // 집 위치가 확인될 때 쓰는 공고의 집 목록 모음
    @OneToMany(mappedBy = "notice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Home> homes = new ArrayList<>();

    // 생성자 빌더
    @Builder
    public Notice(String noticeNo, String title, NoticeCategory category, NoticeStatus status, LocalDate regDate, LocalDate startDate, LocalDate endDate, String pdfUrl) {
        this.noticeNo = noticeNo;
        this.title = title;
        this.category = category;
        this.status = status;
        this.regDate = regDate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.pdfUrl = pdfUrl;
    }

    public void update(String noticeNo, String title, NoticeCategory category, NoticeStatus status, LocalDate regDate, LocalDate startDate, LocalDate endDate, String pdfUrl) {
        this.noticeNo = noticeNo;
        this.title = title;
        this.category = category;
        this.status = status;
        this.regDate = regDate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.pdfUrl = pdfUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Notice)) return false;
        Notice notice = (Notice) o;
        return id != null && id.equals(notice.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}