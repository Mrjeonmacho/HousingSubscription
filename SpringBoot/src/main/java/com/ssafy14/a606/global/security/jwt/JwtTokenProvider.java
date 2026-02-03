package com.ssafy14.a606.global.security.jwt;

import io.jsonwebtoken.*;
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

    // accessToken 생성 (userId, role 포함)
    public String createAccessToken(Long userId, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + props.accessExpirationMs());

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }


    // refreshToken 생성 (userId만 포함)
    public String createRefreshToken(Long userId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + props.refreshExpirationMs());

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }


    // JWT에서 userId 추출
    public Long getUserId(String token) {
        String sub = parseClaims(token).getSubject();
        try {
            return Long.valueOf(sub);
        } catch (NumberFormatException e) {
            throw new JwtException("JWT subject is not a userId");
        }
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

    // 만료/위조 등을 예외로 구분해서 밖으로 던지는 검증 메서드
    public void validateTokenOrThrow(String token)
            throws ExpiredJwtException, JwtException, IllegalArgumentException {
        parseClaims(token);
    }
}
