package com.ssafy14.a606.domain.notice.dto.response;

import lombok.Getter;

import java.util.List;

@Getter
public class NoticeListResponseDto {

    private List<NoticeResponseDto> notices;

    public NoticeListResponseDto(List<NoticeResponseDto> notices) {
        this.notices = notices;
    }
}
