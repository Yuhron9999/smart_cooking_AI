package com.smartcooking.ai.controller;

import com.smartcooking.ai.entity.LearningPath;
import com.smartcooking.ai.entity.LearningPathStep;
import com.smartcooking.ai.entity.UserLearningProgress;
import com.smartcooking.ai.service.LearningService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Learning Controller - REST API cho hệ thống học nấu ăn
 */
@RestController
@RequestMapping("/api/learning")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class LearningController {

    private final LearningService learningService;

    // Learning Path endpoints
    /**
     * Tạo learning path mới
     */
    @PostMapping("/paths")
    public ResponseEntity<LearningPath> createLearningPath(@RequestBody LearningPath learningPath,
            @RequestParam Long creatorId) {
        try {
            LearningPath created = learningService.createLearningPath(learningPath, creatorId);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            log.error("Error creating learning path: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy learning path theo ID
     */
    @GetMapping("/paths/{id}")
    public ResponseEntity<LearningPath> getLearningPathById(@PathVariable Long id) {
        return learningService.getLearningPathById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cập nhật learning path
     */
    @PutMapping("/paths/{id}")
    public ResponseEntity<LearningPath> updateLearningPath(@PathVariable Long id,
            @RequestBody LearningPath updates,
            @RequestParam Long userId) {
        try {
            LearningPath updated = learningService.updateLearningPath(id, updates, userId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Error updating learning path: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Xóa learning path
     */
    @DeleteMapping("/paths/{id}")
    public ResponseEntity<Void> deleteLearningPath(@PathVariable Long id, @RequestParam Long userId) {
        try {
            learningService.deleteLearningPath(id, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting learning path: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy active learning paths
     */
    @GetMapping("/paths/active")
    public ResponseEntity<List<LearningPath>> getActiveLearningPaths() {
        List<LearningPath> paths = learningService.getActiveLearningPaths();
        return ResponseEntity.ok(paths);
    }

    /**
     * Lấy learning paths theo difficulty
     */
    @GetMapping("/paths/difficulty/{difficulty}")
    public ResponseEntity<List<LearningPath>> getLearningPathsByDifficulty(@PathVariable String difficulty) {
        try {
            LearningPath.DifficultyLevel difficultyLevel = LearningPath.DifficultyLevel
                    .valueOf(difficulty.toUpperCase());
            List<LearningPath> paths = learningService.getLearningPathsByDifficulty(difficultyLevel);
            return ResponseEntity.ok(paths);
        } catch (Exception e) {
            log.error("Error getting learning paths by difficulty: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy learning paths theo creator
     */
    @GetMapping("/paths/creator/{creatorId}")
    public ResponseEntity<List<LearningPath>> getLearningPathsByCreator(@PathVariable Long creatorId) {
        List<LearningPath> paths = learningService.getLearningPathsByCreator(creatorId);
        return ResponseEntity.ok(paths);
    }

    /**
     * Search learning paths
     */
    @GetMapping("/paths/search")
    public ResponseEntity<Page<LearningPath>> searchLearningPaths(@RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<LearningPath> paths = learningService.searchLearningPaths(keyword, pageable);
        return ResponseEntity.ok(paths);
    }

    // Learning Path Step endpoints
    /**
     * Thêm step vào learning path
     */
    @PostMapping("/paths/{pathId}/steps")
    public ResponseEntity<LearningPathStep> addStepToPath(@PathVariable Long pathId,
            @RequestBody LearningPathStep step,
            @RequestParam Long userId) {
        try {
            LearningPathStep created = learningService.addStepToPath(pathId, step, userId);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            log.error("Error adding step to learning path: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy steps của learning path
     */
    @GetMapping("/paths/{pathId}/steps")
    public ResponseEntity<List<LearningPathStep>> getStepsByPath(@PathVariable Long pathId) {
        List<LearningPathStep> steps = learningService.getStepsByPath(pathId);
        return ResponseEntity.ok(steps);
    }

    /**
     * Cập nhật step
     */
    @PutMapping("/paths/{pathId}/steps/{stepId}")
    public ResponseEntity<LearningPathStep> updateStep(@PathVariable Long pathId,
            @PathVariable Long stepId,
            @RequestBody LearningPathStep updates,
            @RequestParam Long userId) {
        try {
            LearningPathStep updated = learningService.updateStep(stepId, updates, userId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Error updating learning path step: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Xóa step
     */
    @DeleteMapping("/paths/{pathId}/steps/{stepId}")
    public ResponseEntity<Void> deleteStep(@PathVariable Long pathId,
            @PathVariable Long stepId,
            @RequestParam Long userId) {
        try {
            learningService.deleteStep(stepId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting learning path step: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // User Progress endpoints
    /**
     * Enroll user vào learning path
     */
    @PostMapping("/paths/{pathId}/enroll")
    public ResponseEntity<UserLearningProgress> enrollUserInPath(@PathVariable Long pathId, @RequestParam Long userId) {
        try {
            UserLearningProgress progress = learningService.enrollUserInPath(userId, pathId);
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            log.error("Error enrolling user in learning path: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Cập nhật progress
     */
    @PutMapping("/progress/{progressId}")
    public ResponseEntity<UserLearningProgress> updateProgress(@PathVariable Long progressId,
            @RequestParam Integer completedSteps,
            @RequestParam Double progressPercent,
            @RequestParam Long userId) {
        try {
            UserLearningProgress updated = learningService.updateProgress(progressId, completedSteps, progressPercent,
                    userId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Error updating learning progress: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Complete step
     */
    @PostMapping("/progress/{progressId}/complete-step")
    public ResponseEntity<UserLearningProgress> completeStep(@PathVariable Long progressId,
            @RequestParam Long stepId,
            @RequestParam Long userId) {
        try {
            UserLearningProgress updated = learningService.completeStep(progressId, stepId, userId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Error completing step: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Complete learning path
     */
    @PostMapping("/progress/{progressId}/complete")
    public ResponseEntity<UserLearningProgress> completeLearningPath(@PathVariable Long progressId,
            @RequestParam Long userId) {
        try {
            UserLearningProgress completed = learningService.completeLearningPath(progressId, userId);
            return ResponseEntity.ok(completed);
        } catch (Exception e) {
            log.error("Error completing learning path: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy progress của user
     */
    @GetMapping("/progress/user/{userId}")
    public ResponseEntity<List<UserLearningProgress>> getUserProgress(@PathVariable Long userId) {
        List<UserLearningProgress> progress = learningService.getUserProgress(userId);
        return ResponseEntity.ok(progress);
    }

    /**
     * Lấy completed paths của user
     */
    @GetMapping("/progress/user/{userId}/completed")
    public ResponseEntity<List<UserLearningProgress>> getUserCompletedPaths(@PathVariable Long userId) {
        List<UserLearningProgress> completedPaths = learningService.getUserCompletedPaths(userId);
        return ResponseEntity.ok(completedPaths);
    }

    /**
     * Lấy in-progress paths của user
     */
    @GetMapping("/progress/user/{userId}/in-progress")
    public ResponseEntity<List<UserLearningProgress>> getUserInProgressPaths(@PathVariable Long userId) {
        List<UserLearningProgress> inProgressPaths = learningService.getUserInProgressPaths(userId);
        return ResponseEntity.ok(inProgressPaths);
    }

    /**
     * Lấy learning path statistics
     */
    @GetMapping("/statistics/paths")
    public ResponseEntity<LearningService.LearningPathStatistics> getLearningPathStatistics() {
        LearningService.LearningPathStatistics stats = learningService.getLearningPathStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Lấy user learning statistics
     */
    @GetMapping("/statistics/user/{userId}")
    public ResponseEntity<LearningService.UserLearningStatistics> getUserLearningStatistics(@PathVariable Long userId) {
        LearningService.UserLearningStatistics stats = learningService.getUserLearningStatistics(userId);
        return ResponseEntity.ok(stats);
    }

    /**
     * Lấy popular learning paths
     */
    @GetMapping("/paths/popular")
    public ResponseEntity<List<LearningPath>> getPopularLearningPaths(@RequestParam(defaultValue = "10") int limit) {
        List<LearningPath> popularPaths = learningService.getPopularLearningPaths(limit);
        return ResponseEntity.ok(popularPaths);
    }

    /**
     * Gợi ý learning paths cho user
     */
    @GetMapping("/paths/recommendations/{userId}")
    public ResponseEntity<List<LearningPath>> getRecommendedPaths(@PathVariable Long userId) {
        List<LearningPath> recommendations = learningService.getRecommendedPathsForUser(userId);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Lấy learning leaderboard
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<List<LearningService.UserLearningStats>> getLearningLeaderboard(
            @RequestParam(defaultValue = "10") int limit) {
        List<LearningService.UserLearningStats> leaderboard = learningService.getLearningLeaderboard(limit);
        return ResponseEntity.ok(leaderboard);
    }

    /**
     * Export learning analytics
     */
    @GetMapping("/analytics/export")
    public ResponseEntity<Map<String, Object>> exportLearningAnalytics(@RequestParam(defaultValue = "30") int days) {
        Map<String, Object> analytics = learningService.exportLearningAnalytics(days);
        return ResponseEntity.ok(analytics);
    }

    /**
     * Lấy learning completion rate
     */
    @GetMapping("/analytics/completion-rate")
    public ResponseEntity<Map<String, Object>> getCompletionRate(@RequestParam(defaultValue = "30") int days) {
        Map<String, Object> completionRate = learningService.getCompletionRateAnalytics(days);
        return ResponseEntity.ok(completionRate);
    }

    /**
     * Health check cho learning system
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> learningHealthCheck() {
        Map<String, Object> health = learningService.getLearningSystemHealth();
        return ResponseEntity.ok(health);
    }
}
