package com.smartcooking.ai.repository;

import com.smartcooking.ai.entity.AIInteraction;
import com.smartcooking.ai.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * AI Interaction Repository cho analytics và tracking
 */
@Repository
public interface AIInteractionRepository extends JpaRepository<AIInteraction, Long> {

    /**
     * Tìm interactions theo user
     */
    List<AIInteraction> findByUserOrderByCreatedAtDesc(User user);

    /**
     * Tìm interactions theo user ID
     */
    List<AIInteraction> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Tìm interactions theo type
     */
    List<AIInteraction> findByInteractionType(AIInteraction.InteractionType interactionType);

    /**
     * Tìm interactions thành công
     */
    List<AIInteraction> findBySuccessTrue();

    /**
     * Tìm interactions thất bại
     */
    List<AIInteraction> findBySuccessFalse();

    /**
     * Tìm interactions theo ngôn ngữ user
     */
    List<AIInteraction> findByUserLanguage(String userLanguage);

    /**
     * Thêm các method còn thiếu cho AIInteractionService
     */
    List<AIInteraction> findByInteractionTypeOrderByCreatedAtDesc(AIInteraction.InteractionType interactionType);

    List<AIInteraction> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);

    Page<AIInteraction> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<AIInteraction> findByUserLanguageOrderByCreatedAtDesc(String userLanguage);

    List<AIInteraction> findByProcessingTimeMsGreaterThanOrderByProcessingTimeMsDesc(Long thresholdMs);

    int deleteByCreatedAtBefore(LocalDateTime cutoffDate);

    /**
     * Tìm interactions trong khoảng thời gian
     */
    List<AIInteraction> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Thống kê interactions theo type trong khoảng thời gian
     */
    @Query("""
            SELECT i.interactionType, COUNT(i)
            FROM AIInteraction i
            WHERE i.createdAt BETWEEN :startDate AND :endDate
            GROUP BY i.interactionType
            """)
    List<Object[]> getInteractionStatsByType(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Thống kê interactions theo ngôn ngữ
     */
    @Query("""
            SELECT i.userLanguage, COUNT(i)
            FROM AIInteraction i
            WHERE i.createdAt BETWEEN :startDate AND :endDate
            GROUP BY i.userLanguage
            """)
    List<Object[]> getInteractionStatsByLanguage(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Thống kê thời gian xử lý trung bình theo type
     */
    @Query("""
            SELECT i.interactionType, AVG(i.processingTimeMs)
            FROM AIInteraction i
            WHERE i.processingTimeMs IS NOT NULL
            AND i.createdAt BETWEEN :startDate AND :endDate
            GROUP BY i.interactionType
            """)
    List<Object[]> getAverageProcessingTimeByType(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Đếm interactions theo user trong khoảng thời gian
     */
    long countByUserAndCreatedAtBetween(User user, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Tìm top users theo số interactions
     */
    @Query("""
            SELECT i.user, COUNT(i) as interactionCount
            FROM AIInteraction i
            WHERE i.createdAt BETWEEN :startDate AND :endDate
            GROUP BY i.user
            ORDER BY COUNT(i) DESC
            """)
    Page<Object[]> findTopUsersByInteractions(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    /**
     * Thống kê tỷ lệ thành công theo type
     */
    @Query("""
            SELECT i.interactionType,
                   SUM(CASE WHEN i.success = true THEN 1 ELSE 0 END) as successCount,
                   COUNT(i) as totalCount
            FROM AIInteraction i
            WHERE i.createdAt BETWEEN :startDate AND :endDate
            GROUP BY i.interactionType
            """)
    List<Object[]> getSuccessRateByType(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Tìm interactions gần đây của user
     */
    @Query("""
            SELECT i FROM AIInteraction i
            WHERE i.user = :user
            ORDER BY i.createdAt DESC
            """)
    Page<AIInteraction> findRecentInteractionsByUser(@Param("user") User user, Pageable pageable);

    /**
     * Đếm total interactions theo type
     */
    long countByInteractionType(AIInteraction.InteractionType interactionType);

    /**
     * Thống kê hàng ngày - số interactions per day
     */
    @Query(value = """
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM ai_interactions
            WHERE created_at BETWEEN :startDate AND :endDate
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at)
            """, nativeQuery = true)
    List<Object[]> getDailyInteractionStats(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Tìm errors gần đây
     */
    @Query("""
            SELECT i FROM AIInteraction i
            WHERE i.success = false
            AND i.errorMessage IS NOT NULL
            ORDER BY i.createdAt DESC
            """)
    Page<AIInteraction> findRecentErrors(Pageable pageable);
}
