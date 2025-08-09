package com.smartcooking.ai.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_favorite_recipes", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id",
        "recipe_id" }), indexes = {
                @Index(name = "idx_user_favorite_user_id", columnList = "user_id"),
                @Index(name = "idx_user_favorite_recipe_id", columnList = "recipe_id"),
                @Index(name = "idx_user_favorite_created_at", columnList = "created_at")
        })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class UserFavoriteRecipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "recipe_id", nullable = false)
    private Long recipeId;

    @Column(name = "rating")
    private Integer rating; // 1-5 stars, optional

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes; // User's personal notes about the recipe

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    private void validate() {
        if (rating != null && (rating < 1 || rating > 5)) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
    }
}
