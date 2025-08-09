package com.smartcooking.ai.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho kết quả được tạo bởi AI
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiGenerationResponseDTO {
    private String content;
    private JsonNode structuredData;
    private Integer tokensUsed;
    private Integer processingTimeMs;
    private Boolean success;
    private String errorMessage;
    private Float aiConfidence;
    private String modelUsed;
}
