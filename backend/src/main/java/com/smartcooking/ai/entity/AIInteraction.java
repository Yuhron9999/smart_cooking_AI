package com.smartcooking.ai.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * AI Interaction entity for tracking and analytics
 */
@Entity
@Table(name = "ai_interactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class AIInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "interaction_type", nullable = false)
    private InteractionType interactionType;

    @Column(columnDefinition = "TEXT")
    private String inputData;

    @Column(columnDefinition = "TEXT")
    private String outputData;

    @Column(name = "user_language", length = 10)
    @Builder.Default
    private String userLanguage = "vi";

    @Column(name = "response_language", length = 10)
    @Builder.Default
    private String responseLanguage = "vi";

    @Column(name = "processing_time_ms")
    private Integer processingTimeMs;

    @Column(name = "success")
    @Builder.Default
    private Boolean success = true;

    @Column(name = "error_message")
    private String errorMessage;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum InteractionType {
        CHAT,
        RECIPE_GENERATION,
        IMAGE_RECOGNITION,
        VOICE_STT,
        VOICE_TTS,
        NUTRITION_ANALYSIS,
        MEAL_PLANNING
    }
}
