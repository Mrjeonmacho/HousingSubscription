package com.ssafy14.a606.domain.chatbot.service;

import com.ssafy14.a606.domain.chatbot.dto.request.ChatbotRequestDto;
import com.ssafy14.a606.domain.chatbot.dto.response.ChatbotResponseDto;
import reactor.core.publisher.Mono;

public interface ChatbotService {
    Mono<ChatbotResponseDto> getResponse(ChatbotRequestDto requestDto);
}
