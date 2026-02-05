package com.ssafy14.a606.global.security.oauth.user;

import java.util.Map;

public class GoogleUserInfo {

    private final Map<String, Object> attributes;

    public GoogleUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    // Goolgle OAuth 고유 사용자 ID
    public String getProviderId(){
        Object sub = attributes.get("sub");
        return sub == null ? null : sub.toString();
    }

    // 이메일
    public String getEmail(){
        Object email = attributes.get("email");
        return email == null ? null : email.toString();
    }

    // 사용자 이름
    public String getName(){
        Object name = attributes.get("name");
        return name == null ? null : name.toString();
    }

}
