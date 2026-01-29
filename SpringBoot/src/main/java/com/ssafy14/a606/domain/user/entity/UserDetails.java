package com.ssafy14.a606.domain.user.entity;

import com.ssafy14.a606.domain.user.dto.request.UserDetailsRequestDto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name="user_details")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class UserDetails {

    @Id
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * Users와 1:1 관계
     * PK = FK 구조이므로 @MapsId 사용
     */
    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * 생년월일
     */
    @Column(name = "birth_date")
    private LocalDate birthDate;

    /**
     * 대상 유형(청년/대학생/신혼/기타)
     * YOUTH / STUDENT / NEWLYWED / EITHER
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", length = 20)
    private TargetType targetType;

    /**
     * 결혼 여부
     * SINGLE / MARRIED / PLANNED
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "marriage_status", length = 20)
    private MarriageStatus marriageStatus;

    /**
     * 자녀 수
     */
    @Column(name = "child_count")
    private Integer childCount;

    /**
     * 주택 보유 여부 (YES=보유, NO=미보유)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "house_own", length = 10)
    private HouseOwn houseOwn;

    /**
     * 자산 (원 단위)
     */
    @Column(name = "asset")
    private Long asset;

    /**
     * 소득 (원 단위)
     */
    @Column(name = "income")
    private Long income;

    public void update(UserDetailsRequestDto dto) {
        this.birthDate = dto.getBirthDate();
        this.targetType = dto.getTargetType();
        this.marriageStatus = dto.getMarriageStatus();
        this.childCount = dto.getChildCount();
        this.houseOwn = dto.getHouseOwn();
        this.asset = dto.getAsset();
        this.income = dto.getIncome();
    }
}
