package com.ssafy14.a606.domain.user.dto.response;

import com.ssafy14.a606.domain.user.entity.HouseOwn;
import com.ssafy14.a606.domain.user.entity.MarriageStatus;
import com.ssafy14.a606.domain.user.entity.TargetType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDetailsResponseDto {
    private LocalDate birthDate;
    private Integer age; // 만 나이 (계산값)
    private TargetType targetType;
    private MarriageStatus marriageStatus;
    private Integer childCount;
    private HouseOwn houseOwn;
    private Long asset;
    private Long income;
}
