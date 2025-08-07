package com.smartcooking.backend.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.smartcooking.backend.entity.UserAiInteraction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO để truyền và nhận dữ liệu về tương tác AI của người dùng
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAiInteractionDTO {
    private Long id;
    private Long userId;
    private String input;
    private String output;
    private String aiType; // GPT, GEMINI, VOICE, VISION
    private JsonNode metadata;
    private Integer executionTimeMs;
    private Integer tokensUsed;
    private BigDecimal costUsd;
    private Boolean success;
    private String errorMessage;
    private LocalDateTime createdAt;

    /**
     * Chuyển đổi Entity thành DTO
     */
    public static UserAiInteractionDTO fromEntity(UserAiInteraction entity) {
        return UserAiInteractionDTO.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .input(entity.getInput())
                .output(entity.getOutput())
                .aiType(entity.getAiType().name())
                .metadata(entity.getMetadata())
                .executionTimeMs(entity.getExecutionTimeMs())
                .tokensUsed(entity.getTokensUsed())
                .costUsd(entity.getCostUsd())
                .success(entity.getSuccess())
                .errorMessage(entity.getErrorMessage())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    /**
     * Chuyển đổi DTO thành Entity
     */
    public UserAiInteraction toEntity() {
        return UserAiInteraction.builder()
                .id(this.id)
                .userId(this.userId)
                .input(this.input)
                .output(this.output)
                .aiType(UserAiInteraction.AIType.valueOf(this.aiType))
                .metadata(this.metadata)
                .executionTimeMs(this.executionTimeMs)
                .tokensUsed(this.tokensUsed)
                .costUsd(this.costUsd)
                .success(this.success)
                .errorMessage(this.errorMessage)
                .build();
    }
}
