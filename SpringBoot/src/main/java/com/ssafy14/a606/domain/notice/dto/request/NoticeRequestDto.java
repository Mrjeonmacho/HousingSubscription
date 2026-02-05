package com.ssafy14.a606.domain.notice.dto.request;

import com.ssafy14.a606.domain.notice.entity.NoticeCategory;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class NoticeRequestDto {

    private String title;
    private NoticeCategory category;
    private LocalDate regDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private String pdfUrl;
    private String originUrl;
    private String summary;
}
