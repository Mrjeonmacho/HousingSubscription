package com.ssafy14.a606.domain.notice.service;

import com.ssafy14.a606.domain.notice.dto.response.NoticeResponseDto;
import com.ssafy14.a606.domain.notice.entity.Notice;
import com.ssafy14.a606.domain.notice.repository.NoticeRepository;
import com.ssafy14.a606.domain.user.entity.User;
import com.ssafy14.a606.domain.user.repository.UserRepository;
import com.ssafy14.a606.global.exceptions.InvalidValueException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NoticeFavoriteService {

    private final UserRepository userRepository;
    private final NoticeRepository noticeRepository;

    @Transactional(readOnly = true)
    public List<NoticeResponseDto> getFavoriteNotices(Long userId) {
        User user = userRepository.findById(userId) // Changed from User_Test
                .orElseThrow(() -> new InvalidValueException("존재하지 않는 유저입니다. User Id:" + userId));

        Set<Notice> favoriteNotices = user.getFavoriteNotices();

        return favoriteNotices.stream()
                .map(NoticeResponseDto::new)
                .collect(Collectors.toList());
    }

    public void addFavoriteNotice(Long userId, Long noticeId) {
        User user = userRepository.findById(userId) // Changed from User_Test
                .orElseThrow(() -> new InvalidValueException("존재하지 않는 유저입니다. User Id:" + userId));
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new InvalidValueException("존재하지 않는 공고입니다. Id:" + noticeId));

        user.getFavoriteNotices().add(notice);
    }

    public void deleteFavoriteNotice(Long userId, Long noticeId) {
        User user = userRepository.findById(userId) // Changed from User_Test
                .orElseThrow(() -> new InvalidValueException("존재하지 않는 유저입니다. User Id:" + userId));
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new InvalidValueException("존재하지 않는 공고입니다. Id:" + noticeId));

        user.getFavoriteNotices().remove(notice);
    }
}
