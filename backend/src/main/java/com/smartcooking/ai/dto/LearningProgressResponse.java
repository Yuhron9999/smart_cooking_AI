package com.smartcooking.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearningProgressResponse {
    private Long id;
    private Long userId;
    private Long learningPathId;
    private String learningPathTitle;
    private Integer completedLessons;
    private Integer totalLessons;
    private Double progressPercentage;
    private String currentLevel;
    private LocalDateTime lastActivity;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
