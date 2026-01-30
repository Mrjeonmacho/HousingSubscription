package com.ssafy14.a606.global.security.jwt;

import com.ssafy14.a606.global.security.user.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Authorization 헤더에서 토큰 추출
        String token = resolveToken(request);

        // 2. 토큰이 없으면 인증 시도 없이 통과
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. 토큰 유효성 검증 (유효하지 않으면 인증 없이 통과)
        jwtTokenProvider.validateTokenOrThrow(token);

        // 이미 인증이 들어있으면 중복 세팅 방지
        if (SecurityContextHolder.getContext().getAuthentication() == null) {

            // 4. JWT에서 loginId 추출
            String loginId = jwtTokenProvider.getLoginId(token);

            // 5. DB에서 UserDetails로 조회
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(loginId);

            // 6. UserDetails 기반으로 Authentication 생성
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // 7. SecurityContextHolder에 주입
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // 8. 다음 필터로 진행
        filterChain.doFilter(request, response);
    }

    // Authorization 헤더에서 Bearer Token 추출
    private String resolveToken(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith("Bearer ")) return null;
        return header.substring(7);
    }
}
