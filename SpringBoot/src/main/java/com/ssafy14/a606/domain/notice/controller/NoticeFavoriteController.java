package com.ssafy14.a606.domain.notice.controller;

import com.ssafy14.a606.domain.notice.dto.response.NoticeResponseDto;
import com.ssafy14.a606.domain.notice.service.NoticeFavoriteService; // Using UserTestService
import com.ssafy14.a606.global.security.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices/favorites")
@RequiredArgsConstructor
public class NoticeFavoriteController {

    private final NoticeFavoriteService noticeFavoriteService;
    @GetMapping
    public ResponseEntity<List<NoticeResponseDto>> getFavoriteNotices(
            @AuthenticationPrincipal CustomUserDetails principal
            ) {
        return ResponseEntity.ok(noticeFavoriteService.getFavoriteNotices(principal.getUserId()));
    }


    @PostMapping("/{noticeId}")
    public ResponseEntity<Void> addFavoriteNotice(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable Long noticeId
    ) {
        noticeFavoriteService.addFavoriteNotice(principal.getUserId(), noticeId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{noticeId}")
    public ResponseEntity<Void> deleteFavoriteNotice(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable Long noticeId
    ) {
        noticeFavoriteService.deleteFavoriteNotice(principal.getUserId(), noticeId);
        return ResponseEntity.noContent().build();
    }
}
