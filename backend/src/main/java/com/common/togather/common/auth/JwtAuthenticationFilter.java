package com.common.togather.common.auth;

import com.common.togather.common.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final MemberDetailService memberDetailService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        // 요청에 Authorization 헤더가 존재하고 Bearer일때
        if(authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            email = jwtUtil.getEmailFromToken(token); // 토큰에서 이메일 추출
        }

        // 이메일이 존재하고, 인증 정보는 없다면
        if(email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            var memberDetails = memberDetailService.loadUserByUsername(email);

            if(jwtUtil.isAccessToken(token)&&jwtUtil.validateToken(token)){
                // 인증 객체 생성
                var authToken = new UsernamePasswordAuthenticationToken(memberDetails, null, memberDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        }

        filterChain.doFilter(request, response);

    }

}
