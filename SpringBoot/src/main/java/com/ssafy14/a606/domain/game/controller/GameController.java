package com.ssafy14.a606.domain.game.controller;

import com.ssafy14.a606.domain.game.dto.request.QuizAnswerRequest;
import com.ssafy14.a606.domain.game.dto.response.QuizAnswerResponse;
import com.ssafy14.a606.domain.game.dto.response.QuizQuestionResponse;
import com.ssafy14.a606.domain.game.service.QuizService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final QuizService quizService;

    public GameController(QuizService quizService) {
        this.quizService = quizService;
    }

    /**
     * 용어 퀴즈 시작 -> 랜덤 10문제 제공
     */
    @GetMapping("/quiz/start")
    public ResponseEntity<List<QuizQuestionResponse>> startQuiz() {
        List<QuizQuestionResponse> questions =
                quizService.getRandomQuizQuestions();
        return ResponseEntity.ok(questions);
    }

    /**
     * 용어 퀴즈 정답 제출
     */
    @PostMapping("/quiz/answer")
    public ResponseEntity<QuizAnswerResponse> submitAnswer(@RequestBody QuizAnswerRequest request) {
        return ResponseEntity.ok(quizService.submitAnswer(request));
    }

}
