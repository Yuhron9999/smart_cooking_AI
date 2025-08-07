package com.smartcooking.backend.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho các yêu cầu tạo nội dung bằng AI
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiGenerationRequestDTO {
    private Long userId;
    private String prompt;
    private String aiModel;
    private String generationType; // RECIPE, MEAL_PLAN, INSTRUCTION, DESCRIPTION
    private JsonNode parameters;
    private String languageCode;
    private Boolean includeDietaryRestrictions;
    private Boolean includePreferences;
    private Integer maxTokens;
    private Float temperature;
}
