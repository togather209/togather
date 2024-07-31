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
                .compact();
    }
    
    // Refresh Token 발급
    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(this.getSecretKey())
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
    
    // 토큰 유효 검사
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder();
            return true;
        }
        catch (Exception e){
            return false;
        }
    }


}
