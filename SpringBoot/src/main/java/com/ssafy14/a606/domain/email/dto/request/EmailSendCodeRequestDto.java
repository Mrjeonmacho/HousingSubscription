package com.ssafy14.a606.domain.email.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class EmailSendCodeRequestDto {
    private String email;
}
