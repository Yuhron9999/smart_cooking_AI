package com.smartcooking.backend.entity;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity để lưu trữ và theo dõi tương tác của người dùng với AI
 * Mỗi record sẽ đại diện cho một lần tương tác giữa người dùng và AI
 */
@Entity
@Table(name = "user_ai_interaction")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class UserAiInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 4000)
    private String input;

    @Column(nullable = false, length = 8000)
    private String output;

    @Enumerated(EnumType.STRING)
    @Column(name = "ai_type", nullable = false)
    private AIType aiType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "json")
    private JsonNode metadata;

    @Column(name = "execution_time_ms")
    private Integer executionTimeMs;

    @Column(name = "tokens_used")
    private Integer tokensUsed;

    @Column(name = "cost_usd", precision = 10, scale = 2)
    private BigDecimal costUsd;

    @Column(name = "success")
    private Boolean success;

    @Column(name = "error_message")
    private String errorMessage;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Loại AI sử dụng cho tương tác
     */
    public enum AIType {
        GPT, // OpenAI GPT models
        GEMINI, // Google Gemini models
        VOICE, // Voice assistants/STT/TTS
        VISION // Image recognition/processing
    }
}
