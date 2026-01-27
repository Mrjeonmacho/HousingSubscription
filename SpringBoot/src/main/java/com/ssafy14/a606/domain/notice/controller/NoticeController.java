package com.ssafy14.a606.domain.notice.controller;

import com.ssafy14.a606.domain.notice.dto.request.NoticeRequestDto;
import com.ssafy14.a606.domain.notice.dto.response.NoticeListResponseDto;
import com.ssafy14.a606.domain.notice.dto.response.NoticeResponseDto;
import com.ssafy14.a606.domain.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping
    public ResponseEntity<NoticeListResponseDto> getNoticeList() {
        return ResponseEntity.ok(noticeService.getNoticeList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoticeResponseDto> getNotice(@PathVariable("id") Long noticeId) {
        return ResponseEntity.ok(noticeService.getNotice(noticeId));
    }
}
