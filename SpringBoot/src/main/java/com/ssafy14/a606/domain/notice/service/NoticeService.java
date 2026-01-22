
package com.ssafy14.a606.domain.notice.service;

import com.ssafy14.a606.domain.notice.dto.request.NoticeRequestDto;
import com.ssafy14.a606.domain.notice.dto.response.NoticeListResponseDto;
import com.ssafy14.a606.domain.notice.dto.response.NoticeResponseDto;
import com.ssafy14.a606.domain.notice.entity.Notice;
import com.ssafy14.a606.domain.notice.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeService {

    private final NoticeRepository noticeRepository;



    public NoticeListResponseDto getNoticeList() {
        List<Notice> notices = noticeRepository.findAll();
        List<NoticeResponseDto> noticeResponseDtos = notices.stream()
                .map(NoticeResponseDto::new)
                .collect(Collectors.toList());
        return new NoticeListResponseDto(noticeResponseDtos);
    }

    public NoticeResponseDto getNotice(Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid notice Id:" + noticeId));
        return new NoticeResponseDto(notice);
    }

    @Transactional
    public NoticeResponseDto createNotice(NoticeRequestDto noticeRequestDto) {
        Notice notice = Notice.builder()
                .noticeNo(noticeRequestDto.getNoticeNo())
                .title(noticeRequestDto.getTitle())
                .category(noticeRequestDto.getCategory())
                .status(noticeRequestDto.getStatus())
                .regDate(noticeRequestDto.getRegDate())
                .startDate(noticeRequestDto.getStartDate())
                .endDate(noticeRequestDto.getEndDate())
                .pdfUrl(noticeRequestDto.getPdfUrl())
                .url(noticeRequestDto.getUrl())
                .build();
        noticeRepository.save(notice);
        return new NoticeResponseDto(notice);
    }

    @Transactional
    public NoticeResponseDto updateNotice(Long noticeId, NoticeRequestDto noticeRequestDto) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid notice Id:" + noticeId));
        
        notice.update(
                noticeRequestDto.getNoticeNo(),
                noticeRequestDto.getTitle(),
                noticeRequestDto.getCategory(),
                noticeRequestDto.getStatus(),
                noticeRequestDto.getRegDate(),
                noticeRequestDto.getStartDate(),
                noticeRequestDto.getEndDate(),
                noticeRequestDto.getPdfUrl(),
                noticeRequestDto.getUrl()
        );

        return new NoticeResponseDto(notice);
    }

    @Transactional
    public void deleteNotice(Long noticeId) {
        noticeRepository.deleteById(noticeId);
    }
}
