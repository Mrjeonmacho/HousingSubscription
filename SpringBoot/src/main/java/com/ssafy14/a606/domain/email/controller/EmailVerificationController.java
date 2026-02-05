package com.ssafy14.a606.domain.email.controller;

import com.ssafy14.a606.domain.email.dto.request.EmailSendCodeRequestDto;
import com.ssafy14.a606.domain.email.dto.request.EmailVerifyCodeRequestDto;
import com.ssafy14.a606.domain.email.dto.response.EmailSendCodeResponseDto;
import com.ssafy14.a606.domain.email.dto.response.EmailVerifyCodeResponseDto;
import com.ssafy14.a606.domain.email.service.EmailVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/email")
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;

    // 이메일 인증코드 발송
    @PostMapping("/code")
    public ResponseEntity<EmailSendCodeResponseDto> sendCode(
            @RequestBody EmailSendCodeRequestDto requestDto
    ) {
        return ResponseEntity.ok(
                emailVerificationService.sendSignUpCode(requestDto.getEmail())
        );
    }

    // 이메일 인증코드 검증
    @PostMapping("/verification")
    public ResponseEntity<EmailVerifyCodeResponseDto> verifyCode(
            @Valid @RequestBody EmailVerifyCodeRequestDto request
    ) {
        EmailVerifyCodeResponseDto response =
                emailVerificationService.verifyCode(request.getEmail(), request.getCode());

        return ResponseEntity.ok(response);
    }


}
