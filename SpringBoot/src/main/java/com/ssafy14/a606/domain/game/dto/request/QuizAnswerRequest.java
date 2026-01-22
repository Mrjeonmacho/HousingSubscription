package com.ssafy14.a606.domain.game.dto.request;

public class QuizAnswerRequest {

    private Long questionId;
    private String answer;

    protected QuizAnswerRequest() {
    }

    public Long getQuestionId() {
        return questionId;
    }

    public String getAnswer() {
        return answer;
    }
}
