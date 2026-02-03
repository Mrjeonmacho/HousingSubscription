package com.ssafy14.a606.global.security.oauth.service;

import com.ssafy14.a606.domain.user.entity.AuthType;
import com.ssafy14.a606.domain.user.entity.Role;
import com.ssafy14.a606.domain.user.entity.User;
import com.ssafy14.a606.domain.user.repository.UserRepository;
import com.ssafy14.a606.global.security.oauth.user.OAuthAttributes;
import com.ssafy14.a606.global.security.oauth.user.OAuthProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException{

        // 1) 구글/카카오에서 사용자 정보 가져오기
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 2) provider 식별
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        // 3) attributes 표준화 (providerId / email / name)
        Map<String, Object> attributes = oAuth2User.getAttributes();
        OAuthAttributes oAuthAttr = OAuthAttributes.of(registrationId, attributes);

        // 4) provider -> AuthType 매핑
        AuthType authType = toAuthType(oAuthAttr.getProvider());

        // 5) (authType, providerId)로 사용자 조회 -> 없으면 생성
        User user = userRepository.findByAuthTypeAndProviderId(authType, oAuthAttr.getProviderId())
                .orElseGet(()-> userRepository.save(
                        User.builder()
                                .authType(authType)
                                .providerId(oAuthAttr.getProviderId())
                                .loginId(null)
                                .password(null)
                                .email(oAuthAttr.getEmail())
                                .userName(oAuthAttr.getName() == null ? "소셜사용자" : oAuthAttr.getName())
                                .role(Role.USER)
                                .build()
                ));

        Long userId = user.getId();

        // 6) attributes에 userId 주입
        Map<String, Object> newAttrs = new HashMap<>(attributes);
        newAttrs.put("userId", userId);

        // 7) nameAttributeKey : provider 설정값 사용
        String nameAttributeKey = userRequest.getClientRegistration()
                .getProviderDetails()
                .getUserInfoEndpoint()
                .getUserNameAttributeName();

        log.info("OAuth2 loadUser success. provider={}, userId={}, providerId={}",
                registrationId, userId, oAuthAttr.getProviderId());


        // 8) OAuth2User 반환
        return new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_USER")),
                newAttrs,
                nameAttributeKey
        );
    }

    private AuthType toAuthType(OAuthProvider provider) {
        return switch (provider) {
            case GOOGLE -> AuthType.GOOGLE;
            case KAKAO -> AuthType.KAKAO;
        };
    }
}
