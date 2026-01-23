package com.ssafy14.a606.domain.notice.controller;

import com.ssafy14.a606.domain.notice.dto.response.NoticeResponseDto;
import com.ssafy14.a606.domain.notice.service.UserTestService; // Using UserTestService
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices/favorites")
@RequiredArgsConstructor
public class NoticeFavoriteController {

    private final UserTestService userTestService;
    @GetMapping("/{userId}")
    public ResponseEntity<List<NoticeResponseDto>> getFavoriteNotices(@PathVariable Long userId) {
        return ResponseEntity.ok(userTestService.getFavoriteNotices(userId));
    }

    @PostMapping("/{userId}/{noticeId}")
    public ResponseEntity<Void> addFavoriteNotice(@PathVariable Long userId, @PathVariable Long noticeId) {
        userTestService.addFavoriteNotice(userId, noticeId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}/{noticeId}")
    public ResponseEntity<Void> deleteFavoriteNotice(@PathVariable Long userId, @PathVariable Long noticeId) {
        userTestService.deleteFavoriteNotice(userId, noticeId);
        return ResponseEntity.noContent().build();
    }
}
