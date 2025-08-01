package com.smartcooking.ai.repository;

import com.smartcooking.ai.entity.UserLearningProgress;
import com.smartcooking.ai.entity.User;
import com.smartcooking.ai.entity.LearningPath;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * User Learning Progress Repository
 */
@Repository
public interface UserLearningProgressRepository extends JpaRepository<UserLearningProgress, Long> {

    /**
     * Tìm progress của user cho learning path cụ thể
     */
    Optional<UserLearningProgress> findByUserAndLearningPath(User user, LearningPath learningPath);

    /**
     * Tìm tất cả progress của user
     */
    List<UserLearningProgress> findByUserOrderByStartedAtDesc(User user);

    /**
     * Tìm progress đã hoàn thành của user
     */
    List<UserLearningProgress> findByUserAndIsCompletedTrue(User user);

    /**
     * Tìm progress chưa hoàn thành của user
     */
    List<UserLearningProgress> findByUserAndIsCompletedFalse(User user);

    /**
     * Tìm progress theo learning path
     */
    List<UserLearningProgress> findByLearningPath(LearningPath learningPath);

    /**
     * Đếm số users đã enroll learning path
     */
    long countByLearningPath(LearningPath learningPath);

    /**
     * Đếm số users đã hoàn thành learning path
     */
    long countByLearningPathAndIsCompletedTrue(LearningPath learningPath);

    /**
     * Tìm top learners theo số learning paths đã hoàn thành
     */
    @Query("""
            SELECT ulp.user, COUNT(ulp) as completedPaths
            FROM UserLearningProgress ulp
            WHERE ulp.isCompleted = true
            GROUP BY ulp.user
            ORDER BY COUNT(ulp) DESC
            """)
    Page<Object[]> findTopLearners(Pageable pageable);

    /**
     * Tìm progress active gần đây (last accessed trong 7 ngày)
     */
    @Query("""
            SELECT ulp FROM UserLearningProgress ulp
            WHERE ulp.lastAccessedAt >= :sevenDaysAgo
            AND ulp.isCompleted = false
            ORDER BY ulp.lastAccessedAt DESC
            """)
    List<UserLearningProgress> findRecentActiveProgress(@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);

    /**
     * Thống kê progress percentage trung bình theo learning path
     */
    @Query("""
            SELECT ulp.learningPath, AVG(ulp.progressPercentage)
            FROM UserLearningProgress ulp
            GROUP BY ulp.learningPath
            """)
    List<Object[]> getAverageProgressByLearningPath();

    /**
     * Tìm users đang học cùng learning path
     */
    @Query("""
            SELECT ulp FROM UserLearningProgress ulp
            WHERE ulp.learningPath = :learningPath
            AND ulp.isCompleted = false
            ORDER BY ulp.progressPercentage DESC
            """)
    List<UserLearningProgress> findActiveLearnersInPath(@Param("learningPath") LearningPath learningPath);

    /**
     * Thống kê completion time trung bình
     */
    @Query("""
            SELECT ulp.learningPath, AVG(ulp.totalTimeSpentMinutes)
            FROM UserLearningProgress ulp
            WHERE ulp.isCompleted = true
            GROUP BY ulp.learningPath
            """)
    List<Object[]> getAverageCompletionTimeByPath();

    /**
     * Tìm progress cần reminder (không access trong 3 ngày)
     */
    @Query("""
            SELECT ulp FROM UserLearningProgress ulp
            WHERE ulp.lastAccessedAt < :threeDaysAgo
            AND ulp.isCompleted = false
            AND ulp.progressPercentage > 0
            """)
    List<UserLearningProgress> findProgressNeedingReminder(@Param("threeDaysAgo") LocalDateTime threeDaysAgo);

    /**
     * Thống kê daily learning activity
     */
    @Query(value = """
            SELECT DATE(last_accessed_at) as date, COUNT(*) as activeUsers
            FROM user_learning_progress
            WHERE last_accessed_at BETWEEN :startDate AND :endDate
            GROUP BY DATE(last_accessed_at)
            ORDER BY DATE(last_accessed_at)
            """, nativeQuery = true)
    List<Object[]> getDailyLearningActivity(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Thêm các method còn thiếu cho LearningService
    List<UserLearningProgress> findByUserId(Long userId);

    List<UserLearningProgress> findByUserIdAndIsCompleted(Long userId, boolean isCompleted);

    long countByLearningPathId(Long learningPathId);

    long countByLearningPathIdAndIsCompleted(Long learningPathId, boolean isCompleted);

    Optional<UserLearningProgress> findByUserIdAndLearningPathId(Long userId, Long learningPathId);

    // Thêm method còn thiếu
    long countByIsCompleted(boolean isCompleted);
}