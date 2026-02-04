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
            case KAKAO -> ofKakao(attributes);
            default -> throw new IllegalArgumentException("지원하지 않는 OAuth 제공자입니다.");
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

    private static OAuthAttributes ofKakao(Map<String, Object> attributes) {
        Object idObj = attributes.get("id");

        if (idObj == null) {
            throw new IllegalArgumentException("카카오 OAuth 사용자 식별자(id)가 전달되지 않았습니다.");
        }

        String providerId = String.valueOf(idObj);

        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");

        String email = null;
        String name = null;

        if (kakaoAccount != null) {
            email = (String) kakaoAccount.get("email");

            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
            if (profile != null) {
                name = (String) profile.get("nickname");
            }
        }

        return OAuthAttributes.builder()
                .provider(OAuthProvider.KAKAO)
                .providerId(providerId)
                .email(email)
                .name(name)
                .attributes(attributes)
                .build();
    }
}
