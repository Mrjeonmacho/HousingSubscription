package com.ssafy14.a606.domain.game.dto.request;

import lombok.Getter;

import java.util.List;

@Getter
public class PreferenceResultRequest {

    private List<PreferenceAnswerRequest> answers;

}