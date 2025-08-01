package com.smartcooking.ai.controller;

import com.smartcooking.ai.entity.AIInteraction;
import com.smartcooking.ai.service.AIInteractionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * AI Interaction Controller - REST API cho analytics và AI interaction tracking
 */
@RestController
@RequestMapping("/api/ai-interactions")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class AIInteractionController {

    private final AIInteractionService aiInteractionService;

    /**
     * Tạo AI interaction mới
     */
    @PostMapping
    public ResponseEntity<AIInteraction> createInteraction(@RequestBody AIInteraction interaction) {
        try {
            AIInteraction created = aiInteractionService.createInteraction(interaction);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            log.error("Error creating AI interaction: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy AI interaction theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<AIInteraction> getInteractionById(@PathVariable Long id) {
        return aiInteractionService.getInteractionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Lấy interactions của user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AIInteraction>> getInteractionsByUserId(@PathVariable Long userId) {
        List<AIInteraction> interactions = aiInteractionService.getInteractionsByUserId(userId);
        return ResponseEntity.ok(interactions);
    }

    /**
     * Lấy interactions theo type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<AIInteraction>> getInteractionsByType(@PathVariable String type) {
        try {
            AIInteraction.InteractionType interactionType = AIInteraction.InteractionType.valueOf(type.toUpperCase());
            List<AIInteraction> interactions = aiInteractionService.getInteractionsByType(interactionType);
            return ResponseEntity.ok(interactions);
        } catch (Exception e) {
            log.error("Error getting interactions by type: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy interactions trong khoảng thời gian
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<AIInteraction>> getInteractionsByDateRange(@RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            List<AIInteraction> interactions = aiInteractionService.getInteractionsByDateRange(start, end);
            return ResponseEntity.ok(interactions);
        } catch (Exception e) {
            log.error("Error getting interactions by date range: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy recent interactions với pagination
     */
    @GetMapping("/recent")
    public ResponseEntity<Page<AIInteraction>> getRecentInteractions(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AIInteraction> interactions = aiInteractionService.getRecentInteractions(pageable);
        return ResponseEntity.ok(interactions);
    }

    /**
     * Lấy interactions theo language
     */
    @GetMapping("/language/{language}")
    public ResponseEntity<List<AIInteraction>> getInteractionsByLanguage(@PathVariable String language) {
        List<AIInteraction> interactions = aiInteractionService.getInteractionsByLanguage(language);
        return ResponseEntity.ok(interactions);
    }

    /**
     * Lấy slow interactions (cho performance monitoring)
     */
    @GetMapping("/slow")
    public ResponseEntity<List<AIInteraction>> getSlowInteractions(
            @RequestParam(defaultValue = "5000") Long thresholdMs) {
        List<AIInteraction> interactions = aiInteractionService.getSlowInteractions(thresholdMs);
        return ResponseEntity.ok(interactions);
    }

    /**
     * Lấy daily interaction statistics
     */
    @GetMapping("/statistics/daily")
    public ResponseEntity<List<AIInteractionService.DailyStatistics>> getDailyStatistics(
            @RequestParam(defaultValue = "30") int days) {
        List<AIInteractionService.DailyStatistics> stats = aiInteractionService.getDailyStatistics(days);
        return ResponseEntity.ok(stats);
    }

    /**
     * Lấy user interaction statistics
     */
    @GetMapping("/statistics/user/{userId}")
    public ResponseEntity<AIInteractionService.UserStatistics> getUserStatistics(@PathVariable Long userId) {
        AIInteractionService.UserStatistics stats = aiInteractionService.getUserStatistics(userId);
        return ResponseEntity.ok(stats);
    }

    /**
     * Lấy interaction type statistics
     */
    @GetMapping("/statistics/types")
    public ResponseEntity<List<AIInteractionService.TypeStatistics>> getTypeStatistics() {
        List<AIInteractionService.TypeStatistics> stats = aiInteractionService.getTypeStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Lấy language usage statistics
     */
    @GetMapping("/statistics/languages")
    public ResponseEntity<List<AIInteractionService.LanguageStatistics>> getLanguageStatistics() {
        List<AIInteractionService.LanguageStatistics> stats = aiInteractionService.getLanguageStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Lấy performance statistics
     */
    @GetMapping("/statistics/performance")
    public ResponseEntity<AIInteractionService.PerformanceStatistics> getPerformanceStatistics() {
        AIInteractionService.PerformanceStatistics stats = aiInteractionService.getPerformanceStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Lấy top active users
     */
    @GetMapping("/statistics/top-users")
    public ResponseEntity<List<AIInteractionService.UserActivityStats>> getTopActiveUsers(
            @RequestParam(defaultValue = "10") int limit) {
        List<AIInteractionService.UserActivityStats> stats = aiInteractionService.getTopActiveUsers(limit);
        return ResponseEntity.ok(stats);
    }

    /**
     * Lấy engagement metrics cho Looker Studio
     */
    @GetMapping("/analytics/engagement")
    public ResponseEntity<Map<String, Object>> getEngagementMetrics(@RequestParam(defaultValue = "30") int days) {
        Map<String, Object> metrics = aiInteractionService.getEngagementMetrics(days);
        return ResponseEntity.ok(metrics);
    }

    /**
     * Lấy conversion metrics cho Looker Studio
     */
    @GetMapping("/analytics/conversion")
    public ResponseEntity<Map<String, Object>> getConversionMetrics(@RequestParam(defaultValue = "30") int days) {
        Map<String, Object> metrics = aiInteractionService.getConversionMetrics(days);
        return ResponseEntity.ok(metrics);
    }

    /**
     * Lấy AI model performance metrics
     */
    @GetMapping("/analytics/model-performance")
    public ResponseEntity<Map<String, Object>> getModelPerformanceMetrics(@RequestParam(defaultValue = "30") int days) {
        Map<String, Object> metrics = aiInteractionService.getModelPerformanceMetrics(days);
        return ResponseEntity.ok(metrics);
    }

    /**
     * Lấy error analytics
     */
    @GetMapping("/analytics/errors")
    public ResponseEntity<Map<String, Object>> getErrorAnalytics(@RequestParam(defaultValue = "30") int days) {
        Map<String, Object> analytics = aiInteractionService.getErrorAnalytics(days);
        return ResponseEntity.ok(analytics);
    }

    /**
     * Export analytics data cho Looker Studio
     */
    @GetMapping("/export/looker-studio")
    public ResponseEntity<Map<String, Object>> exportForLookerStudio(@RequestParam(defaultValue = "30") int days) {
        Map<String, Object> data = aiInteractionService.exportForLookerStudio(days);
        return ResponseEntity.ok(data);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = aiInteractionService.getHealthMetrics();
        return ResponseEntity.ok(health);
    }

    /**
     * Xóa old interactions (cleanup)
     */
    @DeleteMapping("/cleanup")
    public ResponseEntity<Map<String, Object>> cleanupOldInteractions(
            @RequestParam(defaultValue = "90") int olderThanDays) {
        try {
            int deletedCount = aiInteractionService.cleanupOldInteractions(olderThanDays);
            return ResponseEntity.ok(Map.of(
                    "message", "Cleanup completed successfully",
                    "deletedCount", deletedCount,
                    "olderThanDays", olderThanDays));
        } catch (Exception e) {
            log.error("Error during cleanup: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Cleanup failed: " + e.getMessage()));
        }
    }
}
