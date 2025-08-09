package com.smartcooking.ai.repository;

import com.smartcooking.ai.entity.UserCuisinePreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserCuisinePreferenceRepository extends JpaRepository<UserCuisinePreference, Long> {

    List<UserCuisinePreference> findByUserId(Long userId);

    boolean existsByUserIdAndCuisine(Long userId, String cuisine);

    void deleteByUserIdAndCuisine(Long userId, String cuisine);

    void deleteByUserId(Long userId);

    @Query("SELECT ucp.cuisine FROM UserCuisinePreference ucp WHERE ucp.userId = :userId")
    List<String> findCuisineNamesByUserId(@Param("userId") Long userId);

    @Query("SELECT ucp FROM UserCuisinePreference ucp WHERE ucp.userId = :userId ORDER BY ucp.preferenceScore DESC")
    List<UserCuisinePreference> findByUserIdOrderByPreferenceScoreDesc(@Param("userId") Long userId);

    @Query("SELECT COUNT(ucp) FROM UserCuisinePreference ucp WHERE ucp.userId = :userId")
    int countByUserId(@Param("userId") Long userId);
}
