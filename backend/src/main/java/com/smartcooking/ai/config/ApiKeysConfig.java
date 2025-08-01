package com.smartcooking.ai.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Data;

/**
 * API Keys Configuration cho Smart Cooking AI
 * 
 * Quản lý các API keys cho:
 * - OpenAI (ChatGPT API)
 * - Google API (multiple services)
 * - Gemini AI
 */
@Configuration
@ConfigurationProperties(prefix = "app")
@Data
public class ApiKeysConfig {

    private OpenAI openai = new OpenAI();
    private Google google = new Google();
    private Gemini gemini = new Gemini();
    private AiService aiService = new AiService();

    @Data
    public static class OpenAI {
        private String apiKey;
        private String model = "gpt-4";
        private Integer maxTokens = 2000;
        private Double temperature = 0.7;
    }

    @Data
    public static class Google {
        private String apiKey;
        private String clientId;
        private String clientSecret;
        private String cloudProject;
    }

    @Data
    public static class Gemini {
        private String apiKey;
        private String model = "gemini-pro";
    }

    @Data
    public static class AiService {
        private String url = "http://localhost:8001";
        private Integer timeout = 30000;
    }

    /**
     * Kiểm tra API keys có được cấu hình hay không
     */
    public boolean isOpenAIConfigured() {
        return openai.getApiKey() != null && !openai.getApiKey().isEmpty();
    }

    public boolean isGoogleConfigured() {
        return google.getApiKey() != null && !google.getApiKey().isEmpty();
    }

    public boolean isGeminiConfigured() {
        return gemini.getApiKey() != null && !gemini.getApiKey().isEmpty();
    }

    public boolean areAllKeysConfigured() {
        return isOpenAIConfigured() && isGoogleConfigured();
    }
}
