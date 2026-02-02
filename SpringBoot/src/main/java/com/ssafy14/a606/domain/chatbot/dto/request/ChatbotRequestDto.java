package com.ssafy14.a606.domain.chatbot.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatbotRequestDto {
    private String message;
    private String noticeNo;
}
