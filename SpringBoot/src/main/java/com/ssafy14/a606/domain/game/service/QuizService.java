package com.ssafy14.a606.domain.game.service;

import com.ssafy14.a606.domain.game.dto.request.QuizAnswerRequest;
import com.ssafy14.a606.domain.game.dto.response.QuizAnswerResponse;
import com.ssafy14.a606.domain.game.entity.QuizQuestion;
import com.ssafy14.a606.domain.game.repository.QuizQuestionRepository;
import com.ssafy14.a606.domain.game.dto.response.QuizQuestionResponse;

import com.ssafy14.a606.global.exceptions.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class QuizService {

    private final QuizQuestionRepository quizQuestionRepository;

    public QuizService(QuizQuestionRepository quizQuestionRepository) {
        this.quizQuestionRepository = quizQuestionRepository;
    }

    /**
     * 용어 퀴즈 시작
     * - 랜덤 10문제 조회
     * - Entity → DTO 변환
     */
    public List<QuizQuestionResponse> getRandomQuizQuestions() {

        List<QuizQuestion> questions =
                quizQuestionRepository.findRandom10Questions();

        return questions.stream()
                .map(QuizQuestionResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 용어 퀴즈 정답 제출
     */
    public QuizAnswerResponse submitAnswer(QuizAnswerRequest request) {

        QuizQuestion quizQuestion = quizQuestionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new NotFoundException("유효하지 않은 문제 ID입니다."));

        String correct = normalize(quizQuestion.getAnswer());
        String userAnswer = normalize(request.getAnswer());

        boolean isCorrect = correct.equals(userAnswer);

        return new QuizAnswerResponse(
                isCorrect,
                quizQuestion.getAnswer(),
                quizQuestion.getExplanation()
        );
    }

    private String normalize(String answer) {
        return answer
                .replaceAll("\\s+", "") // 모든 공백 제거
                .toLowerCase();          // 대소문자 무시
    }


}

