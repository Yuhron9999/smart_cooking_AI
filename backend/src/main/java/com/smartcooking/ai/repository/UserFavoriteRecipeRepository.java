package com.smartcooking.ai.repository;

import com.smartcooking.ai.entity.UserFavoriteRecipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFavoriteRecipeRepository extends JpaRepository<UserFavoriteRecipe, Long> {

    List<UserFavoriteRecipe> findByUserId(Long userId);

    Optional<UserFavoriteRecipe> findByUserIdAndRecipeId(Long userId, Long recipeId);

    boolean existsByUserIdAndRecipeId(Long userId, Long recipeId);

    void deleteByUserIdAndRecipeId(Long userId, Long recipeId);

    void deleteByUserId(Long userId);

    @Query("SELECT ufr FROM UserFavoriteRecipe ufr WHERE ufr.userId = :userId ORDER BY ufr.createdAt DESC")
    Page<UserFavoriteRecipe> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT ufr.recipeId FROM UserFavoriteRecipe ufr WHERE ufr.userId = :userId")
    List<Long> findRecipeIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(ufr) FROM UserFavoriteRecipe ufr WHERE ufr.userId = :userId")
    int countByUserId(@Param("userId") Long userId);

    List<UserFavoriteRecipe> findByUserIdAndRatingIsNotNull(Long userId);

    @Query("SELECT AVG(ufr.rating) FROM UserFavoriteRecipe ufr WHERE ufr.userId = :userId AND ufr.rating IS NOT NULL")
    Double getAverageRatingByUserId(@Param("userId") Long userId);
}
