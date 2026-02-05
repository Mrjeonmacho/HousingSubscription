package com.ssafy14.a606.domain.notice.dto.response;

import com.ssafy14.a606.domain.notice.entity.Notice;
import com.ssafy14.a606.domain.notice.entity.NoticeCategory;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class NoticeResponseDto {

    private Long id;
    private String title;
    private NoticeCategory category;
    private LocalDate regDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private String pdfUrl;
    private String originUrl;
    private String summary;

    public  NoticeResponseDto(Notice notice) {
        this.id = notice.getId();
        this.title = notice.getTitle();
        this.category = notice.getCategory();
        this.regDate = notice.getRegDate();
        this.startDate = notice.getStartDate();
        this.endDate = notice.getEndDate();
        this.pdfUrl = notice.getPdfUrl();
        this.originUrl = notice.getOriginUrl();
        this.summary = notice.getSummary();
    }
}
