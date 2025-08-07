package com.smartcooking.backend.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.smartcooking.backend.entity.UserPreference;
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

    /**
     * Chuyển đổi Entity thành DTO
     */
    public static UserPreferenceDTO fromEntity(UserPreference entity) {
        return UserPreferenceDTO.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .languagePreference(entity.getLanguagePreference())
                .cuisinePreferences(entity.getCuisinePreferences())
                .dietaryPreferences(entity.getDietaryPreferences())
                .likedIngredients(entity.getLikedIngredients())
                .dislikedIngredients(entity.getDislikedIngredients())
                .spicePreference(entity.getSpicePreference().name())
                .aiAssistantEnabled(entity.getAiAssistantEnabled())
                .preferredAiModel(entity.getPreferredAiModel())
                .darkMode(entity.getDarkMode())
                .personalizationLevel(entity.getPersonalizationLevel())
                .enableRecommendations(entity.getEnableRecommendations())
                .dynamicPreferences(entity.getDynamicPreferences())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    /**
     * Chuyển đổi DTO thành Entity
     */
    public UserPreference toEntity() {
        return UserPreference.builder()
                .id(this.id)
                .userId(this.userId)
                .languagePreference(this.languagePreference)
                .cuisinePreferences(this.cuisinePreferences)
                .dietaryPreferences(this.dietaryPreferences)
                .likedIngredients(this.likedIngredients)
                .dislikedIngredients(this.dislikedIngredients)
                .spicePreference(UserPreference.SpiceLevel.valueOf(this.spicePreference))
                .aiAssistantEnabled(this.aiAssistantEnabled)
                .preferredAiModel(this.preferredAiModel)
                .darkMode(this.darkMode)
                .personalizationLevel(this.personalizationLevel)
                .enableRecommendations(this.enableRecommendations)
                .dynamicPreferences(this.dynamicPreferences)
                .build();
    }
}
