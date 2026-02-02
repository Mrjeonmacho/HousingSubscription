package com.ssafy14.a606.domain.user.dto.request;

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
public class UserDetailsRequestDto {

    private LocalDate birthDate;
    private TargetType targetType;
    private MarriageStatus marriageStatus;
    private Integer childCount;
    private HouseOwn houseOwn;
    private Long asset;
    private Long income;

}
