package com.ssafy14.a606.domain.notice.repository;

import com.ssafy14.a606.domain.notice.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
}
