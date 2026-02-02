package com.ssafy14.a606.domain.game.dto.request;

import lombok.Getter;

@Getter
public class PreferenceAnswerRequest {
    private String questionKey;
    private String selectedOption;
}
