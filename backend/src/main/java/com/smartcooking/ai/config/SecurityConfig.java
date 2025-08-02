package com.smartcooking.ai.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.client.RestTemplate;


/**
 * Security Configuration - Simplified for testing
 * Defines security-related beans and basic CORS for the application
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    /**
     * Password encoder bean using BCrypt
     * Used for encoding and verifying user passwords
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * RestTemplate bean for HTTP requests
     * Used for external API calls
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * Security filter chain configuration with Role-Based Access Control
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.disable())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - no authentication required
                        .requestMatchers("/auth/**", "/h2-console/**", "/swagger-ui/**", "/swagger-ui.html",
                                "/v3/api-docs/**", "/swagger-resources/**", "/webjars/**", "/api-docs/**",
                                "/actuator/**",
                                "/test/**", "/api/test/**")
                        .permitAll()

                        // Recipe endpoints - CHEF and ADMIN can CRUD
                        .requestMatchers("GET", "/recipes/**").permitAll() // Anyone can view recipes
                        .requestMatchers("POST", "/recipes/**").hasAnyRole("CHEF", "ADMIN")
                        .requestMatchers("PUT", "/recipes/**").hasAnyRole("CHEF", "ADMIN")
                        .requestMatchers("DELETE", "/recipes/**").hasAnyRole("CHEF", "ADMIN")

                        // Categories - Only ADMIN can manage
                        .requestMatchers("/categories/**").hasRole("ADMIN")

                        // User management - Only ADMIN
                        .requestMatchers("/users/**").hasRole("ADMIN")

                        // Learning paths - CHEF can create, ADMIN can manage all
                        .requestMatchers("GET", "/learning/**").hasAnyRole("USER", "CHEF", "ADMIN")
                        .requestMatchers("POST", "/learning/**").hasAnyRole("CHEF", "ADMIN")
                        .requestMatchers("PUT", "/learning/**").hasAnyRole("CHEF", "ADMIN")
                        .requestMatchers("DELETE", "/learning/**").hasRole("ADMIN")

                        // Analytics and reporting - ADMIN only
                        .requestMatchers("/analytics/**", "/reports/**").hasRole("ADMIN")

                        // AI interactions - All authenticated users
                        .requestMatchers("/ai/**").hasAnyRole("USER", "CHEF", "ADMIN")

                        // Meal plans and shopping lists - User's own data
                        .requestMatchers("/meal-plans/**", "/shopping-lists/**").hasAnyRole("USER", "CHEF", "ADMIN")

                        // All other requests require authentication
                        .anyRequest().authenticated());

        return http.build();
    }

    /**
     * CORS configuration - Disabled because WebConfig handles CORS
     */
    // @Bean
    // public CorsConfigurationSource corsConfigurationSource() {
    // CorsConfiguration configuration = new CorsConfiguration();
    // configuration.setAllowedOriginPatterns(Arrays.asList(
    // "http://localhost:3000",
    // "http://localhost:3001",
    // "http://127.0.0.1:3000",
    // "http://127.0.0.1:3001"
    // ));
    // configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE",
    // "OPTIONS"));
    // configuration.setAllowedHeaders(Arrays.asList("*"));
    // configuration.setAllowCredentials(true);
    // configuration.setMaxAge(3600L);
    //
    // UrlBasedCorsConfigurationSource source = new
    // UrlBasedCorsConfigurationSource();
    // source.registerCorsConfiguration("/**", configuration);
    // return source;
    // }
}
