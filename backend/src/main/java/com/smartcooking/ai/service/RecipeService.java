package com.smartcooking.ai.service;

import com.smartcooking.ai.entity.Recipe;
import com.smartcooking.ai.entity.User;
import com.smartcooking.ai.repository.RecipeRepository;
import com.smartcooking.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Recipe Service - Quản lý công thức nấu ăn
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    /**
     * Tạo recipe mới
     */
    public Recipe createRecipe(Recipe recipe, Long authorId) {
        log.info("Creating new recipe: {} by user: {}", recipe.getTitleVi(), authorId);

        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found: " + authorId));

        recipe.setAuthor(author);

        // Set defaults
        if (recipe.getIsPublic() == null) {
            recipe.setIsPublic(true);
        }
        if (recipe.getSource() == null) {
            recipe.setSource(Recipe.Source.USER);
        }
        if (recipe.getViews() == null) {
            recipe.setViews(0);
        }
        if (recipe.getFavorites() == null) {
            recipe.setFavorites(0);
        }

        Recipe savedRecipe = recipeRepository.save(recipe);
        log.info("Recipe created successfully with ID: {}", savedRecipe.getId());
        return savedRecipe;
    }

    /**
     * Tạo AI-generated recipe
     */
    public Recipe createAIGeneratedRecipe(Recipe recipe, Long userId, String prompt, String model, Double confidence) {
        log.info("Creating AI-generated recipe: {} for user: {}", recipe.getTitleVi(), userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        recipe.setAuthor(user);
        recipe.setSource(Recipe.Source.AI_GENERATED);
        recipe.setAiPrompt(prompt);
        recipe.setAiModel(model);
        if (confidence != null) {
            recipe.setAiConfidence(java.math.BigDecimal.valueOf(confidence));
        }

        Recipe savedRecipe = recipeRepository.save(recipe);
        log.info("AI-generated recipe created with ID: {}", savedRecipe.getId());
        return savedRecipe;
    }

    /**
     * Update recipe
     */
    public Recipe updateRecipe(Long recipeId, Recipe updates, Long userId) {
        log.info("Updating recipe: {} by user: {}", recipeId, userId);

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found: " + recipeId));

        // Check if user is the author or admin
        if (!recipe.getAuthor().getId().equals(userId)) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));
            if (user.getRole() != User.Role.ADMIN) {
                throw new RuntimeException("Not authorized to update this recipe");
            }
        }

        // Update fields
        if (updates.getTitleVi() != null) {
            recipe.setTitleVi(updates.getTitleVi());
        }
        if (updates.getTitleEn() != null) {
            recipe.setTitleEn(updates.getTitleEn());
        }
        if (updates.getDescriptionVi() != null) {
            recipe.setDescriptionVi(updates.getDescriptionVi());
        }
        if (updates.getDescriptionEn() != null) {
            recipe.setDescriptionEn(updates.getDescriptionEn());
        }
        if (updates.getImageUrl() != null) {
            recipe.setImageUrl(updates.getImageUrl());
        }
        if (updates.getCookingTime() != null) {
            recipe.setCookingTime(updates.getCookingTime());
        }
        if (updates.getDifficulty() != null) {
            recipe.setDifficulty(updates.getDifficulty());
        }
        if (updates.getServings() != null) {
            recipe.setServings(updates.getServings());
        }
        if (updates.getCalories() != null) {
            recipe.setCalories(updates.getCalories());
        }
        if (updates.getIsPublic() != null) {
            recipe.setIsPublic(updates.getIsPublic());
        }
        if (updates.getCategory() != null) {
            recipe.setCategory(updates.getCategory());
        }

        Recipe savedRecipe = recipeRepository.save(recipe);
        log.info("Recipe updated: {}", recipeId);
        return savedRecipe;
    }

    /**
     * Delete recipe
     */
    public void deleteRecipe(Long recipeId, Long userId) {
        log.info("Deleting recipe: {} by user: {}", recipeId, userId);

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found: " + recipeId));

        // Check if user is the author or admin
        if (!recipe.getAuthor().getId().equals(userId)) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));
            if (user.getRole() != User.Role.ADMIN) {
                throw new RuntimeException("Not authorized to delete this recipe");
            }
        }

        recipeRepository.delete(recipe);
        log.info("Recipe deleted: {}", recipeId);
    }

    /**
     * Get recipe by ID
     */
    @Transactional(readOnly = true)
    public Optional<Recipe> getRecipeById(Long recipeId) {
        return recipeRepository.findById(recipeId);
    }

    /**
     * Get recipe by ID and increment views
     */
    public Recipe getRecipeByIdAndIncrementViews(Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found: " + recipeId));

        recipe.incrementViews();
        return recipeRepository.save(recipe);
    }

    /**
     * Get public recipes
     */
    @Transactional(readOnly = true)
    public List<Recipe> getPublicRecipes() {
        return recipeRepository.findByIsPublicTrue();
    }

    /**
     * Get recipes by author
     */
    @Transactional(readOnly = true)
    public List<Recipe> getRecipesByAuthor(Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found: " + authorId));
        return recipeRepository.findByAuthor(author);
    }

    /**
     * Get recipes by category
     */
    @Transactional(readOnly = true)
    public List<Recipe> getRecipesByCategory(Long categoryId) {
        return recipeRepository.findByCategoryId(categoryId);
    }

    /**
     * Get recipes by difficulty
     */
    @Transactional(readOnly = true)
    public List<Recipe> getRecipesByDifficulty(Recipe.Difficulty difficulty) {
        return recipeRepository.findByDifficulty(difficulty);
    }

    /**
     * Search recipes by title
     */
    @Transactional(readOnly = true)
    public List<Recipe> searchRecipesByTitle(String keyword) {
        return recipeRepository.searchByTitle(keyword);
    }

    /**
     * Full text search
     */
    @Transactional(readOnly = true)
    public Page<Recipe> fullTextSearch(String keyword, Pageable pageable) {
        return recipeRepository.fullTextSearch(keyword, pageable);
    }

    /**
     * Get popular recipes
     */
    @Transactional(readOnly = true)
    public Page<Recipe> getPopularRecipes(Double minRating, Pageable pageable) {
        return recipeRepository.findPopularRecipes(minRating, pageable);
    }

    /**
     * Get top rated recipes
     */
    @Transactional(readOnly = true)
    public Page<Recipe> getTopRatedRecipes(Pageable pageable) {
        return recipeRepository.findTopRatedRecipes(pageable);
    }

    /**
     * Get recipes by ingredient
     */
    @Transactional(readOnly = true)
    public List<Recipe> getRecipesByIngredient(String ingredient) {
        return recipeRepository.findByIngredient(ingredient);
    }

    /**
     * Get recipes by available ingredients
     */
    @Transactional(readOnly = true)
    public List<Recipe> getRecipesByAvailableIngredients(List<String> ingredients, int minMatching) {
        return recipeRepository.findRecipesByAvailableIngredients(
                ingredients.stream().map(String::toLowerCase).toList(),
                (long) minMatching);
    }

    /**
     * Get recipes near location
     */
    @Transactional(readOnly = true)
    public List<Recipe> getRecipesNearLocation(Double latitude, Double longitude, Double radiusKm) {
        return recipeRepository.findRecipesNearLocation(latitude, longitude, radiusKm);
    }

    /**
     * Get AI-generated recipes
     */
    @Transactional(readOnly = true)
    public List<Recipe> getAIGeneratedRecipes() {
        return recipeRepository.findBySource(Recipe.Source.AI_GENERATED);
    }

    /**
     * Get recipes by region
     */
    @Transactional(readOnly = true)
    public List<Recipe> getRecipesByRegion(String region) {
        return recipeRepository.findByOriginRegion(region);
    }

    /**
     * Get favorite recipes by user
     */
    @Transactional(readOnly = true)
    public List<Recipe> getFavoriteRecipesByUser(Long userId) {
        return recipeRepository.findFavoriteRecipesByUserId(userId);
    }

    /**
     * Add recipe to favorites
     */
    public void addToFavorites(Long recipeId, Long userId) {
        log.info("Adding recipe {} to favorites for user {}", recipeId, userId);

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found: " + recipeId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        user.addFavoriteRecipe(recipe);
        recipe.incrementFavorites();

        userRepository.save(user);
        recipeRepository.save(recipe);

        log.info("Recipe added to favorites successfully");
    }

    /**
     * Remove recipe from favorites
     */
    public void removeFromFavorites(Long recipeId, Long userId) {
        log.info("Removing recipe {} from favorites for user {}", recipeId, userId);

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found: " + recipeId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        user.removeFavoriteRecipe(recipe);
        recipe.decrementFavorites();

        userRepository.save(user);
        recipeRepository.save(recipe);

        log.info("Recipe removed from favorites successfully");
    }

    /**
     * Get recipes by cooking time (quick recipes)
     */
    @Transactional(readOnly = true)
    public List<Recipe> getQuickRecipes(Integer maxCookingTime) {
        return recipeRepository.findByCookingTimeLessThanEqual(maxCookingTime);
    }

    /**
     * Get low-calorie recipes
     */
    @Transactional(readOnly = true)
    public List<Recipe> getLowCalorieRecipes(Integer maxCalories) {
        return recipeRepository.findByCaloriesLessThanEqual(maxCalories);
    }

    /**
     * Get recipe statistics
     */
    @Transactional(readOnly = true)
    public RecipeStatistics getRecipeStatistics() {
        long totalRecipes = recipeRepository.count();
        long publicRecipes = recipeRepository.findByIsPublicTrue().size();
        long aiGeneratedRecipes = recipeRepository.findBySource(Recipe.Source.AI_GENERATED).size();

        return RecipeStatistics.builder()
                .totalRecipes(totalRecipes)
                .publicRecipes(publicRecipes)
                .aiGeneratedRecipes(aiGeneratedRecipes)
                .userGeneratedRecipes(totalRecipes - aiGeneratedRecipes)
                .build();
    }

    /**
     * Get recipes created in date range
     */
    @Transactional(readOnly = true)
    public List<Recipe> getRecipesCreatedInDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return recipeRepository.findRecipesCreatedBetween(startDate, endDate);
    }

    /**
     * Recipe Statistics DTO
     */
    @lombok.Data
    @lombok.Builder
    public static class RecipeStatistics {
        private long totalRecipes;
        private long publicRecipes;
        private long aiGeneratedRecipes;
        private long userGeneratedRecipes;
    }
}
