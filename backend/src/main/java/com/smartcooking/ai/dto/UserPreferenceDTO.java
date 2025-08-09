package com.smartcooking.ai.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO để truyền và nhận dữ liệu tùy chọn người dùng
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferenceDTO {
    private Long id;
    private Long userId;
    private String languagePreference;
    private Set<String> cuisinePreferences;
    private Set<String> dietaryPreferences;
    private Set<String> likedIngredients;
    private Set<String> dislikedIngredients;
    private String spicePreference; // MILD, MEDIUM, HOT, EXTRA_HOT
    private Boolean aiAssistantEnabled;
    private String preferredAiModel;
    private Boolean darkMode;
    private Integer personalizationLevel;
    private Boolean enableRecommendations;
    private JsonNode dynamicPreferences;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
