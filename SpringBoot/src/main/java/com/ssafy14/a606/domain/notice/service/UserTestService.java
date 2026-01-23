package com.ssafy14.a606.domain.notice.service;

import com.ssafy14.a606.domain.notice.dto.response.NoticeResponseDto;
import com.ssafy14.a606.domain.notice.entity.Notice;
import com.ssafy14.a606.domain.notice.entity.UserTest; // Changed from User_Test
import com.ssafy14.a606.domain.notice.repository.NoticeRepository;
import com.ssafy14.a606.domain.notice.repository.UserTestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserTestService {

    private final UserTestRepository userTestRepository;
    private final NoticeRepository noticeRepository;

    @Transactional(readOnly = true)
    public List<NoticeResponseDto> getFavoriteNotices(Long userId) {
        UserTest user = userTestRepository.findById(userId) // Changed from User_Test
                .orElseThrow(() -> new IllegalArgumentException("Invalid user Id:" + userId));

        Set<Notice> favoriteNotices = user.getFavoriteNotices();

        return favoriteNotices.stream()
                .map(NoticeResponseDto::new)
                .collect(Collectors.toList());
    }

    public void addFavoriteNotice(Long userId, Long noticeId) {
        UserTest user = userTestRepository.findById(userId) // Changed from User_Test
                .orElseThrow(() -> new IllegalArgumentException("Invalid user Id:" + userId));
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid notice Id:" + noticeId));

        user.getFavoriteNotices().add(notice);
    }

    public void deleteFavoriteNotice(Long userId, Long noticeId) {
        UserTest user = userTestRepository.findById(userId) // Changed from User_Test
                .orElseThrow(() -> new IllegalArgumentException("Invalid user Id:" + userId));
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid notice Id:" + noticeId));

        user.getFavoriteNotices().remove(notice);
    }
}
