package com.example.demo.filter;

import com.example.demo.service.UserService;
import com.example.demo.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;


import java.io.IOException;

@Component
@WebFilter("/api/**")
public class JWTAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request , HttpServletResponse response , FilterChain filterChain )
        throws ServletException, IOException{
        String authorizationHeader= request.getHeader("Authorization");
        String token = null;
        String username = null;

        if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")){
            token = authorizationHeader.substring(7);
            username = jwtUtil.extractUsername(token);
        }
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                var userDetails = userService.loadUserByUsername(username);
                if(jwtUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new
                            UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }
            }catch (UsernameNotFoundException e){
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED , e.getMessage());
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

}
