package com.java.projectweb.Service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Service
public class JwtService {

    private final String SECRET =
            "12345678901234567890123456789012345678901234567890";

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // 1. Nhận thêm tham số role khi tạo Token (Ví dụ: "ROLE_USER" hoặc "ROLE_ADMIN")
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .subject(email)
                .claim("role", role) // Lưu role vào Claims
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
                .signWith(key)
                .compact();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // 2. Trích xuất Role từ Token
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // 3. Chuyển Role thành danh sách GrantedAuthority cho Spring Security
    public List<SimpleGrantedAuthority> extractAuthorities(String token) {
        String role = extractRole(token);
        if (role == null || role.isEmpty()) {
            return Collections.emptyList();
        }

        // Đảm bảo prefix ROLE_ cho Spring Security nếu cần
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        return List.of(new SimpleGrantedAuthority(role));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validate(String token) {
        try {
            Jwts.parser()
                    .verifyWith((SecretKey) key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}