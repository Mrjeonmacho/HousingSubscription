package com.ssafy14.a606.domain.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class FindIdRequestDto {

    @NotBlank(message = "email은 필수입니다.")
    @Pattern(
            regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$",
            message = "email 형식이 올바르지 않습니다."
    )
    private String email;

}
