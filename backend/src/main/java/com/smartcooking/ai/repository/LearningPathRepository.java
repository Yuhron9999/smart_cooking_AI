package com.smartcooking.ai.repository;

import com.smartcooking.ai.entity.LearningPath;
import com.smartcooking.ai.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Learning Path Repository
 */
@Repository
public interface LearningPathRepository extends JpaRepository<LearningPath, Long> {

    /**
     * Tìm learning paths active
     */
    List<LearningPath> findByIsActiveTrue();

    /**
     * Tìm learning paths theo difficulty level
     */
    List<LearningPath> findByDifficultyLevelAndIsActiveTrue(LearningPath.DifficultyLevel difficultyLevel);

    /**
     * Tìm learning paths theo creator
     */
    List<LearningPath> findByCreatedByAndIsActiveTrue(User createdBy);

    /**
     * Search learning paths theo title
     */
    @Query("""
            SELECT lp FROM LearningPath lp
            WHERE (LOWER(lp.titleEn) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(lp.titleVi) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND lp.isActive = true
            """)
    List<LearningPath> searchByTitle(@Param("keyword") String keyword);

    /**
     * Tìm learning paths theo estimated hours (dưới x giờ)
     */
    List<LearningPath> findByEstimatedHoursLessThanEqualAndIsActiveTrue(Integer maxHours);

    /**
     * Tìm popular learning paths (nhiều users tham gia)
     */
    @Query("""
            SELECT lp, COUNT(ulp) as enrollmentCount
            FROM LearningPath lp
            LEFT JOIN UserLearningProgress ulp ON ulp.learningPath = lp
            WHERE lp.isActive = true
            GROUP BY lp
            ORDER BY COUNT(ulp) DESC
            """)
    Page<Object[]> findPopularLearningPaths(Pageable pageable);

    /**
     * Đếm số steps trong learning path
     */
    @Query("SELECT COUNT(s) FROM LearningPathStep s WHERE s.learningPath.id = :learningPathId")
    long countStepsByLearningPath(@Param("learningPathId") Long learningPathId);

    /**
     * Tìm learning paths được tạo bởi CHEFs
     */
    @Query("""
            SELECT lp FROM LearningPath lp
            WHERE lp.createdBy.role = 'CHEF'
            AND lp.isActive = true
            """)
    List<LearningPath> findByChefCreators();

    /**
     * Thống kê completion rate của learning paths
     */
    @Query("""
            SELECT lp,
                   COUNT(DISTINCT ulp.user) as totalEnrollments,
                   COUNT(DISTINCT CASE WHEN ulp.isCompleted = true THEN ulp.user END) as completedEnrollments
            FROM LearningPath lp
            LEFT JOIN UserLearningProgress ulp ON ulp.learningPath = lp
            WHERE lp.isActive = true
            GROUP BY lp
            """)
    List<Object[]> getLearningPathCompletionStats();

    // Thêm method còn thiếu cho LearningService
    List<LearningPath> findByIsActiveTrueOrderByCreatedAtDesc();

    // Thêm method để tìm kiếm theo titleEn hoặc titleVi (không phân biệt hoa thường) và isActive = true, có phân trang
    Page<LearningPath> findByTitleEnContainingIgnoreCaseOrTitleViContainingIgnoreCaseAndIsActiveTrue(
            String titleEn, String titleVi, Pageable pageable
    );
    
}
