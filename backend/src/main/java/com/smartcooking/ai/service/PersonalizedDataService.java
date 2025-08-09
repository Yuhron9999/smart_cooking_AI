package com.smartcooking.ai.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

@Service
public class PersonalizedDataService {

    public Map<String, Object> getPersonalizedRecommendations(String userId) {
        Map<String, Object> recommendations = new HashMap<>();

        // Mock personalized data - replace with actual business logic
        recommendations.put("recommendedRecipes", getRecommendedRecipes(userId));
        recommendations.put("preferredCuisines", getPreferredCuisines(userId));
        recommendations.put("dietaryRestrictions", getDietaryRestrictions(userId));
        recommendations.put("cookingSkillLevel", getCookingSkillLevel(userId));

        return recommendations;
    }

    public Map<String, Object> getUserPreferences(String userId) {
        Map<String, Object> preferences = new HashMap<>();

        // Mock user preferences
        preferences.put("favoriteIngredients", List.of("chicken", "vegetables", "rice"));
        preferences.put("dislikedIngredients", List.of("mushrooms", "seafood"));
        preferences.put("cookingTime", "30-45 minutes");
        preferences.put("servingSize", 4);

        return preferences;
    }

    public void updateUserPreferences(String userId, Map<String, Object> preferences) {
        // Mock implementation - replace with actual database operations
        // In a real implementation, this would update user preferences in database
    }

    public List<Map<String, Object>> getPersonalizedContent(String userId, String contentType) {
        List<Map<String, Object>> content = new ArrayList<>();

        switch (contentType.toLowerCase()) {
            case "recipes":
                content = getRecommendedRecipes(userId);
                break;
            case "tips":
                content = getCookingTips(userId);
                break;
            case "tutorials":
                content = getCookingTutorials(userId);
                break;
            default:
                // Return general content
                break;
        }

        return content;
    }

    private List<Map<String, Object>> getRecommendedRecipes(String userId) {
        List<Map<String, Object>> recipes = new ArrayList<>();

        // Mock recommended recipes
        Map<String, Object> recipe1 = new HashMap<>();
        recipe1.put("id", "rec_001");
        recipe1.put("title", "Gà nướng mật ong");
        recipe1.put("difficulty", "medium");
        recipe1.put("cookingTime", "45 minutes");
        recipe1.put("rating", 4.5);
        recipes.add(recipe1);

        Map<String, Object> recipe2 = new HashMap<>();
        recipe2.put("id", "rec_002");
        recipe2.put("title", "Cơm chiên dương châu");
        recipe2.put("difficulty", "easy");
        recipe2.put("cookingTime", "25 minutes");
        recipe2.put("rating", 4.2);
        recipes.add(recipe2);

        return recipes;
    }

    // Method cho meal plan
    public List<Map<String, Object>> getPersonalizedMealPlan(Long userId, int days) {
        List<Map<String, Object>> mealPlan = new ArrayList<>();

        for (int i = 0; i < days; i++) {
            Map<String, Object> recipe = new HashMap<>();
            recipe.put("id", (long) (i + 10));
            recipe.put("title", "Bữa ăn ngày " + (i + 1));
            recipe.put("cookingTime", 45);
            recipe.put("difficulty", "easy");
            recipe.put("servings", 4);
            mealPlan.add(recipe);
        }

        return mealPlan;
    }

    // Method cho cooking trends analysis
    public String analyzeCookingTrends(Long userId) {
        return "Phân tích xu hướng nấu ăn: Bạn thường nấu các món Á, ưa thích độ khó trung bình, " +
                "thời gian nấu trung bình 30-45 phút.";
    }

    private List<String> getPreferredCuisines(String userId) {
        return List.of("Vietnamese", "Asian", "Italian", "Mediterranean");
    }

    private List<String> getDietaryRestrictions(String userId) {
        return List.of("No seafood", "Low sodium");
    }

    private String getCookingSkillLevel(String userId) {
        return "intermediate";
    }

    private List<Map<String, Object>> getCookingTips(String userId) {
        List<Map<String, Object>> tips = new ArrayList<>();

        Map<String, Object> tip1 = new HashMap<>();
        tip1.put("id", "tip_001");
        tip1.put("title", "Cách ướp thịt gà để thấm gia vị");
        tip1.put("content", "Ướp thịt gà ít nhất 30 phút trước khi nấu...");
        tips.add(tip1);

        return tips;
    }

    private List<Map<String, Object>> getCookingTutorials(String userId) {
        List<Map<String, Object>> tutorials = new ArrayList<>();

        Map<String, Object> tutorial1 = new HashMap<>();
        tutorial1.put("id", "tut_001");
        tutorial1.put("title", "Hướng dẫn nướng thịt cơ bản");
        tutorial1.put("videoUrl", "https://example.com/tutorial1");
        tutorial1.put("duration", "10 minutes");
        tutorials.add(tutorial1);

        return tutorials;
    }
}
