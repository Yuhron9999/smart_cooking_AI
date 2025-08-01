package com.smartcooking.ai.controller;

import com.smartcooking.ai.entity.Category;
import com.smartcooking.ai.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Category Controller - REST API cho quản lý categories
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Tạo category mới
     */
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category, @RequestParam Long creatorId) {
        try {
            Category created = categoryService.createCategory(category, creatorId);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            log.error("Error creating category: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy category theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return categoryService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cập nhật category
     */
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id,
            @RequestBody Category updates,
            @RequestParam Long userId) {
        try {
            Category updated = categoryService.updateCategory(id, updates, userId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Error updating category: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Xóa category
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id, @RequestParam Long userId) {
        try {
            categoryService.deleteCategory(id, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting category: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy tất cả categories
     */
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Lấy active categories
     */
    @GetMapping("/active")
    public ResponseEntity<List<Category>> getActiveCategories() {
        List<Category> categories = categoryService.getActiveCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Lấy categories theo language
     */
    @GetMapping("/language/{language}")
    public ResponseEntity<List<Category>> getCategoriesByLanguage(@PathVariable String language) {
        List<Category> categories = categoryService.getCategoriesByLanguage(language);
        return ResponseEntity.ok(categories);
    }

    /**
     * Search categories
     */
    @GetMapping("/search")
    public ResponseEntity<Page<Category>> searchCategories(@RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Category> categories = categoryService.searchCategories(keyword, pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Lấy categories với recipe count
     */
    @GetMapping("/with-recipe-count")
    public ResponseEntity<List<Map<String, Object>>> getCategoriesWithRecipeCount() {
        List<Map<String, Object>> categoriesWithCount = categoryService.getCategoriesWithRecipeCount();
        return ResponseEntity.ok(categoriesWithCount);
    }

    /**
     * Lấy popular categories
     */
    @GetMapping("/popular")
    public ResponseEntity<List<Category>> getPopularCategories(@RequestParam(defaultValue = "10") int limit) {
        List<Category> popularCategories = categoryService.getPopularCategories(limit);
        return ResponseEntity.ok(popularCategories);
    }

    /**
     * Lấy categories được tạo bởi user
     */
    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<Category>> getCategoriesByCreator(@PathVariable Long creatorId) {
        List<Category> categories = categoryService.getCategoriesByCreator(creatorId);
        return ResponseEntity.ok(categories);
    }

    /**
     * Activate/Deactivate category
     */
    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<Category> toggleCategoryActive(@PathVariable Long id, @RequestParam Long userId) {
        try {
            Category category = categoryService.toggleCategoryActive(id, userId);
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            log.error("Error toggling category active state: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy category statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<CategoryService.CategoryStatistics> getCategoryStatistics() {
        CategoryService.CategoryStatistics stats = categoryService.getCategoryStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Bulk create categories (for admin)
     */
    @PostMapping("/bulk")
    public ResponseEntity<List<Category>> bulkCreateCategories(@RequestBody List<Category> categories,
            @RequestParam Long creatorId) {
        try {
            List<Category> created = categoryService.bulkCreateCategories(categories, creatorId);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            log.error("Error bulk creating categories: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Export categories cho admin
     */
    @GetMapping("/export")
    public ResponseEntity<List<Map<String, Object>>> exportCategories(
            @RequestParam(defaultValue = "en") String language) {
        List<Map<String, Object>> exportData = categoryService.exportCategories(language);
        return ResponseEntity.ok(exportData);
    }

    /**
     * Sync categories from external source (for admin)
     */
    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> syncCategories(@RequestParam Long adminId) {
        try {
            Map<String, Object> syncResult = categoryService.syncCategoriesFromExternalSource(adminId);
            return ResponseEntity.ok(syncResult);
        } catch (Exception e) {
            log.error("Error syncing categories: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Sync failed: " + e.getMessage()));
        }
    }

    /**
     * Lấy category usage analytics
     */
    @GetMapping("/analytics/usage")
    public ResponseEntity<Map<String, Object>> getCategoryUsageAnalytics(@RequestParam(defaultValue = "30") int days) {
        Map<String, Object> analytics = categoryService.getCategoryUsageAnalytics(days);
        return ResponseEntity.ok(analytics);
    }

    /**
     * Lấy trending categories
     */
    @GetMapping("/trending")
    public ResponseEntity<List<Category>> getTrendingCategories(@RequestParam(defaultValue = "7") int days,
            @RequestParam(defaultValue = "5") int limit) {
        List<Category> trendingCategories = categoryService.getTrendingCategories(days, limit);
        return ResponseEntity.ok(trendingCategories);
    }

    /**
     * Health check cho category system
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> categoryHealthCheck() {
        Map<String, Object> health = categoryService.getCategorySystemHealth();
        return ResponseEntity.ok(health);
    }
}
