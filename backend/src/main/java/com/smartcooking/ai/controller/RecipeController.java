package com.smartcooking.ai.controller;

import com.smartcooking.ai.entity.Recipe;
import com.smartcooking.ai.service.RecipeService;
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
 * Recipe Controller - REST API cho quản lý công thức nấu ăn
 */
@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class RecipeController {

    private final RecipeService recipeService;

    /**
     * Tạo recipe mới
     */
    @PostMapping
    public ResponseEntity<Recipe> createRecipe(@RequestBody Recipe recipe, @RequestParam Long authorId) {
        try {
            Recipe createdRecipe = recipeService.createRecipe(recipe, authorId);
            return ResponseEntity.ok(createdRecipe);
        } catch (Exception e) {
            log.error("Error creating recipe: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tạo AI-generated recipe
     */
    @PostMapping("/ai-generated")
    public ResponseEntity<Recipe> createAIGeneratedRecipe(@RequestBody Recipe recipe,
            @RequestParam Long userId,
            @RequestParam String prompt,
            @RequestParam String model,
            @RequestParam(required = false) Double confidence) {
        try {
            Recipe createdRecipe = recipeService.createAIGeneratedRecipe(recipe, userId, prompt, model, confidence);
            return ResponseEntity.ok(createdRecipe);
        } catch (Exception e) {
            log.error("Error creating AI-generated recipe: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy recipe theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable Long id) {
        return recipeService.getRecipeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Lấy recipe theo ID và tăng views
     */
    @GetMapping("/{id}/view")
    public ResponseEntity<Recipe> getRecipeByIdAndIncrementViews(@PathVariable Long id) {
        try {
            Recipe recipe = recipeService.getRecipeByIdAndIncrementViews(id);
            return ResponseEntity.ok(recipe);
        } catch (Exception e) {
            log.error("Error getting recipe: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Cập nhật recipe
     */
    @PutMapping("/{id}")
    public ResponseEntity<Recipe> updateRecipe(@PathVariable Long id, @RequestBody Recipe updates,
            @RequestParam Long userId) {
        try {
            Recipe updatedRecipe = recipeService.updateRecipe(id, updates, userId);
            return ResponseEntity.ok(updatedRecipe);
        } catch (Exception e) {
            log.error("Error updating recipe: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Xóa recipe
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id, @RequestParam Long userId) {
        try {
            recipeService.deleteRecipe(id, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting recipe: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy public recipes
     */
    @GetMapping("/public")
    public ResponseEntity<List<Recipe>> getPublicRecipes() {
        List<Recipe> recipes = recipeService.getPublicRecipes();
        return ResponseEntity.ok(recipes);
    }

    /**
     * Lấy recipes theo author
     */
    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<Recipe>> getRecipesByAuthor(@PathVariable Long authorId) {
        List<Recipe> recipes = recipeService.getRecipesByAuthor(authorId);
        return ResponseEntity.ok(recipes);
    }

    /**
     * Lấy recipes theo category
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Recipe>> getRecipesByCategory(@PathVariable Long categoryId) {
        List<Recipe> recipes = recipeService.getRecipesByCategory(categoryId);
        return ResponseEntity.ok(recipes);
    }

    /**
     * Lấy recipes theo difficulty
     */
    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<Recipe>> getRecipesByDifficulty(@PathVariable String difficulty) {
        try {
            Recipe.Difficulty recipeDifficulty = Recipe.Difficulty.valueOf(difficulty.toUpperCase());
            List<Recipe> recipes = recipeService.getRecipesByDifficulty(recipeDifficulty);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            log.error("Error getting recipes by difficulty: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Search recipes theo title
     */
    @GetMapping("/search/title")
    public ResponseEntity<List<Recipe>> searchRecipesByTitle(@RequestParam String keyword) {
        List<Recipe> recipes = recipeService.searchRecipesByTitle(keyword);
        return ResponseEntity.ok(recipes);
    }

    /**
     * Full text search
     */
    @GetMapping("/search")
    public ResponseEntity<Page<Recipe>> fullTextSearch(@RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Recipe> recipes = recipeService.fullTextSearch(keyword, pageable);
        return ResponseEntity.ok(recipes);
    }

    /**
     * Lấy popular recipes
     */
    @GetMapping("/popular")
    public ResponseEntity<Page<Recipe>> getPopularRecipes(@RequestParam(defaultValue = "4.0") Double minRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Recipe> recipes = recipeService.getPopularRecipes(minRating, pageable);
        return ResponseEntity.ok(recipes);
    }

    /**
     * Lấy top rated recipes
     */
    @GetMapping("/top-rated")
    public ResponseEntity<Page<Recipe>> getTopRatedRecipes(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Recipe> recipes = recipeService.getTopRatedRecipes(pageable);
        return ResponseEntity.ok(recipes);
    }

    /**
     * Lấy recipes theo ingredient
     */
    @GetMapping("/ingredient/{ingredient}")
    public ResponseEntity<List<Recipe>> getRecipesByIngredient(@PathVariable String ingredient) {
        List<Recipe> recipes = recipeService.getRecipesByIngredient(ingredient);
        return ResponseEntity.ok(recipes);
    }

    /**
     * Lấy recipes theo available ingredients
     */
    @PostMapping("/available-ingredients")
    public ResponseEntity<List<Recipe>> getRecipesByAvailableIngredients(@RequestBody Map<String, Object> requestData) {
        try {
            @SuppressWarnings("unchecked")
            List<String> ingredients = (List<String>) requestData.get("ingredients");
            Integer minMatching = (Integer) requestData.getOrDefault("minMatching", 1);

            List<Recipe> recipes = recipeService.getRecipesByAvailableIngredients(ingredients, minMatching);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            log.error("Error getting recipes by available ingredients: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy recipes gần vị trí
     */
    @GetMapping("/nearby")
    public ResponseEntity<List<Recipe>> getRecipesNearLocation(@RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "50.0") Double radiusKm) {
        List<Recipe> recipes = recipeService.getRecipesNearLocation(latitude, longitude, radiusKm);
        return ResponseEntity.ok(recipes);
    }

    /**
     * Lấy AI-generated recipes
     */
    @GetMapping("/ai-generated")
    public ResponseEntity<List<Recipe>> getAIGeneratedRecipes() {
        List<Recipe> recipes = recipeService.getAIGeneratedRecipes();
        return ResponseEntity.ok(recipes);
    }

    /**
     * Lấy recipes theo region
     */
    @GetMapping("/region/{region}")
    public ResponseEntity<List<Recipe>> getRecipesByRegion(@PathVariable String region) {
        List<Recipe> recipes = recipeService.getRecipesByRegion(region);
        return ResponseEntity.ok(recipes);
    }

    /**
     * Lấy favorite recipes của user
     */
    @GetMapping("/favorites/{userId}")
    public ResponseEntity<List<Recipe>> getFavoriteRecipesByUser(@PathVariable Long userId) {
        List<Recipe> recipes = recipeService.getFavoriteRecipesByUser(userId);
        return ResponseEntity.ok(recipes);
    }

    /**
     * Thêm recipe vào favorites
     */
    @PostMapping("/{recipeId}/favorites")
    public ResponseEntity<Void> addToFavorites(@PathVariable Long recipeId, @RequestParam Long userId) {
        try {
            recipeService.addToFavorites(recipeId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error adding to favorites: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Xóa recipe khỏi favorites
     */
    @DeleteMapping("/{recipeId}/favorites")
    public ResponseEntity<Void> removeFromFavorites(@PathVariable Long recipeId, @RequestParam Long userId) {
        try {
            recipeService.removeFromFavorites(recipeId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error removing from favorites: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy quick recipes (dưới x phút)
     */
    @GetMapping("/quick")
    public ResponseEntity<List<Recipe>> getQuickRecipes(@RequestParam(defaultValue = "30") Integer maxCookingTime) {
        List<Recipe> recipes = recipeService.getQuickRecipes(maxCookingTime);
        return ResponseEntity.ok(recipes);
    }

    /**
     * Lấy low-calorie recipes
     */
    @GetMapping("/low-calorie")
    public ResponseEntity<List<Recipe>> getLowCalorieRecipes(@RequestParam(defaultValue = "500") Integer maxCalories) {
        List<Recipe> recipes = recipeService.getLowCalorieRecipes(maxCalories);
        return ResponseEntity.ok(recipes);
    }

    /**
     * Lấy recipe statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<RecipeService.RecipeStatistics> getRecipeStatistics() {
        RecipeService.RecipeStatistics stats = recipeService.getRecipeStatistics();
        return ResponseEntity.ok(stats);
    }
}
