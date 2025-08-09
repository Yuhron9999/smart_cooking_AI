package com.smartcooking.ai.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_progress", indexes = {
        @Index(name = "idx_learning_progress_user_id", columnList = "user_id"),
        @Index(name = "idx_learning_progress_skill_level", columnList = "current_skill_level"),
        @Index(name = "idx_learning_progress_completion", columnList = "completion_percentage")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class LearningProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "completed_lessons", nullable = false)
    private Integer completedLessons = 0;

    @Column(name = "total_lessons", nullable = false)
    private Integer totalLessons = 20;

    @Column(name = "completion_percentage")
    private Double completionPercentage = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_skill_level", length = 20)
    private SkillLevel currentSkillLevel = SkillLevel.BEGINNER;

    @Column(name = "current_lesson_id")
    private Long currentLessonId;

    @Column(name = "learning_streak_days")
    private Integer learningStreakDays = 0;

    @Column(name = "total_learning_time_minutes")
    private Integer totalLearningTimeMinutes = 0;

    @Column(name = "achievements", columnDefinition = "JSON")
    private String achievements = "[]"; // JSON array of achievement IDs

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enum for skill levels
    public enum SkillLevel {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED,
        EXPERT
    }

    // Helper method to calculate completion percentage
    @PrePersist
    @PreUpdate
    private void calculateCompletion() {
        if (totalLessons != null && totalLessons > 0 && completedLessons != null) {
            this.completionPercentage = (completedLessons.doubleValue() / totalLessons.doubleValue()) * 100.0;
        }
    }
}
