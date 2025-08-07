package com.example.demo.config;

import com.example.demo.filter.JWTAuthenticationFilter;
import com.example.demo.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.Customizer.withDefaults;




@Configuration
public class SecurityConfig {

    private final UserService userService;
    private final JWTAuthenticationFilter  jwtAuthenticationFilter;

    public SecurityConfig(UserService userService, JWTAuthenticationFilter jwtAuthenticationFilter) {

        this.userService = userService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/payhere/notify").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/promotions/**").permitAll() // Allow GET for everyone
                        .requestMatchers("/api/promotions/**").hasAuthority("ADMIN") // Admin only for POST, PUT, DELETE
                        .requestMatchers("/api/products/**").permitAll() // Allow access to product endpoints
                        .requestMatchers("/api/filters/**").permitAll() // Allow access to filter endpoints
                        .requestMatchers("/api/search/**").permitAll() // Allow access to search endpoints
                        .requestMatchers("/api/wishlist/**").authenticated() // Ensure user is authenticated for wishlist operations
                        .requestMatchers("/api/admin/manual-sales/").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers("/api/booklists/**").authenticated()
                        .anyRequest().authenticated()
                ).addFilterBefore(jwtAuthenticationFilter , UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return userService;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder(); 
    }
}
