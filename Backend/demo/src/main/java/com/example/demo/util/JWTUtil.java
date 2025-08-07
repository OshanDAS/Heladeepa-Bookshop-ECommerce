package com.example.demo.util;

import com.example.demo.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.*;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JWTUtil {
    @Value("${JWT_SECRET}")
    private String SECRET;

    @Value("${jwt_access_expiration}")
    private long accessTokenExpiration;

    @Value("${jwt_refresh_expiration}")
    private long refreshTokenExpiration;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateAccessToken(UserDetails userDetails) {
        User user = (User) userDetails;
        String Username = userDetails.getUsername();
        String role = userDetails.getAuthorities().toString();
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("name",user.getName());
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(Username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+accessTokenExpiration))
                .signWith(getSigningKey(),SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(UserDetails userDetails) {
        String Username = userDetails.getUsername();
        return Jwts.builder()
                .setSubject(Username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+refreshTokenExpiration))
                .signWith(getSigningKey(),SignatureAlgorithm.HS256)
                .compact();
    }



    public String extractUsername(String token) {
        return extractClaim(token,Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token , claims -> claims.get("role",String.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // ✅ Extract specific claim
    public <T> T extractClaim(String token, ClaimsResolver<T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.resolve(claims);
    }

    // ✅ Parse JWT token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public interface ClaimsResolver<T> {
        T resolve(Claims claims);
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
}
