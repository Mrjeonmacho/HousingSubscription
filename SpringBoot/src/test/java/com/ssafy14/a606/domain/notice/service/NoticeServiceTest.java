/*
package com.ssafy14.a606.domain.notice.service;

import com.ssafy14.a606.domain.notice.dto.request.NoticeRequestDto;
import com.ssafy14.a606.domain.notice.entity.Notice;
import com.ssafy14.a606.domain.notice.entity.NoticeCategory;
import com.ssafy14.a606.domain.notice.entity.NoticeStatus;
import com.ssafy14.a606.domain.notice.repository.NoticeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
class NoticeServiceTest {

    @Autowired
    private NoticeService noticeService;

    @Autowired
    private NoticeRepository noticeRepository;

    private Long notice1Id;
    private Long notice2Id;

    @BeforeEach
    void setUp() {
        noticeRepository.deleteAll();

        Notice notice1 = Notice.builder()
                .noticeNo("2024-0001")
                .title("행복주택 공고 1")
                .category(NoticeCategory.HAPPY_HOUSE)
                .status(NoticeStatus.RECEIVING)
                .regDate(LocalDate.of(2024, 1, 1))
                .startDate(LocalDate.of(2024, 1, 10))
                .endDate(LocalDate.of(2024, 1, 20))
                .pdfUrl("http://example.com/1.pdf")
                .url("http://example.com/1")
                .build();

        Notice notice2 = Notice.builder()
                .noticeNo("2024-0002")
                .title("청년안심주택 공고 2")
                .category(NoticeCategory.YOUTH_RESIDENCE)
                .status(NoticeStatus.COMPLETED)
                .regDate(LocalDate.of(2024, 2, 1))
                .startDate(LocalDate.of(2024, 2, 10))
                .endDate(LocalDate.of(2024, 2, 20))
                .pdfUrl("http://example.com/2.pdf")
                .url("http://example.com/2")
                .build();
        
        notice1Id = noticeRepository.save(notice1).getId();
        notice2Id = noticeRepository.save(notice2).getId();
    }

    @Test
    void getNoticeList() {
        // when
        var noticeListResponseDto = noticeService.getNoticeList();

        // then
        assertThat(noticeListResponseDto.getNotices()).hasSize(2);
    }

    @Test
    void getNotice() {
        // when
        var noticeResponseDto = noticeService.getNotice(notice1Id);

        // then
        assertThat(noticeResponseDto.getTitle()).isEqualTo("행복주택 공고 1");
        assertThat(noticeResponseDto.getCategory()).isEqualTo(NoticeCategory.HAPPY_HOUSE);
    }

    @Test
    void createNotice() {
        // given
        NoticeRequestDto newNoticeRequest = new NoticeRequestDto();
        newNoticeRequest.setNoticeNo("2024-0003");
        newNoticeRequest.setTitle("신규 공고");
        newNoticeRequest.setCategory(NoticeCategory.NATIONAL_RENTAL);
        newNoticeRequest.setStatus(NoticeStatus.TO_BE_ANNOUNCED);
        newNoticeRequest.setRegDate(LocalDate.of(2024, 3, 1));
        newNoticeRequest.setStartDate(LocalDate.of(2024, 3, 10));
        newNoticeRequest.setEndDate(LocalDate.of(2024, 3, 20));
        newNoticeRequest.setPdfUrl("http://example.com/3.pdf");
        newNoticeRequest.setUrl("http://example.com/3");

        // when
        var createdNotice = noticeService.createNotice(newNoticeRequest);

        // then
        assertThat(createdNotice.getTitle()).isEqualTo("신규 공고");
        assertThat(noticeRepository.count()).isEqualTo(3);
    }

    @Test
    void updateNotice() {
        // given
        NoticeRequestDto updateRequest = new NoticeRequestDto();
        updateRequest.setNoticeNo("2024-0001-update");
        updateRequest.setTitle("행복주택 공고 1 (수정됨)");
        updateRequest.setCategory(NoticeCategory.PUBLIC_RENTAL);
        updateRequest.setStatus(NoticeStatus.DEADLINE_APPROACHING);
        updateRequest.setRegDate(LocalDate.of(2024, 1, 2));
        updateRequest.setStartDate(LocalDate.of(2024, 1, 11));
        updateRequest.setEndDate(LocalDate.of(2024, 1, 21));
        updateRequest.setPdfUrl("http://example.com/1-update.pdf");
        updateRequest.setUrl("http://example.com/1-update");

        // when
        var updatedNotice = noticeService.updateNotice(notice1Id, updateRequest);

        // then
        assertThat(updatedNotice.getTitle()).isEqualTo("행복주택 공고 1 (수정됨)");
        assertThat(updatedNotice.getCategory()).isEqualTo(NoticeCategory.PUBLIC_RENTAL);

        Notice foundNotice = noticeRepository.findById(notice1Id).orElseThrow();
        assertThat(foundNotice.getTitle()).isEqualTo("행복주택 공고 1 (수정됨)");
    }

    @Test
    void deleteNotice() {
        // when
        noticeService.deleteNotice(notice1Id);

        // then
        assertThat(noticeRepository.count()).isEqualTo(1);
        assertThrows(IllegalArgumentException.class, () -> noticeService.getNotice(notice1Id));
    }
}
*/