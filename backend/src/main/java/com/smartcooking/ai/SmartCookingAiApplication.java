package com.smartcooking.ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Smart Cooking AI Backend Application
 * 
 * Hệ thống backend cho ứng dụng Smart Cooking AI
 * Sử dụng Spring Boot với các tính năng:
 * - REST API
 * - JWT Authentication
 * - Google OAuth2
 * - JPA với MySQL
 * - Redis caching
 * - AI service integration
 */
@SpringBootApplication
@EnableJpaAuditing
public class SmartCookingAiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCookingAiApplication.class, args);
    }
}
