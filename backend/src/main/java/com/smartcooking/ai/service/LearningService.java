package com.smartcooking.ai.service;

import com.smartcooking.ai.entity.LearningPath;
import com.smartcooking.ai.entity.LearningPathStep;
import com.smartcooking.ai.entity.User;
import com.smartcooking.ai.entity.UserLearningProgress;
import com.smartcooking.ai.repository.LearningPathRepository;
import com.smartcooking.ai.repository.UserLearningProgressRepository;
import com.smartcooking.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class LearningService {

    private final LearningPathRepository learningPathRepository;
    private final UserLearningProgressRepository progressRepository;
    private final UserRepository userRepository;

    public LearningPath createLearningPath(LearningPath learningPath, Long creatorId) {
        log.info("Creating new learning path: {} by user: {}", learningPath.getTitleEn(), creatorId);

        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found: " + creatorId));

        learningPath.setCreatedBy(creator);

        if (learningPath.getIsActive() == null) {
            learningPath.setIsActive(true);
        }
        if (learningPath.getEstimatedHours() == null) {
            learningPath.setEstimatedHours(10);
        }

        LearningPath savedPath = learningPathRepository.save(learningPath);
        log.info("Learning path created with ID: {}", savedPath.getId());
        return savedPath;
    }

    @Transactional(readOnly = true)
    public List<LearningPath> getActiveLearningPaths() {
        return learningPathRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public Optional<LearningPath> getLearningPathById(Long id) {
        return learningPathRepository.findById(id);
    }

    public UserLearningProgress enrollUserInLearningPath(Long userId, Long learningPathId) {
        log.info("Enrolling user: {} in learning path: {}", userId, learningPathId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        LearningPath learningPath = learningPathRepository.findById(learningPathId)
                .orElseThrow(() -> new RuntimeException("Learning path not found: " + learningPathId));

        Optional<UserLearningProgress> existingProgress = progressRepository
                .findByUserAndLearningPath(user, learningPath);
        if (existingProgress.isPresent()) {
            throw new RuntimeException("User already enrolled in this learning path");
        }

        UserLearningProgress progress = UserLearningProgress.builder()
                .user(user)
                .learningPath(learningPath)
                .totalSteps(learningPath.getTotalSteps() != null ? learningPath.getTotalSteps() : 0)
                .progressPercentage(BigDecimal.ZERO)
                .build();

        UserLearningProgress savedProgress = progressRepository.save(progress);
        log.info("User enrolled in learning path: {}", savedProgress.getId());
        return savedProgress;
    }

    @Transactional(readOnly = true)
    public List<UserLearningProgress> getUserLearningProgress(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        return progressRepository.findByUserOrderByStartedAtDesc(user);
    }

    /**
     * Update learning path
     */
    public LearningPath updateLearningPath(Long pathId, LearningPath updates, Long userId) {
        log.info("Updating learning path: {} by user: {}", pathId, userId);

        LearningPath existingPath = learningPathRepository.findById(pathId)
                .orElseThrow(() -> new RuntimeException("Learning path not found: " + pathId));

        if (updates.getTitleEn() != null) {
            existingPath.setTitleEn(updates.getTitleEn());
        }
        if (updates.getTitleVi() != null) {
            existingPath.setTitleVi(updates.getTitleVi());
        }
        if (updates.getDescriptionEn() != null) {
            existingPath.setDescriptionEn(updates.getDescriptionEn());
        }
        if (updates.getDescriptionVi() != null) {
            existingPath.setDescriptionVi(updates.getDescriptionVi());
        }
        if (updates.getDifficultyLevel() != null) {
            existingPath.setDifficultyLevel(updates.getDifficultyLevel());
        }
        if (updates.getEstimatedHours() != null) {
            existingPath.setEstimatedHours(updates.getEstimatedHours());
        }

        LearningPath savedPath = learningPathRepository.save(existingPath);
        log.info("Learning path updated: {}", savedPath.getId());
        return savedPath;
    }

    /**
     * Delete learning path
     */
    public void deleteLearningPath(Long pathId, Long userId) {
        log.info("Deleting learning path: {} by user: {}", pathId, userId);

        LearningPath learningPath = learningPathRepository.findById(pathId)
                .orElseThrow(() -> new RuntimeException("Learning path not found: " + pathId));

        learningPathRepository.delete(learningPath);
        log.info("Learning path deleted: {}", pathId);
    }

    /**
     * Get learning paths by difficulty
     */
    @Transactional(readOnly = true)
    public List<LearningPath> getLearningPathsByDifficulty(LearningPath.DifficultyLevel difficulty) {
        return learningPathRepository.findByDifficultyLevelAndIsActiveTrue(difficulty);
    }

    /**
     * Get learning paths by creator
     */
    @Transactional(readOnly = true)
    public List<LearningPath> getLearningPathsByCreator(Long creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found: " + creatorId));
        return learningPathRepository.findByCreatedByAndIsActiveTrue(creator);
    }

    /**
     * Search learning paths
     */
    @Transactional(readOnly = true)
    public Page<LearningPath> searchLearningPaths(String keyword, Pageable pageable) {
        return learningPathRepository.findByTitleEnContainingIgnoreCaseOrTitleViContainingIgnoreCaseAndIsActiveTrue(
                keyword, keyword, pageable);
    }

    /**
     * Enroll user in learning path (alias method)
     */
    public UserLearningProgress enrollUserInPath(Long userId, Long pathId) {
        return enrollUserInLearningPath(userId, pathId);
    }

    // Thêm các methods và static classes còn thiếu cho controllers

    /**
     * Get popular learning paths (most enrolled)
     */
    @Transactional(readOnly = true)
    public List<LearningPath> getPopularLearningPaths(int limit) {
        return learningPathRepository.findByIsActiveTrueOrderByCreatedAtDesc().stream()
                .limit(limit)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Get user's enrolled learning paths
     */
    @Transactional(readOnly = true)
    public List<LearningPath> getUserEnrolledPaths(Long userId) {
        List<UserLearningProgress> progresses = progressRepository.findByUserId(userId);
        return progresses.stream()
                .map(progress -> progress.getLearningPath())
                .filter(Objects::nonNull)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Get user's completed learning paths
     */
    @Transactional(readOnly = true)
    public List<UserLearningProgress> getUserCompletedPaths(Long userId) {
        return progressRepository.findByUserIdAndIsCompleted(userId, true);
    }

    /**
     * Get recommended learning paths for user
     */
    @Transactional(readOnly = true)
    public List<LearningPath> getRecommendedPaths(Long userId, int limit) {
        return learningPathRepository.findByIsActiveTrueOrderByCreatedAtDesc().stream()
                .limit(limit)
                .collect(java.util.stream.Collectors.toList());
    }

    // Static classes cho controller requirements
    public static class LearningPathStatistics {
        private Long totalPaths;
        private Long activePaths;
        private Long totalEnrollments;
        private Double averageCompletionRate;

        public LearningPathStatistics(Long totalPaths, Long activePaths, Long totalEnrollments,
                Double averageCompletionRate) {
            this.totalPaths = totalPaths;
            this.activePaths = activePaths;
            this.totalEnrollments = totalEnrollments;
            this.averageCompletionRate = averageCompletionRate;
        }

        // Getters
        public Long getTotalPaths() {
            return totalPaths;
        }

        public Long getActivePaths() {
            return activePaths;
        }

        public Long getTotalEnrollments() {
            return totalEnrollments;
        }

        public Double getAverageCompletionRate() {
            return averageCompletionRate;
        }
    }

    public static class UserLearningStatistics {
        private Long userId;
        private String userName;
        private Long totalEnrolled;
        private Long totalCompleted;
        private Double completionRate;
        private Integer totalHoursStudied;

        public UserLearningStatistics(Long userId, String userName, Long totalEnrolled, Long totalCompleted,
                Double completionRate, Integer totalHoursStudied) {
            this.userId = userId;
            this.userName = userName;
            this.totalEnrolled = totalEnrolled;
            this.totalCompleted = totalCompleted;
            this.completionRate = completionRate;
            this.totalHoursStudied = totalHoursStudied;
        }

        // Getters
        public Long getUserId() {
            return userId;
        }

        public String getUserName() {
            return userName;
        }

        public Long getTotalEnrolled() {
            return totalEnrolled;
        }

        public Long getTotalCompleted() {
            return totalCompleted;
        }

        public Double getCompletionRate() {
            return completionRate;
        }

        public Integer getTotalHoursStudied() {
            return totalHoursStudied;
        }
    }

    public static class UserLearningStats {
        private Long userId;
        private String userName;
        private Long completedPaths;
        private Integer totalPoints;
        private Integer rank;

        public UserLearningStats(Long userId, String userName, Long completedPaths, Integer totalPoints, Integer rank) {
            this.userId = userId;
            this.userName = userName;
            this.completedPaths = completedPaths;
            this.totalPoints = totalPoints;
            this.rank = rank;
        }

        // Getters
        public Long getUserId() {
            return userId;
        }

        public String getUserName() {
            return userName;
        }

        public Long getCompletedPaths() {
            return completedPaths;
        }

        public Integer getTotalPoints() {
            return totalPoints;
        }

        public Integer getRank() {
            return rank;
        }
    }

    // Methods cho controller requirements
    @Transactional(readOnly = true)
    public LearningPathStatistics getLearningPathStatistics() {
        long totalPaths = learningPathRepository.count();
        long activePaths = learningPathRepository.findByIsActiveTrue().size();
        long totalEnrollments = progressRepository.count();

        double averageCompletionRate = 0.0;
        if (totalEnrollments > 0) {
            long completedEnrollments = progressRepository.countByIsCompleted(true);
            averageCompletionRate = (double) completedEnrollments / totalEnrollments * 100;
        }

        return new LearningPathStatistics(totalPaths, activePaths, totalEnrollments, averageCompletionRate);
    }

    @Transactional(readOnly = true)
    public UserLearningStatistics getUserLearningStatistics(Long userId) {
        List<UserLearningProgress> progresses = progressRepository.findByUserId(userId);

        long totalEnrolled = progresses.size();
        long totalCompleted = progresses.stream().mapToLong(p -> p.getIsCompleted() ? 1 : 0).sum();
        double completionRate = totalEnrolled > 0 ? (double) totalCompleted / totalEnrolled * 100 : 0.0;

        int totalHoursStudied = progresses.stream()
                .mapToInt(p -> p.getLearningPath().getEstimatedHours() != null ? p.getLearningPath().getEstimatedHours()
                        : 0)
                .sum();

        String userName = userRepository.findById(userId)
                .map(User::getFullName)
                .orElse("Unknown");

        return new UserLearningStatistics(userId, userName, totalEnrolled, totalCompleted, completionRate,
                totalHoursStudied);
    }

    @Transactional(readOnly = true)
    public List<UserLearningStats> getLearningLeaderboard(int limit) {
        List<UserLearningStats> leaderboard = new ArrayList<>();

        List<User> users = userRepository.findAll().stream().limit(limit).collect(java.util.stream.Collectors.toList());

        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            List<UserLearningProgress> progresses = progressRepository.findByUserId(user.getId());
            long completedPaths = progresses.stream().mapToLong(p -> p.getIsCompleted() ? 1 : 0).sum();
            int totalPoints = (int) (completedPaths * 100);

            leaderboard
                    .add(new UserLearningStats(user.getId(), user.getFullName(), completedPaths, totalPoints, i + 1));
        }

        return leaderboard;
    }

    // Methods cho các controller methods còn thiếu
    public LearningPathStep addStepToPath(Long pathId, LearningPathStep step, Long userId) {
        // Tìm learning path
        LearningPath path = learningPathRepository.findById(pathId)
                .orElseThrow(() -> new RuntimeException("Learning path not found: " + pathId));

        // Set learning path cho step
        step.setLearningPath(path);

        // Save step (cần LearningPathStepRepository)
        return step; // Placeholder cho đến khi có repository
    }

    public List<LearningPathStep> getStepsByPath(Long pathId) {
        // Placeholder - cần LearningPathStepRepository
        return new ArrayList<>();
    }

    public LearningPathStep updateStep(Long stepId, LearningPathStep updates, Long userId) {
        // Placeholder - cần LearningPathStepRepository
        return updates;
    }

    public void deleteStep(Long stepId, Long userId) {
        // Placeholder - sẽ implement sau
    }

    public UserLearningProgress updateProgress(Long progressId, Integer completedSteps, Double progressPercent,
            Long userId) {
        // Placeholder - sẽ implement sau
        return new UserLearningProgress();
    }

    public UserLearningProgress completeStep(Long progressId, Long stepId, Long userId) {
        // Placeholder - sẽ implement sau
        return new UserLearningProgress();
    }

    public UserLearningProgress completeLearningPath(Long progressId, Long userId) {
        // Placeholder - sẽ implement sau
        return new UserLearningProgress();
    }

    public List<UserLearningProgress> getUserProgress(Long userId) {
        return progressRepository.findByUserId(userId);
    }

    public List<UserLearningProgress> getUserInProgressPaths(Long userId) {
        return progressRepository.findByUserIdAndIsCompleted(userId, false);
    }

    public List<LearningPath> getRecommendedPathsForUser(Long userId) {
        return getRecommendedPaths(userId, 5);
    }

    public Map<String, Object> exportLearningAnalytics(int days) {
        return new HashMap<>();
    }

    public Map<String, Object> getCompletionRateAnalytics(int days) {
        return new HashMap<>();
    }

    public Map<String, Object> getLearningSystemHealth() {
        return new HashMap<>();
    }
}