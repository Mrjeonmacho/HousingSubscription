package com.ssafy14.a606.domain.game.service;

import com.ssafy14.a606.domain.game.dto.request.QuizAnswerRequest;
import com.ssafy14.a606.domain.game.dto.response.QuizAnswerResponse;
import com.ssafy14.a606.domain.game.entity.QuizOption;
import com.ssafy14.a606.domain.game.entity.QuizQuestion;
import com.ssafy14.a606.domain.game.repository.QuizOptionRepository;
import com.ssafy14.a606.domain.game.repository.QuizQuestionRepository;
import com.ssafy14.a606.domain.game.dto.response.QuizQuestionResponse;

import com.ssafy14.a606.global.exceptions.InvalidValueException;
import com.ssafy14.a606.global.exceptions.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class QuizService {

    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizOptionRepository quizOptionRepository;

    public QuizService(
            QuizQuestionRepository quizQuestionRepository,
            QuizOptionRepository quizOptionRepository
    ) {
        this.quizQuestionRepository = quizQuestionRepository;
        this.quizOptionRepository = quizOptionRepository;
    }

    /**
     * 퀴즈 시작
     */
    public List<QuizQuestionResponse> getRandomQuizQuestions() {
        return quizQuestionRepository.findRandom10Questions()
                .stream()
                .map(QuizQuestionResponse::from)
                .toList();
    }

    /**
     * 정답 제출
     */
    @Transactional
    public QuizAnswerResponse submitAnswer(QuizAnswerRequest request) {

        QuizOption option = quizOptionRepository.findById(request.getSelectedOptionId())
                .orElseThrow(() -> new InvalidValueException("유효하지 않은 보기입니다."));

        QuizQuestion question = option.getQuestion();

        boolean isCorrect = option.isCorrect();

        return new QuizAnswerResponse(
                isCorrect,
                getCorrectAnswer(question),
                question.getExplanation()
        );
    }

    private String getCorrectAnswer(QuizQuestion question) {
        return question.getOptions().stream()
                .filter(QuizOption::isCorrect)
                .findFirst()
                .map(QuizOption::getOptionText)
                .orElse("정답 없음");
    }
}


