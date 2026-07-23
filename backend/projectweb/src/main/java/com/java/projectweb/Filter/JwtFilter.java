package com.java.projectweb.Filter;

import com.java.projectweb.Service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        System.out.println("AUTH HEADER: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtService.validate(token)) {
                String email = jwtService.extractEmail(token);

                // Lấy quyền thực tế từ token
                List<SimpleGrantedAuthority> authorities = jwtService.extractAuthorities(token);
                System.out.println("AUTHORITIES: " + authorities);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                authorities // <--- Đã có authorities hợp lệ
                        );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        System.out.println("METHOD = " + request.getMethod());
        System.out.println("URI = " + request.getRequestURI());

        filterChain.doFilter(request, response);
    }
}