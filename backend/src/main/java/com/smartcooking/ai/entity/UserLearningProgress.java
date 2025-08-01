package com.smartcooking.ai.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

/**
 * User Learning Progress entity
 */
@Entity
@Table(name = "user_learning_progress")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class UserLearningProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learning_path_id", nullable = false)
    private LearningPath learningPath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_step_id")
    private LearningPathStep currentStep;

    @Column(name = "completed_steps", nullable = false)
    @Builder.Default
    private Integer completedSteps = 0;

    @Column(name = "total_steps", nullable = false)
    private Integer totalSteps;

    @Column(name = "progress_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal progressPercentage = BigDecimal.ZERO;

    @Column(name = "total_time_spent_minutes")
    @Builder.Default
    private Integer totalTimeSpentMinutes = 0;

    @Column(name = "is_completed", nullable = false)
    @Builder.Default
    private Boolean isCompleted = false;

    @Column(name = "completion_date")
    private LocalDateTime completionDate;

    @CreatedDate
    @Column(name = "started_at", nullable = false, updatable = false)
    private LocalDateTime startedAt;

    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt;

    // Helper methods
    public void updateProgress() {
        if (totalSteps > 0) {
            this.progressPercentage = BigDecimal.valueOf(completedSteps)
                    .divide(BigDecimal.valueOf(totalSteps), 2, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));

            if (completedSteps >= totalSteps) {
                this.isCompleted = true;
                this.completionDate = LocalDateTime.now();
            }
        }
    }

    public void completeStep(int timeSpentMinutes) {
        this.completedSteps++;
        this.totalTimeSpentMinutes += timeSpentMinutes;
        this.lastAccessedAt = LocalDateTime.now();
        updateProgress();
    }
}
