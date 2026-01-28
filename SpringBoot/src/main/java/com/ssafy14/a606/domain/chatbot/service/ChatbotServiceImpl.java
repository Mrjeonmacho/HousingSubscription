package com.ssafy14.a606.domain.chatbot.service;

import com.ssafy14.a606.domain.chatbot.dto.request.ChatbotRequestDto;
import com.ssafy14.a606.domain.chatbot.dto.response.ChatbotResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ChatbotServiceImpl implements ChatbotService {

    private final WebClient webClient;

    public ChatbotServiceImpl(WebClient.Builder webClientBuilder, @Value("${fastapi.url}") String fastApiUrl) {
        this.webClient = webClientBuilder.baseUrl(fastApiUrl).build();
    }

    @Override
    public Mono<ChatbotResponseDto> getResponse(ChatbotRequestDto requestDto) {
        return webClient.post()
                .uri("/chat") // Assuming the FastAPI endpoint is /chat
                .bodyValue(requestDto)
                .retrieve()
                .bodyToMono(ChatbotResponseDto.class);
    }
}
