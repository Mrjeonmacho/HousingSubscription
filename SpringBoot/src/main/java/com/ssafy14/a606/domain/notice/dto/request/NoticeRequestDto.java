package com.ssafy14.a606.domain.notice.dto.request;

import com.ssafy14.a606.domain.notice.entity.NoticeCategory;
import com.ssafy14.a606.domain.notice.entity.NoticeStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class NoticeRequestDto {

    private String noticeNo;
    private String title;
    private NoticeCategory category;
    private NoticeStatus status;
    private LocalDate regDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private String pdfUrl;
    private String summary;
}
