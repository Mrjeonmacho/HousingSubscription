package com.ssafy14.a606.global.security.oauth.user;

import java.util.Locale;

public enum OAuthProvider {

    GOOGLE,
    KAKAO;

    public static OAuthProvider fromRegistrationId(String registrationId){
        if(registrationId == null) {
            throw new IllegalArgumentException("OAuth 제공자 정보가 존재하지 않습니다.");
        }
        String id = registrationId.toLowerCase(Locale.ROOT);

        return switch(id){
            case "google" -> GOOGLE;
            case "kakao" -> KAKAO;
            default -> throw new IllegalArgumentException("지원하지 않는 OAuth 제공자입니다: " + registrationId);
        };
    }
}
