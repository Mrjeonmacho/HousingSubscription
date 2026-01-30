package com.ssafy14.a606.domain.game.dto.response;

import com.ssafy14.a606.domain.game.entity.QuizOption;
import lombok.Getter;

@Getter
public class QuizOptionResponse {

    private Long optionId;
    private String text;

    public QuizOptionResponse(Long optionId, String text) {
        this.optionId = optionId;
        this.text = text;
    }

    public static QuizOptionResponse from(QuizOption option) {
        return new QuizOptionResponse(
                option.getId(),
                option.getOptionText()
        );
    }
}
