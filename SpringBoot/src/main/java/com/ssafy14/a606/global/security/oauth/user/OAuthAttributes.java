package com.ssafy14.a606.global.security.oauth.user;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class OAuthAttributes {

    private OAuthProvider provider;
    private String providerId;
    private String email;
    private String name;

    private Map<String, Object> attributes;

    public static OAuthAttributes of(String registrationId, Map<String, Object> attributes){

        OAuthProvider provider = OAuthProvider.fromRegistrationId(registrationId);

        return switch (provider){
            case GOOGLE -> ofGoogle(attributes);
            case KAKAO -> throw new IllegalArgumentException("아직 구현되지 않았습니다.");
        };
    }

    private static OAuthAttributes ofGoogle(Map<String, Object> attributes) {
        GoogleUserInfo userInfo = new GoogleUserInfo(attributes);

        String providerId = userInfo.getProviderId();
        if (providerId == null || providerId.isBlank()) {
            throw new IllegalArgumentException("구글 OAuth 사용자 식별자가 전달되지 않았습니다.");
        }

        return OAuthAttributes.builder()
                .provider(OAuthProvider.GOOGLE)
                .providerId(providerId)
                .email(userInfo.getEmail())
                .name(userInfo.getName())
                .attributes(attributes)
                .build();
    }
}
