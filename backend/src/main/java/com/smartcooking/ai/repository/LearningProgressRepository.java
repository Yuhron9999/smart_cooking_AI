package com.smartcooking.ai.repository;

import com.smartcooking.ai.entity.LearningProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningProgressRepository extends JpaRepository<LearningProgress, Long> {

    Optional<LearningProgress> findByUserId(Long userId);

    void deleteByUserId(Long userId);

    boolean existsByUserId(Long userId);

    List<LearningProgress> findByCurrentSkillLevel(LearningProgress.SkillLevel skillLevel);

    @Query("SELECT lp FROM LearningProgress lp WHERE lp.completionPercentage >= :minPercentage")
    List<LearningProgress> findByCompletionPercentageGreaterThanEqual(@Param("minPercentage") Double minPercentage);

    @Query("SELECT lp FROM LearningProgress lp ORDER BY lp.completionPercentage DESC")
    List<LearningProgress> findAllOrderByCompletionPercentageDesc();

    @Query("SELECT AVG(lp.completionPercentage) FROM LearningProgress lp")
    Double getAverageCompletionPercentage();

    @Query("SELECT COUNT(lp) FROM LearningProgress lp WHERE lp.currentSkillLevel = :skillLevel")
    Long countBySkillLevel(@Param("skillLevel") LearningProgress.SkillLevel skillLevel);
}
