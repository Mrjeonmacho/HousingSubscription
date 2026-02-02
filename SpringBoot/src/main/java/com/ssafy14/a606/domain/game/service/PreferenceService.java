package com.ssafy14.a606.domain.game.service;

import com.ssafy14.a606.domain.game.dto.request.PreferenceAnswerRequest;
import com.ssafy14.a606.domain.game.dto.request.PreferenceResultRequest;
import com.ssafy14.a606.domain.game.dto.response.PreferenceResultResponse;
import com.ssafy14.a606.domain.game.enums.*;

import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class PreferenceService {

    public PreferenceResultResponse calculatePreferenceType(PreferenceResultRequest request) {

        List<PreferenceAnswerRequest> answers = request.getAnswers();

        Map<PreferenceType, Integer> scoreMap =
                new EnumMap<>(PreferenceType.class);

        // 초기화
        for (PreferenceType type : PreferenceType.values()) {
            scoreMap.put(type, 0);
        }

        for (PreferenceAnswerRequest answer : answers) {

            PreferenceQuestionKey questionKey =
                    PreferenceQuestionKey.from(answer.getQuestionKey());

            PreferenceOption option =
                    PreferenceOption.from(answer.getSelectedOption());

            applyScore(scoreMap, questionKey, option);
        }

        PreferenceType resultType = determineResultType(scoreMap);

        return new PreferenceResultResponse(resultType);
    }

    /**
     * 최종 성향 타입 결정
     * - 최고 점수 동점이면 BALANCE_SEEKER
     */
    private PreferenceType determineResultType(Map<PreferenceType, Integer> scoreMap) {

        int maxScore = scoreMap.values()
                .stream()
                .mapToInt(Integer::intValue)
                .max()
                .orElse(0);

        List<PreferenceType> topTypes = scoreMap.entrySet()
                .stream()
                .filter(entry -> entry.getValue() == maxScore)
                .map(Map.Entry::getKey)
                .toList();

        if (topTypes.size() > 1) {
            return PreferenceType.BALANCE_SEEKER;
        }

        return topTypes.get(0);
    }

    /**
     * 질문 + 선택지에 따른 점수 반영
     */
    private void applyScore(
            Map<PreferenceType, Integer> scoreMap,
            PreferenceQuestionKey questionKey,
            PreferenceOption option
    ) {

        switch (questionKey) {

            case COMMUTE_TIME -> {
                if (option == PreferenceOption.WITHIN_30_MIN) {
                    scoreMap.merge(PreferenceType.STABLE_SEEKER, 2, Integer::sum);
                    scoreMap.merge(PreferenceType.LOCATION_PRIORITY, 1, Integer::sum);
                } else if (option == PreferenceOption.NO_LIMIT) {
                    scoreMap.merge(PreferenceType.FLEXIBLE_MOVER, 2, Integer::sum);
                }
            }

            case HOUSING_COST -> {
                if (option == PreferenceOption.MINIMIZE_COST) {
                    scoreMap.merge(PreferenceType.COST_CONSERVATIVE, 3, Integer::sum);
                } else if (option == PreferenceOption.FLEXIBLE_COST) {
                    scoreMap.merge(PreferenceType.OPPORTUNITY_SEEKER, 2, Integer::sum);
                }
            }

            case LOAN_ATTITUDE -> {
                if (option == PreferenceOption.AVOID_LOAN) {
                    scoreMap.merge(PreferenceType.STABLE_SEEKER, 2, Integer::sum);
                } else if (option == PreferenceOption.ACTIVE_LOAN) {
                    scoreMap.merge(PreferenceType.OPPORTUNITY_SEEKER, 2, Integer::sum);
                }
            }

            case STAY_DURATION -> {
                if (option == PreferenceOption.LONG_TERM) {
                    scoreMap.merge(PreferenceType.STABLE_SEEKER, 2, Integer::sum);
                } else if (option == PreferenceOption.SHORT_TERM) {
                    scoreMap.merge(PreferenceType.FLEXIBLE_MOVER, 2, Integer::sum);
                }
            }

            case RELOCATION_FLEX -> {
                if (option == PreferenceOption.AVOID_MOVE) {
                    scoreMap.merge(PreferenceType.STABLE_SEEKER, 1, Integer::sum);
                } else if (option == PreferenceOption.FLEXIBLE_MOVE) {
                    scoreMap.merge(PreferenceType.FLEXIBLE_MOVER, 2, Integer::sum);
                }
            }

            case SACRIFICE_PRIORITY -> {
                if (option == PreferenceOption.SACRIFICE_COST) {
                    scoreMap.merge(PreferenceType.OPPORTUNITY_SEEKER, 1, Integer::sum);
                } else if (option == PreferenceOption.SACRIFICE_LOCATION) {
                    scoreMap.merge(PreferenceType.COST_CONSERVATIVE, 1, Integer::sum);
                }
            }
        }
    }
}