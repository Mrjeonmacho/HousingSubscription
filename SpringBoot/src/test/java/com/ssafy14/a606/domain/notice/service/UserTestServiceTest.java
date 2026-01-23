package com.ssafy14.a606.domain.notice.service;

import com.ssafy14.a606.domain.notice.dto.response.NoticeResponseDto;
import com.ssafy14.a606.domain.notice.entity.Notice;
import com.ssafy14.a606.domain.notice.entity.NoticeCategory;
import com.ssafy14.a606.domain.notice.entity.NoticeStatus;
import com.ssafy14.a606.domain.notice.entity.UserTest;
import com.ssafy14.a606.domain.notice.entity.UserRole;
import com.ssafy14.a606.domain.notice.repository.NoticeRepository;
import com.ssafy14.a606.domain.notice.repository.UserTestRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class UserTestServiceTest {

    @Autowired
    private UserTestService userTestService;

    @Autowired
    private UserTestRepository userTestRepository;

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private EntityManager em;

    private UserTest testUser;
    private Notice testNotice;

    @BeforeEach
    void setUp() {
        testUser = UserTest.builder()
                .name("testUser")
                .role(UserRole.USER)
                .build();
        userTestRepository.save(testUser);

        testNotice = Notice.builder()
                .noticeNo("N-101")
                .title("Test Notice")
                .category(NoticeCategory.YOUTH_RESIDENCE) // Using a valid category
                .status(NoticeStatus.RECEIVING)
                .regDate(LocalDate.now())
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(10))
                .url("http://example.com")
                .build();
        noticeRepository.save(testNotice);

        em.flush();
        em.clear();
    }

    @Test
    @DisplayName("관심 공고 추가, 조회, 삭제 서비스 테스트")
    void favoriteNoticeServiceFlowTest() {
        // given
        Long userId = testUser.getId();
        Long noticeId = testNotice.getId();

        // 1. 관심 공고 추가
        userTestService.addFavoriteNotice(userId, noticeId);

        em.flush();
        em.clear();

        // 2. 관심 공고 조회 및 확인
        List<NoticeResponseDto> favoriteNotices = userTestService.getFavoriteNotices(userId);
        assertThat(favoriteNotices).hasSize(1);
        assertThat(favoriteNotices.get(0).getId()).isEqualTo(noticeId);
        assertThat(favoriteNotices.get(0).getTitle()).isEqualTo("Test Notice");

        // 3. 관심 공고 삭제
        userTestService.deleteFavoriteNotice(userId, noticeId);

        em.flush();
        em.clear();

        // 4. 관심 공고 목록이 비었는지 확인
        List<NoticeResponseDto> favoriteNoticesAfterDeletion = userTestService.getFavoriteNotices(userId);
        assertThat(favoriteNoticesAfterDeletion).isEmpty();
        
        // 추가 확인: DB에서 직접 사용자의 즐겨찾기 목록 확인
        UserTest user = userTestRepository.findById(userId).orElseThrow();
        assertThat(user.getFavoriteNotices()).isEmpty();
    }
}
