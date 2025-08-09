package com.smartcooking.ai.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_preferences")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class UserPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "language_preference", length = 10)
    private String languagePreference = "vi";

    @Column(name = "serving_size_preference")
    private Integer servingSizePreference = 4;

    @Column(name = "cooking_time_preference")
    private Integer cookingTimePreference = 30;

    @Column(name = "difficulty_preference", length = 20)
    private String difficultyPreference = "MEDIUM";

    @Column(name = "calorie_goal")
    private Integer calorieGoal = 2000;

    @Column(name = "notification_settings", columnDefinition = "JSON")
    private String notificationSettings;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Index for faster queries
    @PrePersist
    @PreUpdate
    private void validate() {
        if (servingSizePreference != null && (servingSizePreference < 1 || servingSizePreference > 20)) {
            throw new IllegalArgumentException("Serving size must be between 1 and 20");
        }
        if (cookingTimePreference != null && (cookingTimePreference < 5 || cookingTimePreference > 480)) {
            throw new IllegalArgumentException("Cooking time must be between 5 and 480 minutes");
        }
        if (calorieGoal != null && (calorieGoal < 800 || calorieGoal > 5000)) {
            throw new IllegalArgumentException("Calorie goal must be between 800 and 5000");
        }
    }
}
