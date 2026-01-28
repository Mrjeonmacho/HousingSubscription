package com.ssafy14.a606.domain.chatbot.entity;

import jakarta.persistence.*; // Entity, Column, Id, GeneratedValue 등을 한꺼번에 포함
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Chatbot {

    @Id // jakarta.persistence.Id 인지 확인 필수!
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String answer;

    // 생성 시 현재 시간으로 자동 초기화
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder
    public Chatbot(String question, String answer) {
        this.question = question;
        this.answer = answer;
        this.createdAt = LocalDateTime.now(); // 빌더 사용 시에도 현재 시간 설정
    }
}