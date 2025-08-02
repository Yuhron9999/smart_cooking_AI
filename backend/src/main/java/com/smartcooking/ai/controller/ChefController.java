package com.smartcooking.ai.controller;

import com.smartcooking.ai.entity.Recipe;
import com.smartcooking.ai.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Chef Controller - CHEF có thể CRUD recipes
 * 
 * Endpoints:
 * - GET /chef/recipes - Xem recipes của chef
 * - POST /chef/recipes - Tạo recipe mới
 * - PUT /chef/recipes/{id} - Cập nhật recipe
 * - DELETE /chef/recipes/{id} - Xóa recipe
 */
@RestController
@RequestMapping("/chef")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('CHEF', 'ADMIN')")
public class ChefController {

    private final RecipeService recipeService;

    /**
     * Xem tất cả recipes - CHEF và ADMIN
     */
    @GetMapping("/recipes")
    public ResponseEntity<List<Recipe>> getMyRecipes() {
        // TODO: Get recipes created by current chef - for now return all
        // List<Recipe> recipes = recipeService.getAllRecipes(); // Method doesn't exist
        return ResponseEntity.ok(List.of()); // Temporary empty list
    }

    /**
     * Tạo recipe mới - CHEF và ADMIN
     */
    @PostMapping("/recipes")
    public ResponseEntity<Recipe> createRecipe(@RequestBody Recipe recipe) {
        // TODO: Get current user ID from security context
        Long currentUserId = 1L; // Temporary hardcoded
        Recipe savedRecipe = recipeService.createRecipe(recipe, currentUserId);
        return ResponseEntity.ok(savedRecipe);
    }

    /**
     * Cập nhật recipe - CHEF và ADMIN
     */
    @PutMapping("/recipes/{id}")
    public ResponseEntity<Recipe> updateRecipe(
            @PathVariable Long id,
            @RequestBody Recipe recipe) {
        // TODO: Get current user ID from security context
        Long currentUserId = 1L; // Temporary hardcoded
        Recipe updatedRecipe = recipeService.updateRecipe(id, recipe, currentUserId);
        return ResponseEntity.ok(updatedRecipe);
    }

    /**
     * Xóa recipe - CHEF và ADMIN
     */
    @DeleteMapping("/recipes/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        // TODO: Get current user ID from security context
        Long currentUserId = 1L; // Temporary hardcoded
        recipeService.deleteRecipe(id, currentUserId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Dashboard thống kê cho Chef
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Object> getChefDashboard() {
        // TODO: Implement chef dashboard statistics
        return ResponseEntity.ok("Chef dashboard - CHEF/ADMIN only");
    }
}
