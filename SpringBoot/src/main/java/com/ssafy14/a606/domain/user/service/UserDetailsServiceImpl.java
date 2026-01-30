package com.ssafy14.a606.domain.user.service;

import com.ssafy14.a606.domain.user.dto.request.UserDetailsRequestDto;
import com.ssafy14.a606.domain.user.dto.response.UserDetailsResponseDto;
import com.ssafy14.a606.domain.user.entity.User;
import com.ssafy14.a606.domain.user.entity.UserDetails;
import com.ssafy14.a606.domain.user.repository.UserDetailsRepository;
import com.ssafy14.a606.domain.user.repository.UserRepository;
import com.ssafy14.a606.global.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserDetailsRepository userDetailsRepository;
    private final UserRepository userRepository;

    // 추가정보 조회
    @Override
    @Transactional
    public UserDetailsResponseDto getMyDetails(Long userId) {

        UserDetails details = userDetailsRepository.findById(userId)
                .orElseGet(() -> {

                    // 1) 사용자 존재 여부 확인
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));

                    // 2) details에서 row가 없으면 생성 후 반환
                    return userDetailsRepository.save(
                            UserDetails.builder()
                                    .user(user)
                                    .build()
                    );
                });

        return toResponseDto(details);
    }


    // 추가정보 수정 -> PUT (null 포함 덮어쓰기)
    @Override
    @Transactional
    public UserDetailsResponseDto updateMyDetails(Long userId, UserDetailsRequestDto requestDto) {
        UserDetails details = userDetailsRepository.findById(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));

                    return userDetailsRepository.save(
                            UserDetails.builder()
                                    .user(user)
                                    .build()
                    );
                });

        details.update(requestDto);

        return toResponseDto(details);
    }


    // ===== 변환 로직 =====
    private UserDetailsResponseDto toResponseDto(UserDetails details) {
        LocalDate birthDate = details.getBirthDate();
        Integer age = (birthDate == null) ? null : Period.between(birthDate, LocalDate.now()).getYears();

        return UserDetailsResponseDto.builder()
                .birthDate(birthDate)
                .age(age)
                .targetType(details.getTargetType())
                .marriageStatus(details.getMarriageStatus())
                .childCount(details.getChildCount())
                .houseOwn(details.getHouseOwn())
                .asset(details.getAsset())
                .income(details.getIncome())
                .build();
    }

    private UserDetailsResponseDto emptyResponseDto() {
        return UserDetailsResponseDto.builder()
                .birthDate(null)
                .age(null)
                .targetType(null)
                .marriageStatus(null)
                .childCount(null)
                .houseOwn(null)
                .asset(null)
                .income(null)
                .build();
    }



}
