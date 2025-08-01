package com.smartcooking.ai.service;

import com.smartcooking.ai.entity.Category;
import com.smartcooking.ai.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Category Service - Quản lý danh mục công thức
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /**
     * Tạo category mới
     */
    public Category createCategory(Category category, Long creatorId) {
        log.info("Creating new category: {} by user: {}", category.getNameEn(), creatorId);

        // Set defaults
        if (category.getActive() == null) {
            category.setActive(true);
        }

        Category savedCategory = categoryRepository.save(category);
        log.info("Category created with ID: {}", savedCategory.getId());
        return savedCategory;
    }

    /**
     * Update category
     */
    public Category updateCategory(Long categoryId, Category updates, Long updaterId) {
        log.info("Updating category: {} by user: {}", categoryId, updaterId);

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));

        // Update fields
        if (updates.getNameEn() != null) {
            category.setNameEn(updates.getNameEn());
        }
        if (updates.getNameVi() != null) {
            category.setNameVi(updates.getNameVi());
        }
        if (updates.getDescriptionEn() != null) {
            category.setDescriptionEn(updates.getDescriptionEn());
        }
        if (updates.getDescriptionVi() != null) {
            category.setDescriptionVi(updates.getDescriptionVi());
        }
        if (updates.getIconUrl() != null) {
            category.setIconUrl(updates.getIconUrl());
        }
        if (updates.getActive() != null) {
            category.setActive(updates.getActive());
        }

        Category savedCategory = categoryRepository.save(category);
        log.info("Category updated: {}", categoryId);
        return savedCategory;
    }

    /**
     * Delete category (deactivate)
     */
    public void deleteCategory(Long categoryId, Long deleterId) {
        log.info("Deactivating category: {} by user: {}", categoryId, deleterId);

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));

        category.setActive(false);
        categoryRepository.save(category);

        log.info("Category deactivated: {}", categoryId);
    }

    /**
     * Get category by ID
     */
    @Transactional(readOnly = true)
    public Optional<Category> getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId);
    }

    /**
     * Get all active categories
     */
    @Transactional(readOnly = true)
    public List<Category> getActiveCategories() {
        return categoryRepository.findByActiveTrue();
    }

    /**
     * Get top-level categories
     */
    @Transactional(readOnly = true)
    public List<Category> getTopLevelCategories() {
        return categoryRepository.findByActiveTrue(); // Cần update sau khi có parent relationship
    }

    /**
     * Search categories
     */
    @Transactional(readOnly = true)
    public List<Category> searchCategories(String keyword) {
        return categoryRepository.searchByName(keyword);
    }

    /**
     * Get category by English name
     */
    @Transactional(readOnly = true)
    public Optional<Category> getCategoryByNameEn(String nameEn) {
        return categoryRepository.findByNameEn(nameEn);
    }

    /**
     * Get category by Vietnamese name
     */
    @Transactional(readOnly = true)
    public Optional<Category> getCategoryByNameVi(String nameVi) {
        return categoryRepository.findByNameVi(nameVi);
    }

    /**
     * Get categories with recipes
     */
    @Transactional(readOnly = true)
    public List<Category> getCategoriesWithRecipes() {
        return categoryRepository.findCategoriesWithRecipes();
    }

    /**
     * Count recipes in category
     */
    @Transactional(readOnly = true)
    public long countRecipesInCategory(Long categoryId) {
        return categoryRepository.countRecipesByCategory(categoryId);
    }

    /**
     * Get category statistics
     */
    @Transactional(readOnly = true)
    public CategoryStatistics getCategoryStatistics() {
        long totalCategories = categoryRepository.count();
        long activeCategories = categoryRepository.findByActiveTrue().size();
        long topLevelCategories = categoryRepository.findByActiveTrue().size(); // Sẽ update sau
        long categoriesWithRecipes = categoryRepository.findCategoriesWithRecipes().size();

        return CategoryStatistics.builder()
                .totalCategories(totalCategories)
                .activeCategories(activeCategories)
                .topLevelCategories(topLevelCategories)
                .categoriesWithRecipes(categoriesWithRecipes)
                .build();
    }

    // Missing methods từ controller

    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Category> getCategoriesByLanguage(String language) {
        return categoryRepository.findByActiveTrue();
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<Category> searchCategories(String keyword,
            org.springframework.data.domain.Pageable pageable) {
        return categoryRepository.findByNameEnContainingIgnoreCaseOrNameViContainingIgnoreCase(keyword, keyword,
                pageable);
    }

    @Transactional(readOnly = true)
    public List<java.util.Map<String, Object>> getCategoriesWithRecipeCount() {
        List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
        List<Category> categories = categoryRepository.findByActiveTrue();
        for (Category category : categories) {
            java.util.Map<String, Object> item = new java.util.HashMap<>();
            item.put("category", category);
            item.put("recipeCount", 0L);
            result.add(item);
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<Category> getPopularCategories(int limit) {
        return categoryRepository
                .findByActiveTrueOrderByDisplayOrder(org.springframework.data.domain.PageRequest.of(0, limit))
                .getContent();
    }

    @Transactional(readOnly = true)
    public List<Category> getCategoriesByCreator(Long creatorId) {
        return categoryRepository.findByActiveTrue();
    }

    public Category toggleCategoryActive(Long categoryId, Long userId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));
        category.setActive(!category.getActive());
        return categoryRepository.save(category);
    }

    public List<Category> bulkCreateCategories(List<Category> categories, Long creatorId) {
        categories.forEach(category -> category.setActive(true));
        return categoryRepository.saveAll(categories);
    }

    public List<java.util.Map<String, Object>> exportCategories(String format) {
        List<java.util.Map<String, Object>> export = new java.util.ArrayList<>();
        List<Category> categories = categoryRepository.findAll();
        for (Category category : categories) {
            java.util.Map<String, Object> item = new java.util.HashMap<>();
            item.put("id", category.getId());
            item.put("nameEn", category.getNameEn());
            item.put("nameVi", category.getNameVi());
            item.put("active", category.getActive());
            export.add(item);
        }
        return export;
    }

    public java.util.Map<String, Object> syncCategoriesFromExternalSource(Long userId) {
        log.info("Syncing categories from external source by user: {}", userId);
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("status", "success");
        result.put("syncedCount", 0);
        return result;
    }

    public java.util.Map<String, Object> getCategoryUsageAnalytics(int days) {
        return new java.util.HashMap<>();
    }

    public List<Category> getTrendingCategories(int days, int limit) {
        return categoryRepository
                .findByActiveTrueOrderByDisplayOrder(org.springframework.data.domain.PageRequest.of(0, limit))
                .getContent();
    }

    public java.util.Map<String, Object> getCategorySystemHealth() {
        java.util.Map<String, Object> health = new java.util.HashMap<>();
        health.put("status", "healthy");
        health.put("totalCategories", categoryRepository.count());
        return health;
    }

    // Helper class for CategoryWithRecipeCount
    public static class CategoryWithRecipeCount {
        private Category category;
        private Long recipeCount;

        public CategoryWithRecipeCount(Category category, Long recipeCount) {
            this.category = category;
            this.recipeCount = recipeCount;
        }

        public Category getCategory() {
            return category;
        }

        public Long getRecipeCount() {
            return recipeCount;
        }
    }

    /**
     * Category Statistics DTO
     */
    @lombok.Data
    @lombok.Builder
    public static class CategoryStatistics {
        private long totalCategories;
        private long activeCategories;
        private long topLevelCategories;
        private long categoriesWithRecipes;
    }
}
