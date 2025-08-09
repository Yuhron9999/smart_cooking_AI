package com.smartcooking.ai.dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

/**
 * User Data Response DTO - Main user data container
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDataResponse {
    @JsonProperty("userId")
    private Long userId;

    @JsonProperty("profileData")
    private UserProfileResponse profileData;

    @JsonProperty("preferences")
    private UserPreferencesResponse preferences;

    @JsonProperty("cuisinePreferences")
    private List<String> cuisinePreferences;

    @JsonProperty("dietaryRestrictions")
    private List<String> dietaryRestrictions;

    @JsonProperty("createdRecipes")
    private List<RecipeResponse> createdRecipes;

    @JsonProperty("favoriteRecipes")
    private List<Long> favoriteRecipes;

    @JsonProperty("recentAiInteractions")
    private List<AiInteractionResponse> recentAiInteractions;

    @JsonProperty("learningProgress")
    private LearningProgressResponse learningProgress;

    @JsonProperty("lastUpdated")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastUpdated;
}
