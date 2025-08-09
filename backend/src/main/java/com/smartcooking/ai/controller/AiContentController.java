package com.smartcooking.ai.controller;

import com.smartcooking.ai.dto.AiGenerationRequestDTO;
import com.smartcooking.ai.dto.AiGenerationResponseDTO;
import com.smartcooking.ai.service.AiGenerationService;
import com.smartcooking.ai.service.PersonalizedDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller để quản lý tạo nội dung bằng AI và nội dung cá nhân hóa
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiContentController {

    private final AiGenerationService aiGenerationService;
    private final PersonalizedDataService personalizedDataService;

    /**
     * Tạo nội dung bằng AI
     */
    @PostMapping("/generate")
    public ResponseEntity<AiGenerationResponseDTO> generateContent(@RequestBody AiGenerationRequestDTO request) {
        AiGenerationResponseDTO response = aiGenerationService.generateContent(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Tạo công thức nấu ăn bằng AI
     */
    @PostMapping("/generate/recipe")
    public ResponseEntity<AiGenerationResponseDTO> generateRecipe(@RequestBody AiGenerationRequestDTO request) {
        // Đặt loại nội dung là RECIPE
        request.setGenerationType("RECIPE");
        AiGenerationResponseDTO response = aiGenerationService.generateContent(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Tạo kế hoạch bữa ăn bằng AI
     */
    @PostMapping("/generate/meal-plan")
    public ResponseEntity<AiGenerationResponseDTO> generateMealPlan(@RequestBody AiGenerationRequestDTO request) {
        // Đặt loại nội dung là MEAL_PLAN
        request.setGenerationType("MEAL_PLAN");
        AiGenerationResponseDTO response = aiGenerationService.generateContent(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy công thức được gợi ý cho người dùng
     */
    @GetMapping("/recommend/recipes/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getRecommendedRecipes(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "5") int limit) {

        List<Map<String, Object>> recommendations = personalizedDataService.getPersonalizedMealPlan(userId, limit);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Lấy kế hoạch bữa ăn được cá nhân hóa cho người dùng
     */
    @GetMapping("/recommend/meal-plan/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getPersonalizedMealPlan(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "7") int days) {

        List<Map<String, Object>> mealPlan = personalizedDataService.getPersonalizedMealPlan(userId, days);
        return ResponseEntity.ok(mealPlan);
    }

    /**
     * Phân tích xu hướng nấu ăn của người dùng
     */
    @GetMapping("/analyze/cooking-trends/{userId}")
    public ResponseEntity<String> analyzeCookingTrends(@PathVariable Long userId) {
        String analysis = personalizedDataService.analyzeCookingTrends(userId);
        return ResponseEntity.ok(analysis);
    }
}
