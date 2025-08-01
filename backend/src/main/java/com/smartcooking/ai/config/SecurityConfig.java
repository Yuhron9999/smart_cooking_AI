package com.smartcooking.ai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

/**
 * Security Configuration
 * Defines security-related beans for the application
 */
@Configuration
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
}
