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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Learning Path entity for educational content
 */
@Entity
@Table(name = "learning_paths")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class LearningPath {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title_en", nullable = false)
    private String titleEn;

    @Column(name = "title_vi")
    private String titleVi;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "description_vi", columnDefinition = "TEXT")
    private String descriptionVi;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level", nullable = false)
    @Builder.Default
    private DifficultyLevel difficultyLevel = DifficultyLevel.BEGINNER;

    @Column(name = "estimated_hours")
    @Builder.Default
    private Integer estimatedHours = 10;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    @JsonIgnore
    private User createdBy;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @OneToMany(mappedBy = "learningPath", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("order_number ASC")
    @Builder.Default
    private List<LearningPathStep> steps = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum DifficultyLevel {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED
    }

    // Helper methods
    public void addStep(LearningPathStep step) {
        steps.add(step);
        step.setLearningPath(this);
    }

    public void removeStep(LearningPathStep step) {
        steps.remove(step);
        step.setLearningPath(null);
    }

    public String getTitle(String language) {
        return "vi".equals(language) ? titleVi : titleEn;
    }

    public String getDescription(String language) {
        return "vi".equals(language) ? descriptionVi : descriptionEn;
    }

    public Integer getTotalSteps() {
        return steps != null ? steps.size() : 0;
    }
}
