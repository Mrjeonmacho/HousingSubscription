
package com.ssafy14.a606.domain.notice.service;

import com.ssafy14.a606.domain.notice.dto.request.NoticeRequestDto;
import com.ssafy14.a606.domain.notice.dto.response.NoticeListResponseDto;
import com.ssafy14.a606.domain.notice.dto.response.NoticeResponseDto;
import com.ssafy14.a606.domain.notice.entity.Notice;
import com.ssafy14.a606.domain.notice.repository.NoticeRepository;
import com.ssafy14.a606.global.exceptions.InvalidValueException;
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

    //전체 공고 조회
    public NoticeListResponseDto getNoticeList() {
        List<Notice> notices = noticeRepository.findAll();
        List<NoticeResponseDto> noticeResponseDtos = notices.stream()
                .map(NoticeResponseDto::new)
                .collect(Collectors.toList());
        return new NoticeListResponseDto(noticeResponseDtos);
    }

    public NoticeResponseDto getNotice(Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new InvalidValueException("해당 공고를 찾을 수 없습니다. notice Id:" + noticeId));
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
                .summary(noticeRequestDto.getSummary())
                .build();
        noticeRepository.save(notice);
        return new NoticeResponseDto(notice);
    }


    // 새로 만들어진게 아니라 이미 JPA로 관리되는 레포지토리에 있는 것을 들고와서 수정하기 때문에
    // 끝나고 save할 필요 없이 트랜잭션 끝나면 알아서 영속화함
    @Transactional
    public NoticeResponseDto updateNotice(Long noticeId, NoticeRequestDto noticeRequestDto) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new InvalidValueException("해당 공고를 찾을 수 없습니다. Id:" + noticeId));
        
        notice.update(
                noticeRequestDto.getNoticeNo(),
                noticeRequestDto.getTitle(),
                noticeRequestDto.getCategory(),
                noticeRequestDto.getStatus(),
                noticeRequestDto.getRegDate(),
                noticeRequestDto.getStartDate(),
                noticeRequestDto.getEndDate(),
                noticeRequestDto.getPdfUrl(),
                noticeRequestDto.getSummary()
        );

        return new NoticeResponseDto(notice);
    }

    @Transactional
    public void deleteNotice(Long noticeId) {
        noticeRepository.deleteById(noticeId);
    }
}
