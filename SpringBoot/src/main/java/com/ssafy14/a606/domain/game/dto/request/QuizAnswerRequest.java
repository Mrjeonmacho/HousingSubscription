package com.ssafy14.a606.domain.game.dto.request;

import lombok.Getter;

@Getter
public class QuizAnswerRequest {

    private Long questionId;
    private Long selectedOptionId;

    protected QuizAnswerRequest() {}

}
