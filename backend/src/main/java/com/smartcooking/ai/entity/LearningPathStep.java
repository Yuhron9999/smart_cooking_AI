package com.smartcooking.ai.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Learning Path Step entity
 */
@Entity
@Table(name = "learning_path_steps")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearningPathStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learning_path_id", nullable = false)
    @JsonIgnore
    private LearningPath learningPath;

    @Column(name = "order_number", nullable = false)
    private Integer orderNumber;

    @Column(name = "title_en", nullable = false)
    private String titleEn;

    @Column(name = "title_vi")
    private String titleVi;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "description_vi", columnDefinition = "TEXT")
    private String descriptionVi;

    @Column(name = "estimated_minutes")
    @Builder.Default
    private Integer estimatedMinutes = 30;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;

    @Column(name = "content_type")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ContentType contentType = ContentType.RECIPE;

    @Column(name = "content_url")
    private String contentUrl;

    @Column(name = "is_required", nullable = false)
    @Builder.Default
    private Boolean isRequired = true;

    public enum ContentType {
        RECIPE,
        VIDEO,
        ARTICLE,
        QUIZ,
        PRACTICE
    }

    public String getTitle(String language) {
        return "vi".equals(language) ? titleVi : titleEn;
    }

    public String getDescription(String language) {
        return "vi".equals(language) ? descriptionVi : descriptionEn;
    }
}
