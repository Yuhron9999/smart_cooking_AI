package com.smartcooking.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO để truyền thông tin công thức nấu ăn
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeDTO {
    private Long id;
    private String titleVi;
    private String titleEn;
    private String descriptionVi;
    private String descriptionEn;
    private Integer cookingTime;
    private Integer servings;
    private String difficulty; // EASY, MEDIUM, HARD
    private String imageUrl;
    private Long categoryId;
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isPublic;
    private Integer calories;

    // AI-related fields
    private String aiModel;
    private String aiPrompt;
    private Float aiConfidence;
    private String source; // AI_GENERATED, USER, IMPORTED

    // Stats
    private Integer views;
    private Integer favorites;
    private Float averageRating;
    private Integer totalRatings;
}
