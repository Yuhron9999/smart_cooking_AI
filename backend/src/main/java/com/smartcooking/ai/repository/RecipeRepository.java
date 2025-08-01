package com.smartcooking.ai.repository;

import com.smartcooking.ai.entity.Recipe;
import com.smartcooking.ai.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Recipe Repository với các query methods tùy chỉnh
 */
@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {

        /**
         * Tìm recipes theo tác giả
         */
        List<Recipe> findByAuthor(User author);

        /**
         * Tìm recipes public
         */
        List<Recipe> findByIsPublicTrue();

        /**
         * Tìm recipes theo category
         */
        List<Recipe> findByCategoryId(Long categoryId);

        /**
         * Tìm recipes theo độ khó
         */
        List<Recipe> findByDifficulty(Recipe.Difficulty difficulty);

        /**
         * Tìm recipes theo thời gian nấu (dưới x phút)
         */
        List<Recipe> findByCookingTimeLessThanEqual(Integer maxCookingTime);

        /**
         * Tìm recipes theo vùng miền
         */
        List<Recipe> findByOriginRegion(String originRegion);

        /**
         * Search recipes theo title (cả tiếng Việt và tiếng Anh)
         */
        @Query("""
                        SELECT r FROM Recipe r
                        WHERE LOWER(r.titleEn) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        OR LOWER(r.titleVi) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        """)
        List<Recipe> searchByTitle(@Param("keyword") String keyword);

        /**
         * Search recipes theo description
         */
        @Query("""
                        SELECT r FROM Recipe r
                        WHERE LOWER(r.descriptionEn) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        OR LOWER(r.descriptionVi) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        """)
        List<Recipe> searchByDescription(@Param("keyword") String keyword);

        /**
         * Tìm recipes phổ biến (nhiều rating cao)
         */
        @Query("""
                        SELECT r FROM Recipe r
                        LEFT JOIN r.ratings rt
                        WHERE r.isPublic = true
                        GROUP BY r.id
                        HAVING AVG(rt.rating) >= :minRating
                        ORDER BY AVG(rt.rating) DESC, COUNT(rt.id) DESC
                        """)
        Page<Recipe> findPopularRecipes(@Param("minRating") Double minRating, Pageable pageable);

        /**
         * Tìm recipes theo nguyên liệu
         */
        @Query("""
                        SELECT DISTINCT r FROM Recipe r
                        JOIN r.ingredients ri
                        WHERE LOWER(ri.name) LIKE LOWER(CONCAT('%', :ingredient, '%'))
                        """)
        List<Recipe> findByIngredient(@Param("ingredient") String ingredient);

        /**
         * Tìm recipes có thể nấu với danh sách nguyên liệu
         */
        @Query("""
                        SELECT r FROM Recipe r
                        WHERE r.id IN (
                            SELECT ri.recipe.id FROM RecipeIngredient ri
                            WHERE LOWER(ri.name) IN :availableIngredients
                            GROUP BY ri.recipe.id
                            HAVING COUNT(DISTINCT ri.id) >= :minMatchingIngredients
                        )
                        """)
        List<Recipe> findRecipesByAvailableIngredients(
                        @Param("availableIngredients") List<String> availableIngredients,
                        @Param("minMatchingIngredients") Long minMatchingIngredients);

        /**
         * Tìm recipes gần vị trí địa lý (có location tag)
         */
        @Query(value = """
                        SELECT * FROM recipes r
                        WHERE r.latitude IS NOT NULL
                        AND r.longitude IS NOT NULL
                        AND r.is_public = true
                        AND (6371 * acos(cos(radians(:latitude))
                        * cos(radians(r.latitude))
                        * cos(radians(r.longitude) - radians(:longitude))
                        + sin(radians(:latitude))
                        * sin(radians(r.latitude)))) < :radiusKm
                        ORDER BY (6371 * acos(cos(radians(:latitude))
                        * cos(radians(r.latitude))
                        * cos(radians(r.longitude) - radians(:longitude))
                        + sin(radians(:latitude))
                        * sin(radians(r.latitude))))
                        """, nativeQuery = true)
        List<Recipe> findRecipesNearLocation(@Param("latitude") Double latitude,
                        @Param("longitude") Double longitude,
                        @Param("radiusKm") Double radiusKm);

        /**
         * Tìm recipes được tạo bởi AI
         */
        List<Recipe> findBySource(Recipe.Source source);

        /**
         * Tìm recipes theo calories (dưới x calories)
         */
        List<Recipe> findByCaloriesLessThanEqual(Integer maxCalories);

        /**
         * Đếm recipes theo category
         */
        long countByCategoryId(Long categoryId);

        /**
         * Đếm recipes theo tác giả
         */
        long countByAuthor(User author);

        /**
         * Tìm top recipes theo average rating
         */
        @Query("""
                        SELECT r FROM Recipe r
                        LEFT JOIN r.ratings rt
                        WHERE r.isPublic = true
                        GROUP BY r.id
                        ORDER BY AVG(rt.rating) DESC
                        """)
        Page<Recipe> findTopRatedRecipes(Pageable pageable);

        /**
         * Tìm recipes được tạo trong khoảng thời gian
         */
        @Query("SELECT r FROM Recipe r WHERE r.createdAt BETWEEN :startDate AND :endDate")
        List<Recipe> findRecipesCreatedBetween(@Param("startDate") java.time.LocalDateTime startDate,
                        @Param("endDate") java.time.LocalDateTime endDate);

        /**
         * Tìm recipes yêu thích của user
         */
        @Query("SELECT r FROM Recipe r JOIN r.favoriteByUsers u WHERE u.id = :userId")
        List<Recipe> findFavoriteRecipesByUserId(@Param("userId") Long userId);

        /**
         * Full text search cho recipes
         */
        @Query("""
                        SELECT r FROM Recipe r
                        WHERE LOWER(r.titleEn) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        OR LOWER(r.titleVi) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        OR LOWER(r.descriptionEn) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        OR LOWER(r.descriptionVi) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        OR EXISTS (
                            SELECT 1 FROM RecipeIngredient ri
                            WHERE ri.recipe = r
                            AND LOWER(ri.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        )
                        """)
        Page<Recipe> fullTextSearch(@Param("keyword") String keyword, Pageable pageable);
}
