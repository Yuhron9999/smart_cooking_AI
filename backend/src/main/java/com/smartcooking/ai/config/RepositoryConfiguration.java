package com.smartcooking.ai.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

/**
 * Configuration để tách riêng JPA và Redis repositories
 * Tránh Spring Data Redis warnings về repository assignment
 */
@Configuration
@EnableJpaRepositories(basePackages = "com.smartcooking.ai.repository", repositoryImplementationPostfix = "Impl")
@EnableRedisRepositories(basePackages = "com.smartcooking.ai.repository.redis")
public class RepositoryConfiguration {
    // Configuration chỉ để tách riêng JPA và Redis repositories
    // Tất cả current repositories sẽ được treated as JPA repositories
}
