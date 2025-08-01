package com.smartcooking.ai.service;

import com.smartcooking.ai.entity.AIInteraction;
import com.smartcooking.ai.entity.User;
import com.smartcooking.ai.repository.AIInteractionRepository;
import com.smartcooking.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AIInteractionService {

    private final AIInteractionRepository aiInteractionRepository;
    private final UserRepository userRepository;

    public AIInteraction logInteraction(Long userId, AIInteraction.InteractionType type,
            String inputData, String outputData,
            String language, Integer processingTimeMs) {
        log.info("Logging AI interaction for user: {} type: {}", userId, type);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        AIInteraction interaction = AIInteraction.builder()
                .user(user)
                .interactionType(type)
                .inputData(inputData)
                .outputData(outputData)
                .userLanguage(language != null ? language : "vi")
                .processingTimeMs(processingTimeMs != null ? processingTimeMs : 0)
                .build();

        return aiInteractionRepository.save(interaction);
    }

    @Transactional(readOnly = true)
    public List<AIInteraction> getInteractionsByUser(Long userId) {
        return aiInteractionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public Optional<AIInteraction> getInteractionById(Long id) {
        return aiInteractionRepository.findById(id);
    }

    public AIInteraction createInteraction(AIInteraction interaction) {
        log.info("Creating AI interaction: {}", interaction.getInteractionType());
        return aiInteractionRepository.save(interaction);
    }

    @Transactional(readOnly = true)
    public long getTotalInteractions() {
        return aiInteractionRepository.count();
    }

    // Thêm các method còn thiếu
    @Transactional(readOnly = true)
    public List<AIInteraction> getInteractionsByUserId(Long userId) {
        return aiInteractionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<AIInteraction> getInteractionsByType(AIInteraction.InteractionType type) {
        return aiInteractionRepository.findByInteractionTypeOrderByCreatedAtDesc(type);
    }

    @Transactional(readOnly = true)
    public List<AIInteraction> getInteractionsByDateRange(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        java.time.LocalDateTime start = startDate.atStartOfDay();
        java.time.LocalDateTime end = endDate.plusDays(1).atStartOfDay();
        return aiInteractionRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<AIInteraction> getRecentInteractions(
            org.springframework.data.domain.Pageable pageable) {
        return aiInteractionRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Transactional(readOnly = true)
    public List<AIInteraction> getInteractionsByLanguage(String language) {
        return aiInteractionRepository.findByUserLanguageOrderByCreatedAtDesc(language);
    }

    @Transactional(readOnly = true)
    public List<AIInteraction> getSlowInteractions(Long thresholdMs) {
        return aiInteractionRepository.findByProcessingTimeMsGreaterThanOrderByProcessingTimeMsDesc(thresholdMs);
    }

    // Static nested classes cho statistics
    public static class DailyStatistics {
        private java.time.LocalDate date;
        private Long totalInteractions;
        private Long uniqueUsers;
        private java.util.Map<String, Long> typeBreakdown;

        public DailyStatistics(java.time.LocalDate date, Long totalInteractions, Long uniqueUsers,
                java.util.Map<String, Long> typeBreakdown) {
            this.date = date;
            this.totalInteractions = totalInteractions;
            this.uniqueUsers = uniqueUsers;
            this.typeBreakdown = typeBreakdown;
        }

        // Getters
        public java.time.LocalDate getDate() {
            return date;
        }

        public Long getTotalInteractions() {
            return totalInteractions;
        }

        public Long getUniqueUsers() {
            return uniqueUsers;
        }

        public java.util.Map<String, Long> getTypeBreakdown() {
            return typeBreakdown;
        }
    }

    public static class UserStatistics {
        private Long userId;
        private String userName;
        private Long totalInteractions;
        private String favoriteType;

        public UserStatistics(Long userId, String userName, Long totalInteractions, String favoriteType) {
            this.userId = userId;
            this.userName = userName;
            this.totalInteractions = totalInteractions;
            this.favoriteType = favoriteType;
        }

        // Getters
        public Long getUserId() {
            return userId;
        }

        public String getUserName() {
            return userName;
        }

        public Long getTotalInteractions() {
            return totalInteractions;
        }

        public String getFavoriteType() {
            return favoriteType;
        }
    }

    public static class TypeStatistics {
        private String type;
        private Long count;
        private Double averageProcessingTime;

        public TypeStatistics(String type, Long count, Double averageProcessingTime) {
            this.type = type;
            this.count = count;
            this.averageProcessingTime = averageProcessingTime;
        }

        // Getters
        public String getType() {
            return type;
        }

        public Long getCount() {
            return count;
        }

        public Double getAverageProcessingTime() {
            return averageProcessingTime;
        }
    }

    public static class LanguageStatistics {
        private String language;
        private Long count;
        private Double percentage;

        public LanguageStatistics(String language, Long count, Double percentage) {
            this.language = language;
            this.count = count;
            this.percentage = percentage;
        }

        // Getters
        public String getLanguage() {
            return language;
        }

        public Long getCount() {
            return count;
        }

        public Double getPercentage() {
            return percentage;
        }
    }

    public static class PerformanceStatistics {
        private Double averageProcessingTime;
        private Long totalInteractions;
        private Double successRate;

        public PerformanceStatistics(Double averageProcessingTime, Long totalInteractions, Double successRate) {
            this.averageProcessingTime = averageProcessingTime;
            this.totalInteractions = totalInteractions;
            this.successRate = successRate;
        }

        // Getters
        public Double getAverageProcessingTime() {
            return averageProcessingTime;
        }

        public Long getTotalInteractions() {
            return totalInteractions;
        }

        public Double getSuccessRate() {
            return successRate;
        }
    }

    public static class UserActivityStats {
        private Long userId;
        private String userName;
        private Long activityCount;
        private java.time.LocalDateTime lastActivity;

        public UserActivityStats(Long userId, String userName, Long activityCount,
                java.time.LocalDateTime lastActivity) {
            this.userId = userId;
            this.userName = userName;
            this.activityCount = activityCount;
            this.lastActivity = lastActivity;
        }

        // Getters
        public Long getUserId() {
            return userId;
        }

        public String getUserName() {
            return userName;
        }

        public Long getActivityCount() {
            return activityCount;
        }

        public java.time.LocalDateTime getLastActivity() {
            return lastActivity;
        }
    }

    // Placeholder implementations cho các method analytics
    public List<DailyStatistics> getDailyStatistics(int days) {
        return new java.util.ArrayList<>();
    }

    public UserStatistics getUserStatistics(Long userId) {
        // Return placeholder UserStatistics object
        return new UserStatistics(userId, "User", 0L, "CHAT");
    }

    public List<TypeStatistics> getTypeStatistics() {
        return new java.util.ArrayList<>();
    }

    public List<LanguageStatistics> getLanguageStatistics() {
        return new java.util.ArrayList<>();
    }

    public PerformanceStatistics getPerformanceStatistics() {
        return new PerformanceStatistics(0.0, 0L, 0.0);
    }

    public List<UserActivityStats> getTopActiveUsers(int limit) {
        return new java.util.ArrayList<>();
    }

    public java.util.Map<String, Object> getEngagementMetrics(int days) {
        return new java.util.HashMap<>();
    }

    public java.util.Map<String, Object> getConversionMetrics(int days) {
        return new java.util.HashMap<>();
    }

    public java.util.Map<String, Object> getModelPerformanceMetrics(int days) {
        return new java.util.HashMap<>();
    }

    public java.util.Map<String, Object> getErrorAnalytics(int days) {
        return new java.util.HashMap<>();
    }

    public java.util.Map<String, Object> exportForLookerStudio(int days) {
        java.util.Map<String, Object> export = new java.util.HashMap<>();
        export.put("status", "success");
        export.put("days", days);
        export.put("data", new java.util.ArrayList<>());
        return export;
    }

    public java.util.Map<String, Object> getHealthMetrics() {
        return new java.util.HashMap<>();
    }

    public int cleanupOldInteractions(int daysOld) {
        java.time.LocalDateTime cutoffDate = java.time.LocalDateTime.now().minusDays(daysOld);
        return aiInteractionRepository.deleteByCreatedAtBefore(cutoffDate);
    }
}
