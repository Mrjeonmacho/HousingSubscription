package com.ssafy14.a606.domain.game.dto.response;

import com.ssafy14.a606.domain.game.enums.PreferenceType;
import com.ssafy14.a606.domain.notice.entity.NoticeCategory;
import lombok.Getter;

import java.util.List;

@Getter
public class PreferenceResultResponse {

    private final String preferenceType;
    private final String summary;
    private final List<String> recommendedCategories;
    private final String noticeTip;

    public PreferenceResultResponse(PreferenceType type) {
        this.preferenceType = type.getDisplayName();
        this.summary = type.getSummary();
        this.recommendedCategories = type.getRecommendedCategories()
                .stream()
                .map(Enum::name) // "PUBLIC_RENTAL"
                .toList();
        this.noticeTip = type.getNoticeTip();
    }
}
