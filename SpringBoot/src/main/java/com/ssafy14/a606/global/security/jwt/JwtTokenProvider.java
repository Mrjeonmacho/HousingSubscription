package com.ssafy14.a606.global.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final JwtProperties props;
    private final SecretKey key;

    public JwtTokenProvider(JwtProperties props) {
        this.props = props;
        byte[] keyBytes = Base64.getDecoder().decode(props.secret());
        this.key = Keys.hmacShaKeyFor(keyBytes);

    }

    // accessToken 생성 (loginId, role 포함)
    public String createAccessToken(String loginId, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + props.accessExpirationMs());

        return Jwts.builder()
                .subject(loginId)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }



    // refreshToken 생성 (loginId만 포함)
    public String createRefreshToken(String loginId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + props.refreshExpirationMs());

        return Jwts.builder()
                .subject(loginId)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }



    // JWT에서 loginId 추출
    public String getLoginId(String token) {
        return parseClaims(token).getSubject();
    }

    // JWT에서 role 추출
    public String getRole(String token) {
        return parseClaims(token).get("role", String.class);
    }


    // JWT 유효성 검증
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Claims 파싱
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
