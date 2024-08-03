package com.common.togather.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret.key}")
    private String secretKey;

    private SecretKey getSecretKey() {
        byte[] ketBytes = Decoders.BASE64.decode(this.secretKey);
        return Keys.hmacShaKeyFor(ketBytes);
    };

    @Value("${jwt.access.expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh.expiration}")
    private long refreshTokenExpiration;
    
    // Access Token 발급
    public String generateAccessToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+accessTokenExpiration))
                .signWith(this.getSecretKey())
                .claim("type", "access_token")
                .compact();
    }
    
    // Refresh Token 발급
    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(this.getSecretKey())
                .claim("type", "refresh_token")
                .compact();

    }
    
    // 토큰으로 email 정보 추출
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(this.getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    // Authorization 헤더로 회원 이메일 추출
    public String getAuthMemberEmail(String header){
        String token = header.substring(7);
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(this.getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            // 토큰을 파싱하여 서명과 유효성을 검증
            Jwts.parserBuilder()
                    .setSigningKey(this.getSecretKey()) // 서명 키 설정
                    .build()
                    .parseClaimsJws(token); // 토큰 파싱

            return true; // 파싱이 성공하면 true 반환
        } catch (Exception e) {
            return false; // 파싱 중 예외가 발생하면 false 반환
        }
    }


    // AccessToken인지 검사
    public boolean isAccessToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(this.getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return "access_token".equals(claims.get("type"));
    }


}
