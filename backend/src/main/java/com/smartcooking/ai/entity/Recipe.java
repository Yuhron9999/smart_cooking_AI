package com.smartcooking.ai.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Recipe entity với multilingual support
 * 
 * Bao gồm:
 * - Multilingual content (title_vi, title_en, etc.)
 * - Ingredients và instructions
 * - Nutrition information
 * - Rating và review system
 * - Location tagging cho regional recipes
 * - AI generation metadata
 */
@Entity
@Table(name = "recipes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Multilingual titles
    @Column(name = "title_vi", nullable = false)
    private String titleVi;

    @Column(name = "title_en")
    private String titleEn;

    // Multilingual descriptions
    @Column(name = "description_vi", columnDefinition = "TEXT")
    private String descriptionVi;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "cooking_time", nullable = false)
    private Integer cookingTime; // in minutes

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Difficulty difficulty = Difficulty.MEDIUM;

    @Builder.Default
    private Integer servings = 4;

    private Integer calories;

    // Location information for regional recipes
    private Double latitude;
    private Double longitude;

    @Column(name = "origin_region")
    private String originRegion;

    @Column(name = "location_tag")
    private String locationTag;

    @Column(name = "is_public")
    @Builder.Default
    private Boolean isPublic = true;

    // Relationship with User (author)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    @JsonIgnore
    private User author;

    // Relationship with Category
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    // Many-to-Many with Users (favorites)
    @ManyToMany(mappedBy = "favoriteRecipes", fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private Set<User> favoriteByUsers = new HashSet<>();

    // One-to-Many relationships
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<RecipeIngredient> ingredients = new ArrayList<>();

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("stepNumber ASC")
    @Builder.Default
    private List<RecipeInstruction> instructions = new ArrayList<>();

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<RecipeRating> ratings = new ArrayList<>();

    // Calculated fields
    @Column(name = "average_rating", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Column(name = "total_ratings")
    @Builder.Default
    private Integer totalRatings = 0;

    @Builder.Default
    private Integer views = 0;

    @Builder.Default
    private Integer favorites = 0;

    // AI Generation metadata
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Source source = Source.USER;

    @Column(name = "ai_prompt", columnDefinition = "TEXT")
    private String aiPrompt;

    @Column(name = "ai_model")
    private String aiModel;

    @Column(name = "ai_confidence", precision = 3, scale = 2)
    private BigDecimal aiConfidence;

    // Audit fields
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums
    public enum Difficulty {
        EASY, MEDIUM, HARD
    }

    public enum Source {
        USER, AI_GENERATED, IMPORTED
    }

    // Helper methods
    public void addIngredient(RecipeIngredient ingredient) {
        ingredients.add(ingredient);
        ingredient.setRecipe(this);
    }

    public void addInstruction(RecipeInstruction instruction) {
        instructions.add(instruction);
        instruction.setRecipe(this);
    }

    public void addRating(RecipeRating rating) {
        ratings.add(rating);
        rating.setRecipe(this);
        calculateAverageRating();
    }

    public void calculateAverageRating() {
        if (ratings.isEmpty()) {
            this.averageRating = BigDecimal.ZERO;
            this.totalRatings = 0;
        } else {
            double sum = ratings.stream()
                    .mapToInt(RecipeRating::getRating)
                    .average()
                    .orElse(0.0);
            this.averageRating = BigDecimal.valueOf(sum).setScale(2, RoundingMode.HALF_UP);
            this.totalRatings = ratings.size();
        }
    }

    public void incrementViews() {
        this.views++;
    }

    public void incrementFavorites() {
        this.favorites++;
    }

    public void decrementFavorites() {
        if (this.favorites > 0) {
            this.favorites--;
        }
    }

    // Get title based on language
    public String getTitle(String language) {
        if ("en".equals(language) && titleEn != null) {
            return titleEn;
        }
        return titleVi; // Default to Vietnamese
    }

    // Get description based on language
    public String getDescription(String language) {
        if ("en".equals(language) && descriptionEn != null) {
            return descriptionEn;
        }
        return descriptionVi; // Default to Vietnamese
    }
}
