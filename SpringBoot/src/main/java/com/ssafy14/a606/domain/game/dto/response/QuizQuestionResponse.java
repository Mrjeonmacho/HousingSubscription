package com.ssafy14.a606.domain.game.dto.response;

import com.ssafy14.a606.domain.game.entity.QuizQuestion;

public class QuizQuestionResponse {

    private Long questionId;
    private String question;

    public QuizQuestionResponse(Long questionId, String question) {
        this.questionId = questionId;
        this.question = question;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public String getQuestion() {
        return question;
    }

    /**
     * Entity → DTO 변환 메서드
     */
    public static QuizQuestionResponse from(QuizQuestion quizQuestion) {
        return new QuizQuestionResponse(
                quizQuestion.getId(),
                quizQuestion.getQuestion()
        );
    }
}
