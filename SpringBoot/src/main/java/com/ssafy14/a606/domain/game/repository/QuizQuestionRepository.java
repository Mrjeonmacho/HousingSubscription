package com.ssafy14.a606.domain.game.repository;

import com.ssafy14.a606.domain.game.entity.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    /**
     * 용어 퀴즈 랜덤 10문제 조회
     */
    @Query(
            value = "SELECT * FROM quizzes ORDER BY RAND() LIMIT 10",
            nativeQuery = true
    )
    List<QuizQuestion> findRandom10Questions();
}
