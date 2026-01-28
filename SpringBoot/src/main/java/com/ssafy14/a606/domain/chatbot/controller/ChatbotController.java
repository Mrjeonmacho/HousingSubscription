package com.ssafy14.a606.domain.chatbot.controller;

import com.ssafy14.a606.domain.chatbot.dto.request.ChatbotRequestDto;
import com.ssafy14.a606.domain.chatbot.dto.response.ChatbotResponseDto;
import com.ssafy14.a606.domain.chatbot.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/chat")
    public Mono<ChatbotResponseDto> chat(@RequestBody ChatbotRequestDto requestDto) {
        return chatbotService.getResponse(requestDto);
    }
}