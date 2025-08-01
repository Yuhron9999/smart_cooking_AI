package com.smartcooking.ai.repository;

import com.smartcooking.ai.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Category Repository
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

        /**
         * Tìm category theo name (tiếng Anh)
         */
        Optional<Category> findByNameEn(String nameEn);

        /**
         * Tìm category theo name (tiếng Việt)
         */
        Optional<Category> findByNameVi(String nameVi);

        /**
         * Tìm categories active
         */
        List<Category> findByActiveTrue();

        /**
         * Search categories theo name (cả tiếng Việt và tiếng Anh)
         */
        @Query("""
                        SELECT c FROM Category c
                        WHERE (LOWER(c.nameEn) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        OR LOWER(c.nameVi) LIKE LOWER(CONCAT('%', :keyword, '%')))
                        AND c.active = true
                        """)
        List<Category> searchByName(@Param("keyword") String keyword);

        /**
         * Đếm số recipes trong category
         */
        @Query("SELECT COUNT(r) FROM Recipe r WHERE r.category.id = :categoryId")
        long countRecipesByCategory(@Param("categoryId") Long categoryId);

        /**
         * Tìm categories có recipes
         */
        @Query("""
                        SELECT DISTINCT c FROM Category c
                        INNER JOIN Recipe r ON r.category = c
                        WHERE c.active = true
                        """)
        List<Category> findCategoriesWithRecipes();

        /**
         * Tìm categories theo display order
         */
        List<Category> findByActiveTrueOrderByDisplayOrder();

        /**
         * Search method với Pageable
         */
        org.springframework.data.domain.Page<Category> findByNameEnContainingIgnoreCaseOrNameViContainingIgnoreCase(
                        String nameEn, String nameVi, org.springframework.data.domain.Pageable pageable);

        /**
         * Find active categories with ordering và Pageable
         */
        org.springframework.data.domain.Page<Category> findByActiveTrueOrderByDisplayOrder(
                        org.springframework.data.domain.Pageable pageable);
}
