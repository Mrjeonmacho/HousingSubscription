package com.ssafy14.a606.domain.game.dto.response;

import com.ssafy14.a606.domain.game.entity.QuizQuestion;
import lombok.Getter;

import java.util.List;

@Getter
public class QuizQuestionResponse {

    private Long questionId;
    private String question;
    private List<QuizOptionResponse> options;

    public QuizQuestionResponse(Long questionId, String question, List<QuizOptionResponse> options) {
        this.questionId = questionId;
        this.question = question;
        this.options = options;
    }


    public static QuizQuestionResponse from(QuizQuestion quizQuestion) {
        return new QuizQuestionResponse(
                quizQuestion.getId(),
                quizQuestion.getQuestion(),
                quizQuestion.getOptions().stream()
                        .map(QuizOptionResponse::from)
                        .toList()
        );
    }
}
