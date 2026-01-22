package com.ssafy14.a606.domain.game.dto.response;

public class QuizAnswerResponse {

    private boolean isCorrect;
    private String correctAnswer;
    private String explanation;

    public QuizAnswerResponse(boolean isCorrect, String correctAnswer, String explanation) {
        this.isCorrect = isCorrect;
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public String getExplanation() {
        return explanation;
    }
}
