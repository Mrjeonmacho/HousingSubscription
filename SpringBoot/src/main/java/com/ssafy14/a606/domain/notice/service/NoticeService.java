package com.ssafy14.a606.domain.notice.service;

import com.ssafy14.a606.domain.notice.dto.request.SummaryRequestDto;
import com.ssafy14.a606.domain.notice.dto.response.SummaryResponseDto;
import com.ssafy14.a606.domain.notice.dto.request.NoticeRequestDto;
import com.ssafy14.a606.domain.notice.dto.response.NoticeListResponseDto;
import com.ssafy14.a606.domain.notice.dto.response.NoticeResponseDto;
import com.ssafy14.a606.domain.notice.entity.Notice;
import com.ssafy14.a606.domain.notice.repository.NoticeRepository;
import com.ssafy14.a606.global.exceptions.InvalidValueException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final WebClient webClient;

    public NoticeService(NoticeRepository noticeRepository, WebClient.Builder webClientBuilder, @Value("${fastapi.url}") String fastApiUrl) {
        this.noticeRepository = noticeRepository;
        this.webClient = webClientBuilder.baseUrl(fastApiUrl).build();
    }

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
        // 1. FastAPI에 요약 요청 보내기
        SummaryRequestDto summaryRequest = new SummaryRequestDto(noticeRequestDto.getTitle());

        SummaryResponseDto summaryResponse = webClient.post()
                .uri("/summary")
                .bodyValue(summaryRequest)
                .retrieve()
                .bodyToMono(SummaryResponseDto.class)
                .block(); // 비동기 결과를 동기적으로 기다림

        String summary = (summaryResponse != null && summaryResponse.getSummary() != null)
                ? summaryResponse.getSummary()
                : "요약 생성에 실패했습니다.";

        // 2. 받은 요약본과 함께 Notice 엔티티 생성
        Notice notice = Notice.builder()
                .title(noticeRequestDto.getTitle())
                .category(noticeRequestDto.getCategory())
                .regDate(noticeRequestDto.getRegDate())
                .startDate(noticeRequestDto.getStartDate())
                .endDate(noticeRequestDto.getEndDate())
                .pdfUrl(noticeRequestDto.getPdfUrl())
                .originUrl(noticeRequestDto.getOriginUrl())
                .summary(summary) // FastAPI에서 받은 요약본 사용
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
                noticeRequestDto.getTitle(),
                noticeRequestDto.getCategory(),
                noticeRequestDto.getRegDate(),
                noticeRequestDto.getStartDate(),
                noticeRequestDto.getEndDate(),
                noticeRequestDto.getPdfUrl(),
                noticeRequestDto.getOriginUrl(),
                noticeRequestDto.getSummary()
        );

        return new NoticeResponseDto(notice);
    }

    @Transactional
    public void deleteNotice(Long noticeId) {
        noticeRepository.deleteById(noticeId);
    }
}
