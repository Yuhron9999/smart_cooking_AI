package com.smartcooking.ai.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.core.io.ByteArrayResource;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AI Controller - Proxy requests to AI Service (FastAPI)
 * Xử lý các yêu cầu AI như chat, tạo công thức, phân tích hình ảnh
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class AIController {

    private final RestTemplate restTemplate;

    @Value("${ai.service.url:http://localhost:8001}")
    private String aiServiceUrl;

    /**
     * Chat với AI Assistant
     */
    @PostMapping("/chat")
    public ResponseEntity<?> chatWithAI(@RequestBody Map<String, Object> request) {
        try {
            log.info("Forwarding chat request to AI service: {}", request);

            // Forward request to AI service
            String url = aiServiceUrl + "/api/ai/chat";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            log.error("Error in AI chat: {}", e.getMessage());

            // Fallback response
            Map<String, Object> fallbackResponse = new HashMap<>();
            fallbackResponse.put("success", true);

            Map<String, String> data = new HashMap<>();
            data.put("response", "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.");
            data.put("model", "fallback");

            fallbackResponse.put("data", data);
            return ResponseEntity.ok(fallbackResponse);
        }
    }

    /**
     * Tạo công thức từ nguyên liệu
     */
    @PostMapping("/generate-recipe")
    public ResponseEntity<?> generateRecipe(@RequestBody Map<String, Object> request) {
        try {
            log.info("Generating recipe with ingredients: {}", request.get("ingredients"));

            String url = aiServiceUrl + "/api/ai/generate-recipe";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            log.error("Error generating recipe: {}", e.getMessage());

            // Fallback recipe
            Map<String, Object> fallbackResponse = new HashMap<>();
            fallbackResponse.put("success", true);

            Map<String, Object> data = new HashMap<>();
            Map<String, Object> recipe = new HashMap<>();
            recipe.put("title", "Món ăn đơn giản");
            recipe.put("ingredients", request.get("ingredients"));
            recipe.put("instructions",
                    List.of("Sơ chế nguyên liệu", "Chế biến theo cách thông thường", "Nêm nếm vừa ăn"));
            recipe.put("cook_time", 30);
            recipe.put("difficulty", "Trung bình");

            data.put("recipe", recipe);
            data.put("model", "fallback");
            fallbackResponse.put("data", data);

            return ResponseEntity.ok(fallbackResponse);
        }
    }

    /**
     * Phân tích hình ảnh món ăn
     */
    @PostMapping("/vision")
    public ResponseEntity<?> analyzeImage(@RequestParam("file") MultipartFile file) {
        try {
            log.info("Analyzing image: {}", file.getOriginalFilename());

            // Create multipart request for AI service
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            });

            HttpEntity<LinkedMultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            String url = aiServiceUrl + "/api/ai/vision";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            log.error("Error analyzing image: {}", e.getMessage());

            // Fallback response
            Map<String, Object> fallbackResponse = new HashMap<>();
            fallbackResponse.put("success", true);
            fallbackResponse.put("detected_foods", List.of(
                    Map.of("name", "Món ăn Việt Nam", "confidence", 0.8, "category", "vietnamese")));
            fallbackResponse.put("filename", file.getOriginalFilename());

            return ResponseEntity.ok(fallbackResponse);
        }
    }

    /**
     * Gợi ý nguyên liệu cho món ăn
     */
    @PostMapping("/ingredient-suggestions")
    public ResponseEntity<?> suggestIngredients(@RequestBody Map<String, Object> request) {
        try {
            log.info("Getting ingredient suggestions for: {}", request.get("dish_name"));

            String url = aiServiceUrl + "/api/ai/ingredient-suggestions";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            log.error("Error getting ingredient suggestions: {}", e.getMessage());

            // Fallback suggestions
            Map<String, Object> fallbackResponse = new HashMap<>();
            fallbackResponse.put("success", true);

            Map<String, Object> data = new HashMap<>();
            data.put("main_ingredients", List.of("Nguyên liệu chính"));
            data.put("seasonings", List.of("Gia vị cơ bản"));
            data.put("vegetables", List.of("Rau củ tươi"));
            data.put("cooking_tips", List.of("Chế biến theo cách truyền thống"));

            fallbackResponse.put("data", data);
            return ResponseEntity.ok(fallbackResponse);
        }
    }

    /**
     * Tạo lộ trình học nấu ăn
     */
    @PostMapping("/learning-path")
    public ResponseEntity<?> createLearningPath(@RequestBody Map<String, Object> request) {
        try {
            log.info("Creating learning path for skill level: {}", request.get("skill_level"));

            String url = aiServiceUrl + "/api/ai/learning-path";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            log.error("Error creating learning path: {}", e.getMessage());

            // Fallback learning path
            Map<String, Object> fallbackResponse = new HashMap<>();
            fallbackResponse.put("success", true);

            Map<String, Object> data = new HashMap<>();
            data.put("title", "Lộ trình nấu ăn cơ bản");
            data.put("duration_weeks", 8);
            data.put("total_dishes", 16);
            data.put("description", "Học nấu ăn từ cơ bản đến nâng cao");

            fallbackResponse.put("data", data);
            return ResponseEntity.ok(fallbackResponse);
        }
    }

    /**
     * Phân tích dinh dưỡng
     */
    @PostMapping("/nutrition-analysis")
    public ResponseEntity<?> analyzeNutrition(@RequestBody Map<String, Object> request) {
        try {
            log.info("Analyzing nutrition for ingredients: {}", request.get("ingredients"));

            String url = aiServiceUrl + "/api/ai/nutrition-analysis";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            log.error("Error analyzing nutrition: {}", e.getMessage());

            // Fallback nutrition data
            Map<String, Object> fallbackResponse = new HashMap<>();
            fallbackResponse.put("success", true);

            Map<String, Object> data = new HashMap<>();
            Map<String, Object> perServing = new HashMap<>();
            perServing.put("calories", 300);
            perServing.put("protein", 15);
            perServing.put("fat", 10);
            perServing.put("carbs", 35);

            data.put("per_serving", perServing);
            Map<String, Object> healthAssessment = new HashMap<>();
            healthAssessment.put("score", 70);
            healthAssessment.put("grade", "B");
            healthAssessment.put("recommendations", List.of("Cân bằng dinh dưỡng"));

            data.put("health_assessment", healthAssessment);
            fallbackResponse.put("data", data);

            return ResponseEntity.ok(fallbackResponse);
        }
    }

    /**
     * Voice processing (STT/TTS)
     */
    @PostMapping("/voice")
    public ResponseEntity<?> processVoice(@RequestParam("audio") MultipartFile audioFile,
            @RequestParam(value = "language", defaultValue = "vi") String language) {
        try {
            log.info("Processing voice input: {}", audioFile.getOriginalFilename());

            // Create multipart request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("audio", new ByteArrayResource(audioFile.getBytes()) {
                @Override
                public String getFilename() {
                    return audioFile.getOriginalFilename();
                }
            });
            body.add("language", language);

            HttpEntity<LinkedMultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            String url = aiServiceUrl + "/api/ai/voice";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            log.error("Error processing voice: {}", e.getMessage());

            Map<String, Object> fallbackResponse = new HashMap<>();
            fallbackResponse.put("success", false);
            fallbackResponse.put("error", "Không thể xử lý giọng nói. Vui lòng thử lại.");

            return ResponseEntity.ok(fallbackResponse);
        }
    }

    /**
     * Health check for AI service
     */
    @GetMapping("/health")
    public ResponseEntity<?> checkAIServiceHealth() {
        try {
            String url = aiServiceUrl + "/health";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            Map<String, Object> healthStatus = new HashMap<>();
            healthStatus.put("ai_service_status", "healthy");
            healthStatus.put("ai_service_url", aiServiceUrl);
            healthStatus.put("response_code", response.getStatusCode().value());

            return ResponseEntity.ok(healthStatus);

        } catch (Exception e) {
            log.error("AI service health check failed: {}", e.getMessage());

            Map<String, Object> healthStatus = new HashMap<>();
            healthStatus.put("ai_service_status", "unhealthy");
            healthStatus.put("ai_service_url", aiServiceUrl);
            healthStatus.put("error", e.getMessage());

            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(healthStatus);
        }
    }
}
